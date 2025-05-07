import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { generateText, generateObject, tool } from 'ai'; // Added generateObject, tool
import { models } from './ai/models';
import dedent from 'dedent';
import * as diff from 'diff'; // Import the diff library
import { error } from 'console';
import { prCommentor } from './octokit/octokit';
import { updateBuildReport } from './octokit/commentReports';
import { logUsage } from './ai/usage/usageLogger';

// Schema for the .foxes file content
const FoxFileSchema = z.object({
  type: z.enum(['bug', 'feature', 'modification']),
  logs: z.string().optional(),
  error: z.any(),
  occuredAt: z.enum(['build', 'runtime']).optional(),
  notes: z.string().optional(),
});

// Schema for the generated fix plan
const FixPlanSchema = z.object({
  filesToFix: z.array(
    z.object({
      filePath: z
        .string()
        .describe('The path to the file that needs to be fixed'),
      errorContext: z
        .string()
        .describe(
          'The exact context of the error along with the detailed logs',
        ),
      modification: z
        .string()
        .describe(
          'The exact modification to be made to the file, along the reason for the modification',
        ),
    }),
  ),
});

type FoxFile = z.infer<typeof FoxFileSchema>;
type FixPlan = z.infer<typeof FixPlanSchema>;

// Define a type for the consolidated fixes
type ConsolidatedFixData = {
  originalContent: string;
  fixes: Array<{ errorContext: string; modification: string }>;
  foxFilePaths: string[]; // Keep track of originating fox files for logging/deletion
};

/**
 * Find all fox files within .foxes directories in the packages directory
 */
function findFoxFiles(): string[] {
  const packagesDir = path.join(process.cwd(), './packages');
  console.log('🔍 Searching for fox files in directory:', packagesDir);
  const foxFiles: string[] = [];

  function searchDirectory(dir: string) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Skip common build/dependency folders
          if (
            entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === 'build' ||
            entry.name === '.turbo' ||
            entry.name === '.git'
          ) {
            continue;
          }
          // If the directory is named .foxes, add all files within it
          if (entry.name === '.foxes') {
            try {
              const foxEntries = fs.readdirSync(fullPath, {
                withFileTypes: true,
              });
              for (const foxEntry of foxEntries) {
                if (foxEntry.isFile()) {
                  // Ensure the file has content before adding
                  if (
                    fs.statSync(path.join(fullPath, foxEntry.name)).size > 0
                  ) {
                    foxFiles.push(path.join(fullPath, foxEntry.name));
                  } else {
                    console.warn(
                      `Skipping empty fox file: ${path.join(fullPath, foxEntry.name)}`,
                    );
                  }
                }
              }
            } catch (e: any) {
              console.warn(
                `Skipping .foxes directory ${fullPath}: ${e.message}`,
              );
            }
          } else {
            // Otherwise, continue searching recursively
            searchDirectory(fullPath);
          }
        }
      }
    } catch (error: any) {
      // Ignore errors like permission denied
      if (error.code === 'EACCES' || error.code === 'ENOENT') {
        // console.warn(`Skipping directory ${dir}: ${error.message}`);
      } else {
        console.error(`Error searching directory ${dir}:`, error); // Log unexpected errors
        // Potentially re-throw or handle differently depending on desired strictness
      }
    }
  }

  searchDirectory(packagesDir);
  return foxFiles;
}

/**
 * Process a single fox file and generate a fix plan
 */
async function processFoxFile(filePath: string): Promise<FixPlan> {
  console.log(`📄 Reading fox file: ${path.relative(process.cwd(), filePath)}`);
  const content = fs.readFileSync(filePath, 'utf8');
  let foxFile: FoxFile;
  try {
    // Attempt to parse, skip if invalid JSON or schema violation
    foxFile = FoxFileSchema.parse(JSON.parse(content));
  } catch (e: any) {
    console.error(
      `❌ Failed to parse fox file ${path.relative(process.cwd(), filePath)}: ${e.message}. Skipping.`,
    );
    // Return an empty plan to skip this file
    return { filesToFix: [] };
  }

  const parentDir = path.dirname(filePath)?.replace('.foxes', '');

  const packageInfoPath = path.join(parentDir, 'package-info.json');
  const packageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));

  const allFilesInSrc = fs.readdirSync(path.join(parentDir, 'src'));

  console.log('🧠 Generating fix plan...');
  try {
    const { object: fixPlan, usage } = await generateObject({
      model: models.claude35Sonnet, // Using a more capable model
      schema: FixPlanSchema,
      prompt: dedent`
        Analyze the following build/runtime issue and generate a fix plan.
        The goal is to identify the exact file path(s) relative to the workspace root and the necessary modifications.

        Issue Details:
        Type: ${foxFile.type}
        Occurred at: ${foxFile.occuredAt}
        ${foxFile.logs ? `Logs:\n${foxFile.logs}` : ''}
        ${foxFile.notes ? `Notes:\n${foxFile.notes}` : ''}
        ${foxFile.error ? `Error:\n${JSON.stringify(foxFile.error)}` : ''}

        Workspace Root for context (do not include in filePaths): ${process.cwd().replace('/scripts', '')}

        Package Name: ${packageInfo.name}
        All packagefiles in src: ${allFilesInSrc.join(', ')}

        Instructions:
        1. Identify the file path(s) that need modification based on the logs and notes. Paths MUST be relative to the workspace root (e.g., "packages/package-name/src/index.ts").
        2. For each file, provide the 'errorContext' including relevant log snippets and line numbers if available.
        3. For each file, specify the 'modification' needed to fix the issue, explaining the logic clearly.

        Generate a JSON object conforming to the FixPlan schema.
      `,
    });
    logUsage(models.claude35Sonnet.modelId, usage);
    console.log(
      `✅ Fix plan generated for ${path.relative(process.cwd(), filePath)}`,
    );
    console.log(fixPlan);
    return fixPlan;
  } catch (error) {
    console.error(
      `❌ Error generating fix plan for ${path.relative(process.cwd(), filePath)}:`,
      error,
    );
    return { filesToFix: [] }; // Return empty plan on error
  }
}

