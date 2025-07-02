import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import 'dotenv/config';
import { generateText, generateObject, tool } from 'ai';
import { models } from '../../ai/models';
import dedent from 'dedent';
import { generateDocs } from '../docfox/genDocs';
import {
  extractLinks,
  analyzeLinks,
  extractContentFromUrls,
} from '../../utils/webScraper';
import { logUsage } from '../../ai/usage/usageLogger';
import { PackageFoxRequest } from '../../process-issue';

// Schema for Webhook package generation arguments
const GenerateWebhookPackageArgsSchema = z.object({
  query: z
    .string()
    .describe('Query describing the webhook provider (e.g., "Google Webhook")'),
  url: z
    .string()
    .url('Please provide a valid URL including the protocol (https://)')
    .describe('URL to scrape for Webhook documentation'),
  typesUrl: z
    .string()
    .url('Please provide a valid URL including the protocol (https://)')
    .describe('URL to scrape for Webhook types documentation'),
});

type GenerateWebhookPackageArgs = z.infer<
  typeof GenerateWebhookPackageArgsSchema
>;

// Schema for Webhook package metadata
const WebhookPackMetadataSchema = z.object({
  providerName: z.string().describe('A proper provider name (e.g. "Google")'),
  packageName: z
    .string()
    .describe('Package name (@microfox/webhook-name in lowercase, kebab-case)'),
  title: z.string().describe('Package title'),
  description: z
    .string()
    .describe('A clear description of what this Webhook package does'),
  keywords: z.array(z.string()).describe('Relevant keywords for the package'),
});

type WebhookPackMetadata = z.infer<typeof WebhookPackMetadataSchema>;

/**
 * Ensure required keywords are included
 */
function ensureRequiredKeywords(keywords: string[]): string[] {
  const required = ['microfox', 'webhook', 'typescript'];
  const lowercaseKeywords = keywords.map(k => k.toLowerCase());

  const missingKeywords = required.filter(k => !lowercaseKeywords.includes(k));
  return [...keywords, ...missingKeywords];
}

/**
 * Generate Webhook package metadata from query using Gemini Flash
 */
async function generateMetadata(query: string): Promise<WebhookPackMetadata> {
  console.log('🧠 Generating Webhook package metadata from query...');

  const { object: metadata, usage } = await generateObject({
    model: models.googleGeminiFlash,
    schema: WebhookPackMetadataSchema,
    prompt: dedent`
      Generate metadata for a TypeScript Webhook package based on this query: "${query}"
      
      The package name should be lowercase, use kebab-case, have the prefix "@microfox/", and start with "webhook-".
      Make the description clear and concise.
      Include relevant keywords (3-4 total).
    `,
    temperature: 0.2,
  });

  // Ensure required keywords are present
  metadata.keywords = ensureRequiredKeywords(metadata.keywords);

  logUsage(models.googleGeminiFlash.modelId, usage);

  console.log('✅ Generated metadata successfully');
  return metadata;
}

/**
 * Create package.json file
 */
function createInitialPackageJson(
  packageName: string,
  description: string,
  keywords: string[],
): any {
  return {
    name: packageName,
    version: '1.0.0',
    description,
    main: './dist/index.js',
    module: './dist/index.mjs',
    types: './dist/index.d.ts',
    files: ['dist/**/*', 'CHANGELOG.md'],
    scripts: {
      build: 'tsup',
      'build:watch': 'tsup --watch',
      clean: 'rm -rf dist',
      lint: 'eslint "./**/*.ts*"',
      'prettier-check': 'prettier --check "./**/*.ts*"',
    },
    exports: {
      './package.json': './package.json',
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.js',
      },
    },
    dependencies: {
      zod: '^3.24.2',
    },
    devDependencies: {
      '@microfox/tsconfig': '*',
      '@types/node': '^18',
      tsup: '^8',
      typescript: '5.6.3',
    },
    publishConfig: {
      access: 'public',
    },
    engines: {
      node: '>=20.0.0',
    },
    homepage: 'https://github.com/microfox-ai/microfox',
    repository: {
      type: 'git',
      url: 'git+https://github.com/microfox-ai/microfox.git',
    },
    bugs: {
      url: 'https://github.com/microfox-ai/microfox/issues',
    },
    keywords,
  };
}

