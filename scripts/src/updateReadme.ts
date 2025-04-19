#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateText } from 'ai';
import 'dotenv/config';
import { models } from './ai/models';
import dedent from 'dedent';

// Types
interface PackageInfo {
  name: string;
  description: string;
  version: string;
  keywords: string[];
  dependencies: string[];
}

interface FileDiffInfo {
  path: string;
  relativePath: string;
  diff: string;
}

// Configuration
const PACKAGES_DIR = path.resolve(__dirname, '../../packages');
const BASE_BRANCH = process.env.GITHUB_BASE_REF || 'main';
const HEAD_BRANCH = process.env.GITHUB_HEAD_REF || 'HEAD';
const COMMIT_TAG = '[skip-docs-update]';

// Git command helper
function runGitCommand(command: string): string {
  try {
    console.log('command', command);
    return execSync(command).toString().trim();
  } catch (error) {
    console.error(
      `Git command failed: ${command}`,
      error instanceof Error ? error.message : '',
    );
    return '';
  }
}

// Check if we should skip docs update
function shouldSkipUpdate(): boolean {
  try {
    const lastCommitMessage = runGitCommand('git log -1 --pretty=%B');
    return lastCommitMessage.includes(COMMIT_TAG);
  } catch (error) {
    return false;
  }
}

// Get changed files
function getChangedFiles(): string[] {
  try {
    // First fetch the base branch to make sure we're up-to-date
    runGitCommand(`git fetch origin ${BASE_BRANCH} --quiet`);

    // Get the list of changed files
    const diff = runGitCommand(
      `git diff --name-only origin/${BASE_BRANCH}...${HEAD_BRANCH}`,
    );

    return diff.split('\n').filter(file => file.trim() !== '');
  } catch (error) {
    console.error(
      'Failed to get changed files:',
      error instanceof Error ? error.message : '',
    );
    return [];
  }
}

// Map changes to packages
function mapChangesToPackages(
  changedFiles: string[],
): Record<string, string[]> {
  const packagesMap: Record<string, string[]> = {};

  changedFiles.forEach(file => {
    if (file.match(/^packages\/[^/]+\/src\/.*\.(js|ts)$/)) {
      const packageName = file.split('/')[1];
      if (!packagesMap[packageName]) {
        packagesMap[packageName] = [];
      }
      packagesMap[packageName].push(file);
    }
  });

  return packagesMap;
}