/**
 * Apply fixes to a single file based on consolidated fix data by generating new file content
 */
async function applyConsolidatedFixesToFile(
  absoluteFilePath: string,
  consolidatedData: ConsolidatedFixData,
) {
  const relativeFilePath = path.relative(
    process.cwd().replace('/scripts', ''),
    absoluteFilePath,
  );
  console.log(
    `\n✏️ Attempting to fix ${relativeFilePath} with ${consolidatedData.fixes.length} modifications by generating new content...`,
  );

  try {
    // Combine all error contexts and modifications for the prompt
    const combinedContext = consolidatedData.fixes
      .map(
        (fix, index) =>
          `Modification ${index + 1}:\nError Context:\n${fix.errorContext}\nRequired Modification Logic:\n${fix.modification}`,
      )
      .join('\n\n');

    // Generate the complete fixed file content
    console.log(`   🧠 Generating new content for ${relativeFilePath}...`);
    const { text: generatedContent, usage } = await generateText({
      model: models.claude35Sonnet,
      prompt: dedent`
          You are an expert programmer tasked with fixing multiple issues in a single code file.
          Analyze the following original file content and the consolidated list of required modifications.
          Generate the **complete** file content with ALL the required modifications applied logically.
          Ensure the final code is correct and integrates all fixes harmoniously.
          Output ONLY the raw code for the fixed file.
          Do not include any explanations, comments, markdown formatting, or backticks around the code.

          File Path: ${relativeFilePath}

          Consolidated Modifications:
          --- START MODIFICATIONS ---
          ${combinedContext}
          --- END MODIFICATIONS ---

          Original File Content:
          --- START ORIGINAL FILE ---
          ${consolidatedData.originalContent}
          --- END ORIGINAL FILE ---

          Generate the new file content below:
        `,
      maxTokens: 8192, // Adjust as needed, might need more for large files
      temperature: 0.1,
    });
    logUsage(models.claude35Sonnet.modelId, usage);

    const trimmedContent = generatedContent.trim();

    if (!trimmedContent) {
      console.warn(
        `⚠️ Generated empty content for ${relativeFilePath}. Skipping rewrite.`,
      );
      return; // Skip writing if content is empty
    }

    // Write the generated content back to the file
    console.log(
      `   🔄 Rewriting ${relativeFilePath} with generated content...`,
    );
    fs.writeFileSync(absoluteFilePath, trimmedContent); // Overwrite with the new content
    console.log(`✅ Successfully rewrote ${relativeFilePath}`);
  } catch (error) {
    console.error(
      `❌ Error during fix application (rewrite) for ${relativeFilePath}:`,
      error,
    );
    // Decide if we should re-throw or handle differently
  }
}

/**
 * Main function to run the build error fixing process
 */