/**
 * Create package-info.json file
 */
function createInitialPackageInfo(
  packageName: string,
  title: string,
  description: string,
): any {
  return {
    name: packageName,
    title,
    description,
    platformType: 'internal',
    path: `packages/${packageName.replace('@microfox/', '')}`,
    dependencies: ['zod'],
    status: 'webhookConnector',
    webhookEndpoint: `/webhook/${packageName.replace('@microfox/', '').replace('-webhook', '')}`,
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon: `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${packageName.replace('@microfox/', '').replace('-webhook', '').replace('-', '-').replace('_', '-')}.svg`,
    constructors: [],
    extraInfo: [],
  };
}

/**
 * Create fixed files with predefined content
 */
async function createFixedFiles(destDir: string): Promise<void> {
  // File contents as strings
  const tsConfigContent = `{
  "extends": "@microfox/tsconfig/ts-library.json",
  "include": ["."],
  "exclude": ["*/dist", "dist", "build", "node_modules"]
}`;

  const tsupConfigContent = `import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
  },
]);`;

  const turboJsonContent = `{
  "extends": [
    "//"
  ],
  "tasks": {
    "build": {
      "outputs": [
        "**/dist/**"
      ]
    }
  }
}`;

  // Create files with content
  const filesToCreate: Record<string, string> = {
    'tsconfig.json': tsConfigContent,
    'tsup.config.ts': tsupConfigContent,
    'turbo.json': turboJsonContent,
  };

  for (const [file, content] of Object.entries(filesToCreate)) {
    const destPath = path.join(destDir, file);
    fs.writeFileSync(destPath, content);
    console.log(`✅ Created ${file}`);
  }
}

/**
 * Create initial package structure with empty files
 */
async function createInitialPackage(
  metadata: WebhookPackMetadata,
): Promise<string> {
  // Convert @microfox/template-name to template-name for directory
  const dirName = metadata.packageName.replace('@microfox/', '');
  const packageDir = path.join(process.cwd(), '../packages', dirName);
  const srcDir = path.join(packageDir, 'src');
  const typesDir = path.join(srcDir, 'types');

  // Create directories
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Create index.ts with updated import
  fs.writeFileSync(
    path.join(srcDir, 'index.ts'),
    `// Webhook package content will be generated by AI`,
  );

  fs.writeFileSync(
    path.join(packageDir, 'package-builder.json'),
    JSON.stringify({ sdkMetadata: metadata }, null, 2),
  );

  // Create initial package.json
  const packageJson = createInitialPackageJson(
    metadata.packageName,
    metadata.description,
    metadata.keywords,
  );
  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  );

  // Create initial package-info.json
  const packageInfo = createInitialPackageInfo(
    metadata.packageName,
    metadata.title,
    metadata.description,
  );
  fs.writeFileSync(
    path.join(packageDir, 'package-info.json'),
    JSON.stringify(packageInfo, null, 2),
  );

  // Create README.md placeholder
  fs.writeFileSync(
    path.join(packageDir, 'README.md'),
    `# ${metadata.title}\n\n${metadata.description}\n\nThis Webhook package was generated automatically.`,
  );

  // Create fixed files with predefined content
  await createFixedFiles(packageDir);

  return packageDir;
}

// Type for the final result
interface WebhookPackageResult {
  name: string;
  packageDir: string;
  packageName: string;
}

// Schema for SDK generation
const SdkGenerationSchema = z.object({
  fileName: z
    .string()
    .describe(
      'Unique filename for the SDK file (e.g., OctokitWebhookSdk.ts, ending with .ts)',
    ),
  sdkClassName: z
    .string()
    .describe('The name of the main SDK class (e.g., OctokitWebhookSdk)'),
  content: z
    .string()
    .describe(
      'The complete TypeScript content of the SDK file, including imports, class definition, methods, and exports.',
    ),
});

