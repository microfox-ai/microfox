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

// Schema for OAuth package generation arguments
const GenerateOAuthPackageArgsSchema = z.object({
  query: z
    .string()
    .describe('Query describing the OAuth provider (e.g., "Google OAuth")'),
  url: z
    .string()
    .url('Please provide a valid URL including the protocol (https://)')
    .describe('URL to scrape for OAuth documentation'),
  isBaseUrl: z.boolean().optional().describe('Whether the URL is a base URL'),
});

type GenerateOAuthPackageArgs = z.infer<typeof GenerateOAuthPackageArgsSchema>;

// Schema for OAuth package metadata
const OAuthPackageMetadataSchema = z.object({
  providerName: z.string().describe('A proper provider name (e.g. "Google")'),
  packageName: z
    .string()
    .describe('Package name (@microfox/name-oauth in lowercase, kebab-case)'),
  title: z.string().describe('Microfox Name OAuth title'),
  description: z
    .string()
    .describe('A clear description of what this OAuth package does'),
  keywords: z.array(z.string()).describe('Relevant keywords for the package'),
});

type OAuthPackageMetadata = z.infer<typeof OAuthPackageMetadataSchema>;

/**
 * Ensure required keywords are included
 */
function ensureRequiredKeywords(keywords: string[]): string[] {
  const required = ['microfox', 'oauth', 'typescript'];
  const lowercaseKeywords = keywords.map(k => k.toLowerCase());

  const missingKeywords = required.filter(k => !lowercaseKeywords.includes(k));
  return [...keywords, ...missingKeywords];
}

/**
 * Generate OAuth package metadata from query using Gemini Flash
 */