export async function fixPackage() {
  try {
    console.log('🔍 Searching for fox files in .foxes directories...');
    await updateBuildReport(
      'analyze',
      {
        status: 'in-progress',
        details: { step: 'searching fox files' },
      },
      process.cwd(),
    );

    const foxFilePaths = findFoxFiles();

    if (foxFilePaths.length === 0) {
      console.log(
        '✅ No fox files found in any .foxes directory. Nothing to fix.',
      );
      await updateBuildReport(
        'analyze',
        {
          status: 'success',
          details: { message: 'No fox files found' },
        },
        process.cwd(),
      );
      return;
    }

    console.log(`📂 Found ${foxFilePaths.length} fox files:`);
    foxFilePaths.forEach(f =>
      console.log(`  - ${path.relative(process.cwd(), f)}`),
    );

    await updateBuildReport(
      'analyze',
      {
        status: 'success',
        details: { filesFound: foxFilePaths.length },
      },
      process.cwd(),
    );

    // Map to store consolidated fixes: key = absoluteFilePath
    const consolidatedFixes = new Map<string, ConsolidatedFixData>();

    for (const foxFilePath of foxFilePaths) {
      const relativeFoxPath = path.relative(process.cwd(), foxFilePath);
      if (!foxFilePath.includes('packagefox-')) {
        console.log(
          `🔍 Skipping ${relativeFoxPath} as it is not a packagefox file`,
        );
        continue;
      }

      console.log(`\n🔧 Processing ${relativeFoxPath}...`);
      await updateBuildReport(
        'analyze',
        {
          status: 'in-progress',
          details: { currentFile: relativeFoxPath },
        },
        process.cwd(),
      );

      // Generate fix plan for the current fox file
      const fixPlan = await processFoxFile(foxFilePath);

      if (!fixPlan || fixPlan.filesToFix.length === 0) {
        console.log(`⏭️ No valid fixes identified for ${relativeFoxPath}.`);
        await updateBuildReport(
          'analyze',
          {
            status: 'success',
            details: { message: 'No fixes needed', file: relativeFoxPath },
          },
          process.cwd(),
        );
        try {
          console.log(
            `🗑️ Cleaned up ${relativeFoxPath} (no fixes planned or parse error).`,
          );
        } catch (e: any) {
          console.error(
            `⚠️ Failed to clean up ${relativeFoxPath}: ${e.message}`,
          );
        }
        continue;
      }

      // Consolidate fixes from this plan
      for (const fileFix of fixPlan.filesToFix) {
        const absoluteFilePath = path.resolve(
          process.cwd().replace('/scripts', ''),
          fileFix.filePath,
        );

        if (!fs.existsSync(absoluteFilePath)) {
          console.warn(
            `⚠️ File not found: ${fileFix.filePath} (absolute: ${absoluteFilePath}) mentioned in ${relativeFoxPath}. Skipping fix.`,
          );
          continue;
        }

        if (!consolidatedFixes.has(absoluteFilePath)) {
          const originalContent = fs.readFileSync(absoluteFilePath, 'utf8');
          consolidatedFixes.set(absoluteFilePath, {
            originalContent,
            fixes: [],
            foxFilePaths: [],
          });
        }

        const existingData = consolidatedFixes.get(absoluteFilePath)!;
        existingData.fixes.push({
          errorContext: fileFix.errorContext,
          modification: fileFix.modification,
        });
        if (!existingData.foxFilePaths.includes(foxFilePath)) {
          existingData.foxFilePaths.push(foxFilePath);
        }
      }
      console.log(`📈 Consolidated fixes from ${relativeFoxPath}.`);
    }

    console.log(
      `\n🔧 Applying consolidated fixes for ${consolidatedFixes.size} unique files...`,
    );

    await updateBuildReport(
      'apply',
      {
        status: 'in-progress',
        details: { filesToFix: consolidatedFixes.size },
      },
      process.cwd(),
    );

    // Apply consolidated fixes file by file
    for (const [
      absoluteFilePath,
      consolidatedData,
    ] of consolidatedFixes.entries()) {
      await applyConsolidatedFixesToFile(absoluteFilePath, consolidatedData);
      // Now delete the associated fox files after attempting the fix for this file
      for (const foxFilePath of consolidatedData.foxFilePaths) {
        try {
          if (fs.existsSync(foxFilePath)) {
            fs.unlinkSync(foxFilePath);
            console.log(
              `🗑️ Deleted ${path.relative(process.cwd(), foxFilePath)} after processing its fixes for ${path.relative(process.cwd().replace('/scripts', ''), absoluteFilePath)}.`,
            );
          }
        } catch (e: any) {
          console.error(
            `⚠️ Failed to delete processed fox file ${path.relative(process.cwd(), foxFilePath)}: ${e.message}`,
          );
        }
      }
    }

    await updateBuildReport(
      'apply',
      {
        status: 'success',
        details: { filesFixed: consolidatedFixes.size },
      },
      process.cwd(),
    );

    console.log(
      '\n✅ Fix application process complete based on consolidated plans. Please review the changes.',
    );
  } catch (error) {
    console.error('❌ Error during the build error fixing process:', error);
    await prCommentor.createComment({
      body: '❌ Sorry! Error during the build error fixing process: ' + error,
    });
    process.exitCode = 1;
  }
}

// Run the script if executed directly
if (require.main === module) {
  fixPackage()
    .then(() => {
      if (process.exitCode !== 1) {
        console.log('\n✨ Build error fixing process initiated successfully.');
        process.exit(0);
      } else {
        console.log('\n✨ Build error fixing process completed with errors.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error during script execution:', error);
      process.exit(1);
    });
}