async function generateCoreSdk(
  documentationUrl: string,
  packageDir: string,
  metadata: WebhookPackMetadata,
) {
  console.log('🧠 Generating core SDK from documentation...');

  // 1. Fetch content from the main documentation URL
  const scrapedContents = await extractContentFromUrls([documentationUrl], {
    packageDir,
    baseUrl: documentationUrl,
  });

  if (
    !scrapedContents ||
    scrapedContents.length === 0 ||
    !scrapedContents[0].content
  ) {
    console.error('❌ Failed to scrape documentation for SDK generation.');
    return null;
  }
  const documentationContent = scrapedContents[0].content;

  const typesDir = path.join(packageDir, 'src', 'types');
  let allTypeContents = '';

  if (!fs.existsSync(typesDir)) {
    console.warn('⚠️ Types directory does not exist. Creating it now.');
    fs.mkdirSync(typesDir, { recursive: true });
  }

  const typesIndexPath = path.join(typesDir, 'index.ts');
  fs.writeFileSync(typesIndexPath, '// Barrel file for type exports\n');
  console.log(`📦 Initialized/Cleared ${typesIndexPath}`);

  const typeFiles = fs
    .readdirSync(typesDir)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts');

  if (typeFiles.length > 0) {
    for (const typeFile of typeFiles) {
      const filePath = path.join(typesDir, typeFile);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      allTypeContents += `\n// From ${typeFile}\n${fileContent}\n`;
      const fileNameWithoutExtension = typeFile.replace('.ts', '');
      fs.appendFileSync(
        typesIndexPath,
        `export * from './${fileNameWithoutExtension}';\n`,
      );
      console.log(`📦 Added export for ${typeFile} to ${typesIndexPath}`);
    }
  } else {
    console.warn(
      `⚠️ No type files found in ${typesDir} to aggregate for SDK generation prompt.`,
    );
  }

  console.log('🧠 Generating Core SDK using AI...');
  const { object: sdkGeneration, usage } = await generateObject({
    model: models.claude35Sonnet,
    schema: SdkGenerationSchema,
    system: dedent`
      You are an expert TypeScript developer specializing in creating robust and secure webhook SDKs.
      Your task is to generate a core SDK file for handling webhooks from a specific provider.
      The SDK should be well-structured, documented with JSDoc, and include mechanisms for request verification using a secret.

      The sdk class should handle the bare minimum functionalities below
      - signPayload
      - verifyPayload
      - verifyAndReceivePayload
      - createChallengeResponse
    `,
    prompt: dedent`
      Based on the following webhook documentation and available TypeScript types, please generate a core SDK file.

      Documentation Content:
      ---
      ${documentationContent}
      ---

      Available TypeScript types (import these from './types' if generating from src directly.
      ---
      ${allTypeContents || 'No specific types were found/provided. Please define necessary types or use generic ones.'}
      ---
     
      Requirements for the SDK:
      1.  **File Name**: Generate a unique, descriptive filename for the SDK, ending with '.ts' (e.g., '${metadata.packageName.replace('@microfox/', '').replace('-webhook', 'Webhook')}Sdk.ts').
      2.  **Class Definition**: Create a primary class (e.g., '${metadata.packageName.replace('@microfox/', '').replace('-webhook', 'Webhook')}Sdk').
          *   **Constructor**: The constructor must accept a \`secret: string\` argument, which will be used for verifying incoming webhook signatures. Store this secret internally.
          *   **Signature Verification Method**: Implement a method like \`verifySignature(payload: string | Buffer, signature: string, timestamp?: number | string): boolean\` or \`ensureValidSignature(...)\`. This method should use the stored secret and a common algorithm (e.g., HMAC-SHA256) to verify the request. Clearly document how the signature is expected to be generated and passed by the provider. If the provider uses a specific header for the signature (e.g., 'X-Hub-Signature-256'), mention it in the JSDoc. Detail how to construct the string to be hashed if it involves concatenating parts like timestamp and payload.
          *   **Webhook Processing Method**: Implement a method like \`handleWebhook(requestBody: any, signature?: string, ...otherRelevantParams): Promise<ParsedWebhookEvent | HandledChallenge>\` or similar. This method should:
              *   If a signature is provided (or expected based on provider docs), call the verification method. Throw an error if verification fails.
              *   Parse the \`requestBody\` using the relevant Zod schemas imported from './types'
              *   Handle potential challenge requests from the provider (e.g., if the payload contains a 'challenge' field, it might need to be echoed back as per provider's specification)
              *   Return a structured object representing the parsed event or the challenge response.
          *   **Error Handling**: Implement robust error handling for invalid configurations (e.g. missing secret), signature verification failures, and payload parsing errors. Use custom error classes extending Error if appropriate (e.g., \`WebhookVerificationError\`, \`WebhookParseError\`).
      3.  **Imports**: Import necessary types and Zod schemas 
      4.  **Exports**: Export the main SDK class and any other relevant types, interfaces or error classes defined in this file.
      5.  **JSDoc Documentation**: Add comprehensive JSDoc comments for the class, constructor, all public methods, and any important types/interfaces. Explain parameters, return values, and potential errors.
      6.  **Clarity and Readability**: The code should be clean, well-organized, and easy to understand. Use modern TypeScript features where appropriate.

      Output the generated filename (ending with .ts), the SDK class name, and the full TypeScript content for the SDK file.
    `,
    temperature: 0.1,
  });

  logUsage(models.claude35Sonnet.modelId, usage);

  if (
    !sdkGeneration ||
    !sdkGeneration.content ||
    !sdkGeneration.fileName ||
    !sdkGeneration.sdkClassName
  ) {
    console.error(
      '❌ Failed to generate SDK content, filename, or class name from AI.',
    );
    return null;
  }

  if (!sdkGeneration.fileName.endsWith('.ts')) {
    sdkGeneration.fileName =
      sdkGeneration.fileName.replace(/\\.ts$/i, '') + '.ts';
  }

  const sdkFilePath = path.join(packageDir, 'src', sdkGeneration.fileName);
  fs.writeFileSync(sdkFilePath, sdkGeneration.content);
  console.log(`✅ Generated core SDK file at ${sdkFilePath}`);

  return {
    sdkFileName: sdkGeneration.fileName,
    sdkClassName: sdkGeneration.sdkClassName,
    sdkFileContent: sdkGeneration.content,
  };
}