async function generateMetadata(query: string): Promise<OAuthPackageMetadata> {
  console.log('🧠 Generating OAuth package metadata from query...');

  const { object: metadata, usage } = await generateObject({
    model: models.googleGeminiFlash,
    schema: OAuthPackageMetadataSchema,
    prompt: dedent`
      Generate metadata for a TypeScript OAuth package based on this query: "${query}"
      
      The package name should be lowercase, use kebab-case, have the prefix "@microfox/", and end with "-oauth".
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
    status: 'oauthConnector',
    authEndpoint: `/connect/${packageName.replace('@microfox/', '').replace('-oauth', '')}`,
    oauth2Scopes: [],
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon: `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${packageName.replace('@microfox/', '').replace('-oauth', '').replace('-', '-').replace('_', '-')}.svg`,
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
 * Summarize content using Gemini to extract OAuth information
 */
async function summarizeContent(
  content: string,
  options: { packageDir: string },
): Promise<string> {
  console.log('🧠 Summarizing content using Gemini...');

  const { text: summary, usage } = await generateText({
    model: models.googleGeminiFlash,
    prompt: dedent`
      Analyze this OAuth documentation and create a comprehensive summary that includes:
      1. OAuth 2.0 flow details (authorization code, implicit, etc.)
      2. Required credentials (client ID, client secret, etc.)
      3. Authorization endpoints
      4. Token endpoints
      5. Required scopes
      6. Token response format
      7. Token refresh mechanism
      8. Any other important information that would be useful for OAuth implementation

      Format the summary in a clear, structured way that can be used to generate a TypeScript OAuth package.
      Focus on extracting the technical details needed for OAuth implementation.
      Make sure to include all the information needed to generate a TypeScript OAuth package.
      Summary should be in markdown format.

      Documentation:
      ${content}
    `,
    maxTokens: 8000,
    temperature: 0.5,
  });

  logUsage(models.googleGeminiFlash.modelId, usage);

  console.log('✅ Content summarized successfully');
  console.log('Usage:', usage);

  const baseSummaryTextPath = path.join(options.packageDir, 'docSummary.md');
  fs.writeFileSync(baseSummaryTextPath, summary);

  return summary;
}

/**
 * Create initial package structure with empty files
 */
async function createInitialPackage(
  metadata: OAuthPackageMetadata,
): Promise<string> {
  // Convert @microfox/template-name to template-name for directory
  const dirName = metadata.packageName.replace('@microfox/', '');
  const packageDir = path.join(process.cwd(), '../packages', dirName);
  const srcDir = path.join(packageDir, 'src');
  const typesDir = path.join(srcDir, 'types');
  const schemasDir = path.join(srcDir, 'schemas');

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
  if (!fs.existsSync(schemasDir)) {
    fs.mkdirSync(schemasDir, { recursive: true });
  }

  // Create index.ts with updated import
  fs.writeFileSync(
    path.join(srcDir, 'index.ts'),
    `// OAuth package content will be generated by AI`,
  );

  fs.writeFileSync(
    path.join(packageDir, 'package-builder.json'),
    JSON.stringify({ sdkMetadata: metadata }, null, 2),
  );

  // Create empty [packageName].ts as placeholder
  const sdkFileName = `${metadata.packageName.replace('@microfox/', '').replace('-oauth', '')}OAuthSdk.ts`;
  fs.writeFileSync(
    path.join(srcDir, sdkFileName),
    '// OAuth package content will be generated by AI',
  );

  // Create empty types/index.ts as placeholder
  fs.writeFileSync(
    path.join(typesDir, 'index.ts'),
    '// Type definitions will be generated by AI',
  );

  // Create empty schemas/index.ts as placeholder
  fs.writeFileSync(
    path.join(schemasDir, 'index.ts'),
    '// Validation schemas will be generated by AI',
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
    `# ${metadata.title}\n\n${metadata.description}\n\nThis OAuth package was generated automatically.`,
  );

  // Create fixed files with predefined content
  await createFixedFiles(packageDir);

  return packageDir;
}

// Define the schema for the write_to_file tool
const FileContentSchema = z.object({
  content: z
    .string()
    .describe(
      'The complete source code or text content of the file, including all necessary imports, types, and implementations',
    ),
  path: z
    .string()
    .describe(
      'The relative file path within the SDK package directory (e.g., src/index.ts, src/types/index.ts)',
    ),
});

const WriteToFileSchema = z.object({
  mainSdkFileContent: z
    .string()
    .describe(
      'The main SDK implementation file containing the OAuth client class with authentication flows, token management, and API integration - The complete source code or text content of the file, including all necessary imports, types, and implementations',
    ),
  mainSdkFilePath: z
    .string()
    .describe(
      'The relative file path within the SDK package directory (e.g., src/index.ts, src/types/index.ts)',
    ),
  typesFileContent: z
    .string()
    .describe(
      'TypeScript type definitions file containing interfaces for configuration, tokens, responses, and other SDK-specific types',
    ),
  typesFilePath: z
    .string()
    .describe(
      'The relative file path within the SDK package directory (e.g., src/index.ts, src/types/index.ts)',
    ),
  schemasFileContent: z
    .string()
    .describe(
      'Zod validation schemas for runtime validation of inputs, outputs, and configuration objects',
    ),
  schemasFilePath: z
    .string()
    .describe(
      'The relative file path within the SDK package directory (e.g., src/index.ts, src/types/index.ts)',
    ),
  exportsFileContent: z
    .string()
    .describe(
      'Entry point file that exports the main SDK class, types, and utilities for package consumers',
    ),
  exportsFilePath: z
    .string()
    .describe(
      'The relative file path within the SDK package directory (e.g., src/index.ts, src/types/index.ts)',
    ),
  extraInfo: z
    .array(z.string())
    .describe(
      'Additional information about the OAuth package that will be useful for documentation, such as how to obtain credentials, environment variables, or other important details not covered in the code',
    ),
  oauth2Scopes: z
    .array(z.string())
    .describe(
      'Required OAuth2 scopes for this package (e.g., ["https://www.googleapis.com/auth/spreadsheets"])',
    ),
});

type WriteToFileData = z.infer<typeof WriteToFileSchema>;

// Define the schema for the generate_docs tool
const GenerateDocsSchema = z.object({
  constructorDocs: z
    .object({
      name: z
        .string()
        .describe(
          'The name of the constructor function or class that initializes this OAuth package (e.g., "createGoogleOAuth")',
        ),
      docs: z
        .string()
        .describe('The DETAILED markdown documentation for the constructor.'),
    })
    .describe(
      'The DETAILED markdown documentation for the constructor function or class that initializes this OAuth package (e.g., "createGoogleOAuth").',
    ),
  functionsDocs: z
    .array(
      z.object({
        name: z
          .string()
          .describe('The name of the function (e.g., "validateToken")'),
        docs: z
          .string()
          .describe(
            'The DETAILED markdown documentation for the function including all parameters, return type, usage examples, and more',
          ),
      }),
    )
    .describe(
      'The documentation for each function in this OAuth package, which will be saved to that specific function doc file like "validateToken.md"',
    ),
  dependencies: z
    .array(z.string())
    .optional()
    .describe(
      "List of dependencies to install. Only include dependencies that are actually needed beyond what's already installed",
    ),
  devDependencies: z
    .array(z.string())
    .optional()
    .describe(
      "List of dev dependencies to install. Only include dev dependencies that are actually needed beyond what's already installed",
    ),
  envKeys: z
    .array(
      z.object({
        key: z
          .string()
          .describe(
            'Environment variable key name in uppercase format (e.g., "GOOGLE_CLIENT_ID")',
          ),
        displayName: z
          .string()
          .describe(
            'Human-readable name for this API key shown in the UI (e.g., "Google Client ID")',
          ),
        description: z
          .string()
          .describe(
            'Detailed description explaining what this key is used for and how to obtain it',
          ),
        required: z.boolean().describe('Whether this key is required'),
      }),
    )
    .describe(
      'List of required API keys needed for authentication with this OAuth package',
    ),
});

type GenerateDocsData = z.infer<typeof GenerateDocsSchema>;

// Type for the final result
interface OAuthPackageResult {
  name: string;
  packageDir: string;
  packageName: string;
}

/**
 * Generate OAuth package based on arguments
 */
export async function generateOAuthPackage(
  args: GenerateOAuthPackageArgs,
): Promise<OAuthPackageResult | undefined> {
  try {
    console.log('🚀 Starting OAuth package generation process...');

    // Validate arguments
    const validatedArgs = GenerateOAuthPackageArgsSchema.parse(args);
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
    const allLinks = await extractLinks(validatedArgs.url, packageDir);

    // Analyze links to find useful ones for OAuth package creation
    const usefulLinks = await analyzeLinks(allLinks, validatedArgs.query, {
      isBaseUrl: args.isBaseUrl ?? false,
      url: validatedArgs.url,
      packageDir,
    });

    // Extract content from useful links
    const scrapedContents = await extractContentFromUrls(usefulLinks, {
      packageDir,
      baseUrl: validatedArgs.url,
    });

    // Combine all scraped content into a single document
    const combinedContent = scrapedContents
      .map(content => `## Content from: ${content.url}\n\n${content.content}`)
      .join('\n\n---\n\n');

    // Generate a single summary from all the combined content
    const docsSummary = await summarizeContent(combinedContent, {
      packageDir,
    });

    // Create system prompt and generation prompt
    const systemPrompt = dedent`
      You are a TypeScript OAuth package generator. Your task is to create a TypeScript OAuth package for a provider based on documentation.
      
      ## Output Schema
      - Your response MUST be a JSON object matching the WriteToFileSchema.
      - The top-level object should contain the following keys:
        - sdkImplementation: An OBJECT containing the keys 'mainSdkFile', 'typesFile', 'schemasFile', and 'exportsFile'. Each of these keys holds an object with 'content' (string) and 'path' (string) properties.
        - extraInfo: An array of strings containing additional information for documentation.
        - oauth2Scopes: An array of strings listing the required OAuth2 scopes.

      ## IMPORTANT: Your response MUST be a structured object, not a string
      ## Example of the expected output format (matching WriteToFileSchema):
      {
        "sdkImplementation": {
          "mainSdkFile": {
            "content": "// Main SDK implementation code here...",
            "path": "src/exampleOAuthSdk.ts"
          },
          "typesFile": {
            "content": "// Type definitions here...",
            "path": "src/types/index.ts"
          },
          "schemasFile": {
            "content": "// Validation schemas here...",
            "path": "src/schemas/index.ts"
          },
          "exportsFile": {
            "content": "// Exports here...",
            "path": "src/index.ts"
          }
        },
        "extraInfo": [
          "Information about how to obtain credentials...",
          "Information about environment variables..."
        ],
        "oauth2Scopes": [
          "https://example.com/auth/scope1",
          "https://example.com/auth/scope2"
        ]
      }

      ## Process
      1. First carefully analyze the requirements and OAuth documentation
      2. Plan what needs to be done, including:
         - Determining the OAuth 2.0 flow type
         - Identifying ALL OAuth endpoints and their parameters
         - Planning the package structure and methods covering all OAuth functionality
      3. Criticize your plan and refine it to be specific to this task
      4. Write complete, production-ready code with no TODOs or placeholders
      5. Recheck your code for any linting or TypeScript errors
      6. Make sure the package is easy to use and follows best practices
      
      ## Core Requirements for the OAuth Package Code Generation
      1. Use Zod for defining types with descriptive comments using .describe()
      2. DO NOT use Zod for validation of API responses
      3. The package should expose a constructor function or Class named "create${metadata.providerName.replace(/\s+/g, '')}OAuth"
      4. The package MUST have functions for ALL OAuth endpoints mentioned in the documentation
      5. The Functions MUST cover all OAuth endpoints and their parameters
      6. The package should abstract as much as possible of the OAuth complexity, so that the OAuth flow can be easily used by any developer.
      7. The parameters of constructor and functions should be as much abstracted as possible, so that the developer can pass in the parameters in the way that is most convenient for them.
      8. The package should be as clean, customizable and reusable as possible
      9. Export all necessary types
      10. Handle error cases properly so that the developer can easily understand what went wrong
      11. Do not use axios or node-fetch dependencies, use nodejs20 default fetch instead
      12. Provide comprehensive extraInfo for documentation generation

      ## Project Structure & Requirements
      1. Main SDK (mainSdkFile):
         - Path: src/[packageName.replace('@microfox/', '').replace('-oauth', '')]OAuthSdk.ts
         - Must include all OAuth flows and token management
         - Complete implementation with proper error handling
         - Follow TypeScript best practices

      2. Type Definitions (typesFile):
         - Path: src/types/index.ts
         - All necessary interfaces and types
         - Proper JSDoc documentation
         - Export everything needed by the SDK

      3. Validation Schemas (schemasFile):
         - Path: src/schemas/index.ts
         - Zod schemas matching type definitions
         - Comprehensive validation rules
         - Clear error messages

      4. Package Exports (exportsFile):
         - Path: src/index.ts
         - Export main SDK class
         - Re-export types (must be: export * from './types')
         - Do not re-export schemas
      
      Each component must be properly typed, documented, and follow best practices for security and error handling.

      ## OAuth Implementation Guidelines
      - The package should accept config object with fields like clientId, clientSecret, redirectUri, scopes, and any other parameters needed for the OAuth flow as parameters in the constructor
      - The package should export functions to validate and refresh the access token with the correct parameters like accessToken, refreshToken, expires_in (if supported), etc.
      - The package should check if the provided access token is valid and if not, throw an error
      - The package should have a constructor function that initializes the OAuth client
      - the package should use the function name "getAuthUrl" to get the authorization url for the OAuth flow
      - the package should use the function name "exchangeCodeForToken" to exchange the authorization code for the access token
      - The environment variable names should be related to the provider, not the package (e.g., "GOOGLE_CLIENT_ID" not "GOOGLE_SHEETS_CLIENT_ID")
    `;

    const generationPrompt = dedent`
      You are requested to generate a TypeScript OAuth package for ${metadata.providerName} based on the following documentation.
      
      ## OAuth Package Information
      - Title: ${metadata.title}
      - Description: ${metadata.description}
      
      ## OAuth Documentation Summary
      ${docsSummary}
      
      ## Available Dependencies
      The following packages are already installed in the project:

      - Dev dependencies:
        - @microfox/tsconfig
        - @types/node
        - tsup
        - typescript

      - Dependencies:
        - zod
      
      ## OAuth Package Requirements
      - Create a complete, production-ready OAuth package with no TODOs or placeholders
      - Ensure all types are properly defined with Zod
      - Include comprehensive error handling
      - Make sure the package is easy to use and follows best practices
      - Create a function for EVERY OAuth endpoint mentioned in the documentation
      - Provide comprehensive extraInfo for documentation generation
      
      ## OAuth Implementation Requirements
      - The package should accept config object with fields like clientId, clientSecret, redirectUri, scopes, and any other parameters needed for the OAuth flow as parameters in the constructor
      - The package should export functions to validate and refresh the access token with the correct parameters like accessToken, refreshToken, expires_in (if supported), etc.
      - The package should check if the provided access token is valid and if not, throw an error
      - The environment variable names should be related to the provider, not the package (e.g., "GOOGLE_CLIENT_ID" not "GOOGLE_SHEETS_CLIENT_ID")
      
      ## ExtraInfo Requirements
      - Provide detailed information about how to obtain OAuth credentials
      - Include information about environment variables and how to set them up
      - Add any other important information not covered in the code that would be useful for documentation
      - Explain OAuth flow requirements and how to obtain necessary credentials
      - Provide information about rate limits and other important constraints
      
      ## IMPORTANT: Response Format
      Your response MUST be a structured JSON object with the following format, matching the WriteToFileSchema:
      {
        "sdkImplementation": {
          "mainSdkFile": {
            "content": "// Main SDK implementation code here...",
            "path": "src/${metadata.packageName.replace('@microfox/', '').replace('-oauth', '')}OAuthSdk.ts"
          },
          "typesFile": {
            "content": "// Type definitions here...",
            "path": "src/types/index.ts"
          },
          "schemasFile": {
            "content": "// Validation schemas here...",
            "path": "src/schemas/index.ts"
          },
          "exportsFile": {
            "content": "// Exports here...",
            "path": "src/index.ts"
          }
        },
        "extraInfo": [
          "Information about how to obtain credentials...",
          "Information about environment variables..."
        ],
        "oauth2Scopes": [
          "https://example.com/auth/scope1",
          "https://example.com/auth/scope2"
        ]
      }
      
      DO NOT return a string or markdown. Return ONLY a valid JSON object that matches the schema exactly.
    `;

    // Log prompts
    console.log('\n📋 System Prompt:', systemPrompt);
    console.log('\n📋 Generation Prompt:', generationPrompt);
    console.log('\n📋 System Prompt Length:', systemPrompt.length);
    console.log('\n📋 Generation Prompt Length:', generationPrompt.length);

    // Generate OAuth package code with Claude 3.5 Sonnet
    console.log('\n🧠 Generating OAuth package code...');
    const result = await generateObject({
      model: models.claude35Sonnet,
      system: systemPrompt,
      prompt: generationPrompt,
      maxTokens: 8000,
      schema: WriteToFileSchema,
    });

    logUsage(models.claude35Sonnet.modelId, result.usage);

    const data = result.object;

    console.log('Usage:', result.usage);

    console.log('📝 Generated OAuth package with the following info:');
    console.log(`- OAuth2 Scopes: ${data.oauth2Scopes.join(', ')}`);
    console.log(`- Extra Info Items: ${data.extraInfo.length}`);

    // Get package directory
    const dirName = metadata.packageName.replace('@microfox/', '');
    // const packageDir = path.join(process.cwd(), '../packages', dirName);

    // Write the generated files
    const files = [
      {
        content: data.mainSdkFileContent,
        path: path.join(packageDir, data.mainSdkFilePath),
      },
      {
        content: data.typesFileContent,
        path: path.join(packageDir, data.typesFilePath),
      },
      {
        content: data.schemasFileContent,
        path: path.join(packageDir, data.schemasFilePath),
      },
      {
        content: data.exportsFileContent,
        path: path.join(packageDir, data.exportsFilePath),
      },
    ];

    for (const file of files) {
      await fs.promises.writeFile(file.path, file.content + '\n');
      console.log(`✅ Created ${path.relative(packageDir, file.path)}`);
    }

    // Update package-info.json with auth info and extra info
    const packageInfoPath = path.join(packageDir, 'package-info.json');
    const packageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));

    // Add oauth2Scopes
    packageInfo.oauth2Scopes = data.oauth2Scopes;

    // Add extraInfo
    packageInfo.extraInfo = data.extraInfo;

    // Write updated package-info.json
    fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2));

    console.log(`✅ Updated OAuth package files at ${packageDir}`);

    const toolResult = {
      success: true,
      packageDir,
      sdkImplementation: {
        mainSdkFile: {
          content: data.mainSdkFileContent,
          path: data.mainSdkFilePath,
        },
        typesFile: {
          content: data.typesFileContent,
          path: data.typesFilePath,
        },
        schemasFile: {
          content: data.schemasFileContent,
          path: data.schemasFilePath,
        },
        exportsFile: {
          content: data.exportsFileContent,
          path: data.exportsFilePath,
        },
      },
      extraInfo: data.extraInfo,
    };

    // Check for tool results
    if (!toolResult) {
      console.warn(
        '⚠️ No tool results received, OAuth package generation may have failed',
      );
      return undefined;
    }

    // Get the OAuth package code and extraInfo from the first generation
    const oauthResult = toolResult;
    if (!oauthResult || !oauthResult.success) {
      console.warn('⚠️ OAuth package generation failed');
      return undefined;
    }

    const combinedCode = `
    // Main SDK
    ${oauthResult.sdkImplementation.mainSdkFile.content}
    // Types
    ${oauthResult.sdkImplementation.typesFile.content}
    // Schemas
    ${oauthResult.sdkImplementation.schemasFile.content}
    // Exports
    ${oauthResult.sdkImplementation.exportsFile.content}
    `;
    // Generate documentation
    await generateDocs(
      combinedCode,
      {
        apiName: metadata.providerName,
        packageName: metadata.packageName,
        title: metadata.title,
        description: metadata.description,
        authType: 'oauth2',
        authSdk: metadata.packageName,
      },
      packageDir,
      oauthResult.extraInfo,
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
          request.type === 'pkg-create'
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
    console.error('❌ Error generating OAuth package:', error);
    throw error;
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const queryArg = args[0] || '';
  const urlArg = args[1] || '';
  const isBaseUrlArg = args[2] || '';
  if (!queryArg) {
    console.error('❌ Error: Query argument is required');
    console.log(
      'Usage: node generate-oauth-package.js "OAuth Provider/Query" "URL to scrape"',
    );
    process.exit(1);
  }

  if (!urlArg) {
    console.error('❌ Error: URL argument is required');
    console.log(
      'Usage: node generate-oauth-package.js "OAuth Provider/Query" "URL to scrape"',
    );
    process.exit(1);
  }

  generateOAuthPackage({
    query: queryArg,
    url: urlArg,
    isBaseUrl: isBaseUrlArg === 'true',
  })
    .then(result => {
      if (result) {
        console.log(
          `✅ OAuth package generation complete for ${result.packageName}`,
        );
        console.log(`📂 Package location: ${result.packageDir}`);
      } else {
        console.log('⚠️ OAuth package generation completed with warnings');
      }
    })
    .catch(error => {
      console.error('❌ Fatal error generating OAuth package:', error);
      process.exit(1);
    });
}