// Get file info
function getFileDiffInfo(filePath: string): FileDiffInfo | null {
  try {
    // Get the diff with context for the changed file
    const diff = runGitCommand(
      `git diff -U10 origin/${BASE_BRANCH}...${HEAD_BRANCH} -- "../${filePath}"`,
    );

    // Get filename without package prefix
    const relativePath = filePath.replace(/^packages\/[^/]+\//, '');

    if (!diff) {
      console.log(`No diff found for ${filePath}, skipping...`);
      return null;
    }

    return {
      path: filePath,
      relativePath,
      diff: diff.trim(),
    };
  } catch (error) {
    console.error(
      `Error getting file info for ${filePath}:`,
      error instanceof Error ? error.message : '',
    );
    return null;
  }
}

// Get package info
function getPackageInfo(packagePath: string): PackageInfo {
  const packageJsonPath = path.join(packagePath, 'package.json');

  try {
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
    const packageData = JSON.parse(packageJson);

    return {
      name: packageData.name || path.basename(packagePath),
      description: packageData.description || '',
      version: packageData.version || '',
      keywords: Array.isArray(packageData.keywords) ? packageData.keywords : [],
      dependencies: Object.keys(packageData.dependencies || {}),
    };
  } catch (error) {
    console.error(
      `Failed to read package.json for ${packagePath}:`,
      error instanceof Error ? error.message : '',
    );
    return {
      name: path.basename(packagePath),
      description: '',
      version: '',
      keywords: [],
      dependencies: [],
    };
  }
}

// Find markdown files
function findMarkdownFiles(packagePath: string): string[] {
  const mdFiles: string[] = [];

  const readmePath = path.join(packagePath, 'README.md');
  if (fs.existsSync(readmePath)) {
    mdFiles.push(readmePath);
  }

  const docsPath = path.join(packagePath, 'docs');
  if (fs.existsSync(docsPath) && fs.statSync(docsPath).isDirectory()) {
    try {
      const files = fs.readdirSync(docsPath);
      for (const file of files) {
        if (file.endsWith('.md')) {
          mdFiles.push(path.join(docsPath, file));
        }
      }
    } catch (error) {
      console.error(
        `Failed to read docs directory for ${packagePath}:`,
        error instanceof Error ? error.message : '',
      );
    }
  }

  return mdFiles;
}

// Generate content with AI SDK
async function generateContentWithAI(
  packageInfo: PackageInfo,
  fileInfos: FileDiffInfo[],
  currentDocFile: string,
  allDocFiles: string[],
): Promise<string> {
  try {
    const prompt = dedent`
        Documentation Update Request:
        
        Package Information:
        - Name: ${packageInfo.name}
        - Version: ${packageInfo.version}
        - Description: ${packageInfo.description}
        - Keywords: ${packageInfo.keywords.join(', ')}

        Documentation Context:
        - Current File: ${currentDocFile}
        ${
          allDocFiles?.length > 1
            ? `- Related Documentation Files:
        ${allDocFiles
          .filter(f => f !== currentDocFile)
          .map(f => `  - [${f}](./${f})`)
          .join('\n')}`
            : ''
        }

        Code Changes to Document:
        ${fileInfos
          .map(
            file => dedent`
        ## ${file.relativePath}
        \`\`\`diff
        ${file.diff}
        \`\`\`
        `,
          )
          .join('\n\n')}

        Documentation Requirements:
        1. CRITICALLY analyze each code change and its impact on documentation
        2. Update ONLY the sections affected by the code changes
        3. Maintain consistent formatting and style with existing documentation
        4. Include proper code examples with TypeScript types
        5. Add or update API documentation for modified functions
        6. Update version numbers if applicable
        7. Add any new dependencies to the appropriate sections
        8. Include setup instructions for any new features
        9. Document any breaking changes or deprecations
        10. Keep the documentation concise but comprehensive

        Documentation Structure to Follow:
        - Project Overview
        - Installation
        - Usage
        - API Reference
        - Examples
        - Configuration
        - Dependencies

        Return ONLY the updated markdown content, without any surrounding explanation.`;

    const { text, usage } = await generateText({
      model: models.claude35Sonnet,
      system:
        dedent(`You are a documentation expert specializing in creating comprehensive and well-structured Documentation files for TypeScript/JavaScript projects.
Your task is to ANALYZE code changes and update package documentation accordingly.

FOLLOW THESE GUIDELINES:
1. CRITICALLY analyze each code change before making documentation updates
2. ONLY update sections related to changed functions and features - DO NOT TOUCH UNCHANGED CODE DOCUMENTATION
3. Add clear, production-ready examples for new functions with proper TypeScript types
4. Update existing examples for modified functions to reflect changes ACCURATELY
5. MAINTAIN consistent formatting and style throughout the documentation
6. Keep the documentation concise but COMPREHENSIVE
7. Include proper code blocks with language specification
8. Add any new dependencies or requirements to the appropriate sections
9. Update version numbers if applicable
10. STRICTLY DO NOT modify existing content related to unchanged code unless it is INCORRECT or OUTDATED
11. DO NOT create new sections like "License" or "Contributing" unless specifically requested

REQUIRED DOCUMENTATION STRUCTURE:
- Project Overview
- Installation
- Usage
- API Reference
- Examples
- Configuration
- Dependencies

REASONING PROCESS:
1. Carefully analyze the code changes and their impact
2. Identify affected documentation sections
3. Plan documentation updates systematically
4. CRITICALLY evaluate and criticize your plan
5. Refine the plan to be specific to this documentation task
6. Keep maximum content in a single file for better maintainability
7. Review changes for completeness and accuracy
8. Ensure all examples are production-ready
9. Verify consistency with existing documentation
10. Double-check all technical details

Return ONLY the markdown content, without any surrounding explanation.`),
      prompt,
    });

    console.log('text', text);
    console.log('prompt', prompt);
    console.log('usage', usage);

    return text;
  } catch (error) {
    console.error(
      'Error generating content:',
      error instanceof Error ? error.message : '',
    );
    return `# ${packageInfo.name}\n\nThis documentation was not properly generated due to an error. Please check the package code for more information.`;
  }
}