// Schema for type generation
const TypeGenerationSchema = z.object({
  fileName: z.string().describe('Unique filename for the types file'),
  content: z
    .string()
    .describe(
      'The complete TypeScript content including Zod schemas and type exports',
    ),
});

type TypeGeneration = z.infer<typeof TypeGenerationSchema>;

async function generateTypes(scrapedContent: string, packageDir: string) {
  console.log('🧠 Generating types from scraped content...');

  const { object: typeGeneration, usage } =
    await generateObject<TypeGeneration>({
      model: models.claude35Sonnet,
      schema: TypeGenerationSchema,
      system: dedent`
      You are a TypeScript expert specializing in webhook development.
      You will be given a webhook documentation and you will need to generate the types and Zod schemas for the webhook.
      You have an eye for clarity & detail-orientedness,
      You write proper inline comments for the code you write.
    `,
      prompt: dedent`
      Generate TypeScript types and Zod schemas based on the following webhook documentation:
      
      ${scrapedContent}
      
      Requirements:
      1. Create a unique filename that reflects the webhook provider and purpose
      2. Generate comprehensive Zod schemas for all webhook payloads and events
      3. Export both the Zod schemas and their inferred TypeScript types
      4. Include proper JSDoc documentation for all types and schemas
      5. Include validation rules in Zod schemas where appropriate
      6. Export everything needed for webhook validation and type safety
      
      The file should be structured as follows:
      - Import statements
      - Zod schema definitions with proper descriptions
      - TypeScript type exports using z.infer
      - Export statements for both schemas and types
      - Do not reexport at the end of the file, as we are already doing named exports.

      Critically,
      Generate Zod & Types for each and every possible event that can be received from the webhook.
      Do not miss any events.
      if code is too large, add placeholders so can be generated latter, placeholders should start with TODO:
      
      Example structure:
      import { z } from 'zod';
      
      // Zod schemas
      export const webhookEventSchema = z.object({...});
      export const webhookPayloadSchema = z.object({...});
      
      // TypeScript types
      export type WebhookEvent = z.infer<typeof webhookEventSchema>;
      export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
    `,
      temperature: 0.2,
      maxTokens: 8000,
    });

  logUsage(models.claude35Sonnet.modelId, usage);

  // Create the types directory if it doesn't exist
  const typesDir = path.join(packageDir, 'src', 'types');
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Write the generated types file
  const filePath = path.join(typesDir, `${typeGeneration.fileName}`);
  fs.writeFileSync(filePath, typeGeneration.content);

  console.log(`✅ Generated types file at ${filePath}`);
  return filePath;
}