// Update package docs
async function updatePackageDocs(
  packageName: string,
  fileInfos: FileDiffInfo[],
): Promise<void> {
  const packagePath = path.join(PACKAGES_DIR, packageName);
  const packageInfo = getPackageInfo(packagePath);

  const mdFiles = findMarkdownFiles(packagePath);
  console.log('mdFiles', mdFiles);

  if (mdFiles.length === 0) {
    const readmePath = path.join(packagePath, 'README.md');
    const generatedContent = await generateContentWithAI(
      packageInfo,
      fileInfos,
      'README.md',
      ['README.md'],
    );

    fs.writeFileSync(readmePath, generatedContent);
    console.log(`Created new README.md for ${packageInfo.name}`);
    return;
  }

  // Get relative paths for all markdown files
  const relativePaths = mdFiles.map(file => path.relative(packagePath, file));

  // Update each markdown file
  for (const mdFile of mdFiles) {
    const relativePath = path.relative(packagePath, mdFile);
    console.log(`Generating content for ${relativePath}...`);

    const generatedContent = await generateContentWithAI(
      packageInfo,
      fileInfos,
      relativePath,
      relativePaths,
    );

    fs.writeFileSync(mdFile, generatedContent);
    console.log(`Updated ${relativePath} for ${packageInfo.name}`);
  }
}

// Commit doc changes
function commitDocChanges(): void {
  if (!process.env.GITHUB_ACTIONS) {
    console.log('Not running in GitHub Actions, skipping commit');
    return;
  }

  try {
    const status = runGitCommand('git status --porcelain');
    if (!status) {
      console.log('No changes to commit');
      return;
    }

    runGitCommand('git config --global user.name "Documentation Bot"');
    runGitCommand('git config --global user.email "docs-bot@example.com"');
    runGitCommand('git add "packages/*/README.md" "packages/*/docs/*.md"');
    runGitCommand(
      `git commit -m "docs: update package documentation based on function changes ${COMMIT_TAG}"`,
    );
    runGitCommand(`git push origin ${HEAD_BRANCH}`);

    console.log('Documentation changes committed and pushed successfully');
  } catch (error) {
    console.error(
      'Error committing changes:',
      error instanceof Error ? error.message : '',
    );
  }
}

// Main function
async function main(): Promise<void> {
  try {
    if (shouldSkipUpdate()) {
      console.log('Skipping documentation update due to commit tag');
      return;
    }

    console.log('Fetching latest changes...');

    // Get the list of changed files
    const changedFiles = getChangedFiles();
    console.log('changedFiles', changedFiles);
    console.log(`Found ${changedFiles.length} changed files`);

    if (changedFiles.length === 0) {
      console.log('No changes detected. Exiting.');
      return;
    }

    const packageChanges = mapChangesToPackages(changedFiles);
    const packages = Object.keys(packageChanges);

    console.log(
      `Changes detected in ${packages.length} packages: ${packages.join(', ')}`,
    );

    if (packages.length === 0) {
      console.log('No relevant package changes found. Exiting.');
      return;
    }

    for (const packageName of packages) {
      const changedFiles = packageChanges[packageName];
      const fileInfos: FileDiffInfo[] = [];

      for (const filePath of changedFiles) {
        console.log(`Getting information for ${filePath}...`);
        const fileInfo = getFileDiffInfo(filePath);
        if (fileInfo) {
          fileInfos.push(fileInfo);
        }
      }

      if (fileInfos.length > 0) {
        console.log(
          `Updating docs for ${packageName} with ${fileInfos.length} changed files`,
        );
        await updatePackageDocs(packageName, fileInfos);
      } else {
        console.log(
          `No file changes with diffs detected in ${packageName}. Skipping documentation update.`,
        );
      }
    }

    commitDocChanges();

    console.log('Documentation updates completed successfully');
  } catch (error) {
    console.error(
      'Error in script execution:',
      error instanceof Error ? error.message : '',
    );
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error(
    'Unhandled error:',
    error instanceof Error ? error.message : '',
  );
  process.exit(1);
});