async function updatePackageIndex(packageDir: string) {
  console.log('📝 Updating package index file...');

  // Get all TypeScript files in src directory recursively
  const srcDir = path.join(packageDir, 'src');

  // Function to recursively get all TypeScript files
  function getAllTsFiles(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllTsFiles(fullPath));
      } else if (
        entry.isFile() &&
        entry.name.endsWith('.ts') &&
        entry.name !== 'index.ts'
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  const files = getAllTsFiles(srcDir);

  // Extract export lines from each file
  const fileExports: Record<string, string[]> = {};
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    // Find lines containing exports
    const exportLines = lines.filter(
      line =>
        line.trim().startsWith('export ') ||
        line.trim().startsWith('export type ') ||
        line.trim().startsWith('export interface ') ||
        line.trim().startsWith('export class ') ||
        line.trim().startsWith('export enum ') ||
        line.trim().startsWith('export const ') ||
        line.trim().startsWith('export function '),
    );

    if (exportLines.length > 0) {
      // Store relative path from src directory
      const relativePath = path.relative(srcDir, file);
      fileExports[relativePath] = exportLines;
    }
  }

  // Generate the index.ts content using AI
  const { object: indexContent, usage } = await generateObject({
    model: models.claude35Sonnet,
    schema: z.object({
      content: z
        .string()
        .describe(
          'The complete content for the index.ts file, including all necessary imports and exports',
        ),
    }),
    system: dedent`
      You are a TypeScript expert specializing in creating clean and efficient barrel files (index.ts).
      Your task is to generate an index.ts file that re-exports all the contents from the source files.
      The exports should be organized and well-documented.
    `,
    prompt: dedent`
      Generate an index.ts file that re-exports all contents from the following TypeScript files and their exports:

      ${Object.entries(fileExports)
        .map(
          ([file, exports]) =>
            `File: ${file}\nExports:\n${exports.map(e => `  ${e}`).join('\n')}`,
        )
        .join('\n\n')}

      Requirements:
      1. Import and re-export all named exports from each file
      2. Add JSDoc comments to document the purpose of each export
      3. Organize imports and exports in a clean, logical order
      4. Handle any potential naming conflicts
      5. Include proper TypeScript types
      6. Use relative imports based on the file paths provided

      Critically,
      when re exporting types, you should export it as a type,
      for example, this is correct:
       export { type AppMentionEvent };
      this is incorrect:
       export { AppMentionEvent };
    `,
  });

  logUsage(models.claude35Sonnet.modelId, usage);

  // Write the index.ts file
  const indexPath = path.join(srcDir, 'index.ts');
  fs.writeFileSync(indexPath, indexContent.content);
  console.log(`✅ Updated index.ts at ${indexPath}`);
}

/**
 * Generate Webhook package based on arguments
 */
export async function generateWebhookPackage(
  args: GenerateWebhookPackageArgs,
): Promise<WebhookPackageResult | undefined> {
  try {
    console.log('🚀 Starting Webhook package generation process...');

    // Validate arguments
    const validatedArgs = GenerateWebhookPackageArgsSchema.parse(args);
    console.log('✅ Arguments validated successfully');

    // Generate metadata using Google Gemini Flash with structured output
    const metadata = await generateMetadata(validatedArgs.query);
    console.log(`📝 Generated metadata:`);
    console.log(`- Provider Name: ${metadata.providerName}`);
    console.log(`- Package: ${metadata.packageName}`);
    console.log(`- Title: ${metadata.title}`);
    console.log(`- Description: ${metadata.description}`);
    console.log(`- Keywords: ${metadata.keywords.join(', ')}`);

    // Create initial package structure with empty files
    const packageDir = await createInitialPackage(metadata);
    console.log(`📁 Created initial package structure at ${packageDir}`);

    // Extract links from the provided URL
    const allLinks = await extractLinks(validatedArgs.typesUrl, packageDir);

    // Analyze links to find useful ones for Webhook package creation
    const usefulLinks = await analyzeLinks(allLinks, validatedArgs.query, {
      isBaseUrl: true,
      url: validatedArgs.typesUrl,
      packageDir,
    });

    // Extract content from useful links
    const scrapedContents = await extractContentFromUrls(usefulLinks, {
      packageDir,
      baseUrl: validatedArgs.typesUrl,
    });

    for (const scrapedContent of scrapedContents) {
      await generateTypes(scrapedContent.content, packageDir);
    }

    await generateCoreSdk(validatedArgs.url, packageDir, metadata);

    await updatePackageIndex(packageDir);

    console.log('📝 Generated Webhook package with the following info:');

    // Update package-info.json with auth info and extra info
    const packageInfoPath = path.join(packageDir, 'package-info.json');
    const packageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));

    // Write updated package-info.json
    fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2));

    console.log(`✅ Updated Webhook package files at ${packageDir}`);

    // Function to recursively read and combine all TypeScript files
    function combineSourceFiles(dir: string): string {
      let combinedCode = '';
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Recursively process subdirectories
          combinedCode += combineSourceFiles(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.ts')) {
          // Read and append file content
          const content = fs.readFileSync(fullPath, 'utf-8');
          combinedCode += `\n// File: ${path.relative(packageDir, fullPath)}\n${content}\n`;
        }
      }

      return combinedCode;
    }

    const combinedCode = combineSourceFiles(path.join(packageDir, 'src'));

    // Generate documentation
    await generateDocs(
      combinedCode,
      {
        apiName: metadata.providerName,
        packageName: metadata.packageName,
        title: metadata.title,
        description: metadata.description,
        authType: 'none',
        authSdk: metadata.packageName,
      },
      packageDir,
      [],
    );

    const foxlog = fs.readFileSync(
      path.join(
        process.cwd()?.replace('/scripts', ''),
        '.microfox/packagefox-build.json',
      ),
      'utf8',
    );
    if (foxlog) {
      const foxlogData = JSON.parse(foxlog);
      const newRequests: any[] = [
        {
          type: 'pkg-build',
          packageName: metadata.packageName,
        },
      ];
      foxlogData.requests.forEach((request: PackageFoxRequest) => {
        if (
          request.url === validatedArgs.url &&
          request.type === 'pkg-create-webhook'
        ) {
        } else {
          newRequests.push(request);
        }
      });
      foxlogData.requests = newRequests;
      fs.writeFileSync(
        path.join(process.cwd(), '../.microfox', 'packagefox-build.json'),
        JSON.stringify(foxlogData, null, 2),
      );
    }

    return {
      name: metadata.providerName,
      packageDir: path.join(
        process.cwd(),
        '../packages',
        metadata.packageName.replace('@microfox/', ''),
      ),
      packageName: metadata.packageName,
    };
  } catch (error) {
    console.error('❌ Error generating Webhook package:', error);
    throw error;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const queryArg = args[0] || '';
  const urlArg = args[1] || '';
  const typesUrlArg = args[2] || '';
  if (!queryArg) {
    console.error('❌ Error: Query argument is required');
    console.log(
      'Usage: node generate-webhook-package.js "Webhook Provider/Query" "URL to scrape"',
    );
    process.exit(1);
  }

  if (!urlArg) {
    console.error('❌ Error: URL argument is required');
    console.log(
      'Usage: node generate-webhook-package.js "Webhook Provider/Query" "URL to scrape"',
    );
    process.exit(1);
  }

  generateWebhookPackage({
    query: queryArg,
    url: urlArg,
    typesUrl: typesUrlArg,
  })
    .then(result => {
      if (result) {
        console.log(
          `✅ Webhook package generation complete for ${result.packageName}`,
        );
        console.log(`📂 Package location: ${result.packageDir}`);
      } else {
        console.log('⚠️ Webhook package generation completed with warnings');
      }
    })
    .catch(error => {
      console.error('❌ Fatal error generating Webhook package:', error);
      process.exit(1);
    });
}
