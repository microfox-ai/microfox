import { generateObject, generateText, tool } from 'ai';
import dedent from 'dedent';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { models } from '../../ai/models';
import { logUsage } from '../../ai/usage/usageLogger';
import { fixBuildIssues } from './fixBuildIssues';
import { generateDocs } from '../docfox/genDocs';
import {
  updateCodeGenReport,
  updateResearchReport,
} from '../../octokit/commentReports';
import { PackageFoxRequest } from '../../process-issue';
import { PackageInfo } from '../../types';
import { inMemoryStore } from '../../utils/InMemoryStore';
import {
  analyzeLinks,
  extractContentFromUrls,
  extractLinks,
} from '../../utils/webScraper';
import { getProjectRoot } from '../../utils/getProjectRoot';
import { cleanupFoxRequests } from '../metafox/cleanupFoxRequests';

// Schema for SDK generation arguments
const GenerateSDKArgsSchema = z.object({
  query: z.string().describe('Query describing the API (e.g., "Github API")'),
  url: z
    .string()
    .url('Please provide a valid URL including the protocol (https://)')
    .describe('URL to scrape for API documentation'),
  isBaseUrl: z.boolean().describe('Whether the URL is the base URL'),
});

type GenerateSDKArgs = z.infer<typeof GenerateSDKArgsSchema>;

// Schema for SDK metadata
const SDKMetadataSchema = z.object({
  inputArgs: GenerateSDKArgsSchema,
  apiName: z.string().describe('A proper API name (e.g. "GitHub")'),
  packageName: z
    .string()
    .describe('Package name (@microfox/name in lowercase, kebab-case)'),
  title: z.string().describe('Microfox Name SDK title'),
  description: z.string().describe('A clear description of what this SDK does'),
  keywords: z.array(z.string()).describe('Relevant keywords for the package'),
  authType: z
    .enum(['oauth2', 'apikey', 'auto'])
    .describe(
      'Authentication type for this SDK: "oauth2" for OAuth 2.0 flow, "apikey" for API key authentication, or "auto" to let the model decide',
    ),
  authSdk: z
    .string()
    .optional()
    .describe(
      'The OAuth SDK to use (e.g., "@microfox/google-oauth"). Required when authType is "oauth2"',
    ),
});

type SDKMetadata = z.infer<typeof SDKMetadataSchema>;

/**
 * Ensure required keywords are included
 */
function ensureRequiredKeywords(keywords: string[]): string[] {
  const required = ['microfox', 'sdk', 'typescript'];
  const lowercaseKeywords = keywords.map(k => k.toLowerCase());

  const missingKeywords = required.filter(k => !lowercaseKeywords.includes(k));
  return [...keywords, ...missingKeywords];
}

/**
 * Generate SDK metadata from query using Gemini Flash
 */
export async function generateMetadata(
  query: GenerateSDKArgs,
): Promise<SDKMetadata> {
  console.log('🧠 Generating SDK metadata from query...');

  // Get available OAuth packages
  let oauthPackages = fs
    .readdirSync(path.join(getProjectRoot(), 'packages'))
    .filter(dir => dir.includes('-oauth'));
  oauthPackages = oauthPackages.map(pkg => `@microfox/${pkg}`);
  console.log(
    `✅ Found ${oauthPackages.length} OAuth packages: ${oauthPackages.join(', ')}`,
  );

  const { object: metadata, usage } = await generateObject({
    model: models.googleGeminiPro,
    schema: SDKMetadataSchema.omit({ inputArgs: true }),
    prompt: dedent`
      Generate metadata for a TypeScript SDK based on this query: "${query.query}"
      
      The package name should be lowercase, use kebab-case, and have the prefix "@microfox/".
      Make the description clear and concise.
      Include relevant keywords (3-4 total).
      packageName should never end with an -oauth or -sdk.
      
      For authType:
      - Use "oauth2" if the API primarily uses OAuth 2.0 for authentication (like Google, GitHub, or LinkedIn APIs)
      - Use "apikey" if the API primarily uses API keys or tokens for authentication
      - Use "auto" if you're not sure about the authentication mechanism
      
      For authSdk:
      - If authType is "oauth2", provide the appropriate OAuth SDK from the available packages
      - If authType is not "oauth2", leave this field empty
      
      Available OAuth packages: ${oauthPackages.join(', ')}
    `,
    temperature: 0.5,
  });

  logUsage(models.googleGeminiPro.modelId, usage);

  let newMetadata: SDKMetadata = { ...metadata } as any;
  // Ensure required keywords are present
  newMetadata.keywords = ensureRequiredKeywords(metadata.keywords);
  newMetadata.inputArgs = query;

  console.log('✅ Generated metadata successfully');

  // Create initial package structure to store research report
  const dirName = newMetadata.packageName.replace('@microfox/', '');
  const packageDir = path.join(getProjectRoot(), 'packages', dirName);
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }

  // Update research report
  await updateResearchReport(
    'generateMetadata',
    {
      usage,
      totalTokens: usage.totalTokens,
      status: 'success',
      details: {
        'API Name': newMetadata.apiName,
        Package: newMetadata.packageName,
        'Auth Type': newMetadata.authType,
        'Auth SDK': newMetadata.authSdk || 'N/A',
      },
    },
    packageDir,
  );

  return newMetadata;
}

/**
 * Create package.json file
 */
function createInitialPackageJson(
  packageName: string,
  description: string,
  keywords: string[],
  authSdk?: string,
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
      ...(authSdk ? { [authSdk]: '*' } : {}),
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
  authType: string,
  authSdk?: string,
): any {
  return {
    name: packageName,
    title,
    description,
    platformType: 'tool',
    path: `packages/${packageName.replace('@microfox/', '')}`,
    dependencies: ['zod', authSdk].filter(Boolean),
    status: 'semiStable',
    authEndpoint:
      authType === 'oauth2' && authSdk
        ? `/connect/${authSdk.replace('@microfox/', '')}`
        : '',
    oauth2Scopes: [],
    authType: authType === 'auto' ? undefined : authType,
    documentation: `https://www.npmjs.com/package/${packageName}`,
    icon: `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${packageName.replace('@microfox/', '').replace('-', '-').replace('_', '-')}.svg`,
    constructors: [],
    keyInstructions: {
      link: '',
      setupInfo: '',
    },
    extraInfo: [],
  } as PackageInfo;
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
 * Summarize content using Gemini to extract API information
 */
export async function summarizeGenPackageContent(
  content: string,
  query: string,
  options: { packageDir: string },
): Promise<string> {
  console.log('🧠 Summarizing content using Gemini...');

  await updateResearchReport(
    'summarizeContent',
    {
      status: 'in-progress',
      details: {
        'Summarizing All Documentation': content.length,
      },
    },
    options.packageDir,
  );

  const { text: summary, usage } = await generateText({
    model: models.googleGeminiPro,
    prompt: dedent`
      Analyze this API documentation and create a comprehensive summary that includes:
      1. All API endpoints with their HTTP methods
      2. Request headers and authentication requirements
      3. Request parameters and their types
      4. Response formats and data structures
      5. Authentication methods and required credentials
      6. Any other important information that would be useful for documentation generation

      ## User's query (VERY IMPORTANT): ${query}

      Format the summary in a clear, structured way that can be used to generate a TypeScript SDK.
      All API endpoints should be covered in the summary including the endpoint, method, authentication type, parameters, request body, response, and any other relevant information.
      If the user's query is about specific endpoints, make sure to include all the information needed for those endpoints in the summary.
      make sure each endpoint is given a brief description, based on the original content. 
      note down any edge cases as needed to build a robust SDK.
      the types are very important, make sure to include each and evry one in the summary.
      Focus on extracting the technical details needed for SDK implementation.
      Make sure to include all the information needed to generate a TypeScript SDK.
      Summary should be in markdown format.

      Documentation:
      ${content}
    `,
    maxTokens: 8000,
    temperature: 0.5,
  });

  logUsage(models.googleGeminiPro.modelId, usage);

  console.log('✅ Content summarized successfully');
  console.log('Usage:', usage);

  const baseSummaryTextPath = path.join(options.packageDir, 'docSummary.md');
  fs.writeFileSync(baseSummaryTextPath, summary);

  // Update research report
  await updateResearchReport(
    'summarizeContent',
    {
      status: 'success',
      usage,
      totalTokens: usage.totalTokens,
      details: {
        'Summary Length': `${(summary.length / 1024).toFixed(2)} KB`,
        'Input Length': `${(content.length / 1024).toFixed(2)} KB`,
        'Compression Ratio': `${((content.length / summary.length) * 100).toFixed(2)}%`,
        'Saved at': baseSummaryTextPath.replace(process.cwd(), ''),
      },
    },
    options.packageDir,
  );

  return summary;
}

/**
 * Create initial package structure with empty files
 */
async function createInitialPackage(metadata: SDKMetadata): Promise<string> {
  // Convert @microfox/template-name to template-name for directory
  const dirName = metadata.packageName.replace('@microfox/', '');
  const packageDir = path.join(getProjectRoot(), 'packages', dirName);
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

  // Create index.ts placeholder
  fs.writeFileSync(
    path.join(srcDir, 'index.ts'),
    `// Exports will be generated by AI`,
  );
  // Create main sdk placeholder
  const sdkFileName = `${metadata.apiName.replace(/\s+/g, '')}Sdk.ts`;
  fs.writeFileSync(
    path.join(srcDir, sdkFileName),
    `// Main SDK class/functions will be generated by AI`,
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

  fs.writeFileSync(
    path.join(packageDir, 'package-builder.json'),
    JSON.stringify({ sdkMetadata: metadata }, null, 2),
  );
  // Create initial package.json
  const packageJson = createInitialPackageJson(
    metadata.packageName,
    metadata.description,
    metadata.keywords,
    metadata.authSdk,
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
    metadata.authType,
    metadata.authSdk,
  );
  fs.writeFileSync(
    path.join(packageDir, 'package-info.json'),
    JSON.stringify(packageInfo, null, 2),
  );

  // Create README.md placeholder
  fs.writeFileSync(
    path.join(packageDir, 'README.md'),
    `# ${metadata.title}\n\n${metadata.description}\n\nThis SDK was generated automatically.`,
  );

  // Create fixed files with predefined content
  await createFixedFiles(packageDir);

  return packageDir;
}

// --- Refactored Tool Schemas ---

// Schema for the initial setup information tool
const SetupInfoSchema = z.object({
  setupInfo: z
    .string()
    .describe(
      'Additional information about the SDK that will be useful for documentation, such as how to obtain API keys, environment variables, or other important details not covered in the code',
    ),
  authType: z
    .enum(['apikey', 'oauth2', 'none'])
    .describe(
      'Determined authentication type for this SDK: "apikey" for API key auth, "oauth2" for OAuth2 flow, or "none" for no auth required',
    ),
  authSdk: z
    .string()
    .optional()
    .describe(
      'The name of the OAuth SDK to use (e.g., "@microfox/google-oauth", "@microfox/linkedin-oauth"). Required when authType is "oauth2".',
    ),
  oauth2Scopes: z
    .array(z.string())
    .optional()
    .describe(
      'Required OAuth2 scopes for this SDK (e.g., ["https://www.googleapis.com/auth/spreadsheets"]). Required Only when authType is "oauth2".',
    ),
});
type SetupInfoData = z.infer<typeof SetupInfoSchema>;

// Schema for the write single file tool
const WriteSingleFileSchema = z.object({
  path: z
    .string()
    .describe(
      'The relative file path within the SDK package directory (e.g., src/index.ts, src/types/index.ts, src/schemas/index.ts, src/YourSdkNameSdk.ts)',
    ),
  content: z
    .string()
    .describe(
      'The complete source code or text content of the file, including all necessary imports, types, and implementations',
    ),
});
type WriteSingleFileData = z.infer<typeof WriteSingleFileSchema>;

// --- End Refactored Tool Schemas ---

// Define the schema for the generate_docs tool (kept for compatibility with generateDocs function)
const GenerateDocsSchema = z.object({
  constructorDocs: z
    .object({
      name: z
        .string()
        .describe(
          'The name of the constructor function or class that initializes this SDK (e.g., "createGoogleSheetsSDK")',
        ),
      docs: z
        .string()
        .describe('The DETAILED markdown documentation for the constructor.'),
    })
    .describe(
      'The DETAILED markdown documentation for the constructor function or class that initializes this SDK (e.g., "createGoogleSheetsSDK").',
    ),
  functionsDocs: z
    .array(
      z.object({
        name: z
          .string()
          .describe('The name of the function (e.g., "createUser")'),
        docs: z
          .string()
          .describe(
            'The DETAILED markdown documentation for the function including all parameters, return type, usage examples, and more',
          ),
      }),
    )
    .describe(
      'The documentation for each function in this SDK, which will be saved to that specific function doc file like "createUser.md"',
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
            'Environment variable key name in uppercase format. Should be related to the provider, not the package (e.g., "GOOGLE_ACCESS_TOKEN" not "GOOGLE_SHEETS_ACCESS_TOKEN")',
          ),
        displayName: z
          .string()
          .describe(
            'Human-readable name for this API key shown in the UI (e.g., "Google Access Token")',
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
      'List of required API keys needed for authentication with this SDK',
    ),
});

type GenerateDocsData = z.infer<typeof GenerateDocsSchema>;

// Type for the final result
interface SDKResult {
  name: string;
  packageDir: string;
  packageName: string;
}

/**
 * Generate SDK code files using AI with tools
 */
export async function generateCodeFiles(
  metadata: SDKMetadata,
  docsSummary: string,
  packageDir: string,
): Promise<{
  finalSetupInfo: SetupInfoData;
  generatedFileContentsMap: Record<string, string>;
  usage: any;
  requiredFiles: string[];
  combinedCode: string;
}> {
  // Get OAuth package README if authType is oauth2
  let oauthPackageReadme = '';
  if (metadata.authType === 'oauth2' && metadata.authSdk) {
    const oauthPackageName = metadata.authSdk.replace('@microfox/', '');
    const oauthReadmePath = path.join(
      getProjectRoot(),
      'packages',
      oauthPackageName,
      'README.md',
    );

    if (fs.existsSync(oauthReadmePath)) {
      oauthPackageReadme = fs.readFileSync(oauthReadmePath, 'utf8');
      console.log(`✅ Found OAuth package README for ${metadata.authSdk}`);
    } else {
      console.warn(`⚠️ OAuth package README not found for ${metadata.authSdk}`);
    }
  }

  let oauthPackages = fs
    .readdirSync(path.join(getProjectRoot(), 'packages'))
    .filter(dir => dir.includes('-oauth'));
  console.log(`✅ Found ${oauthPackages.length} OAuth packages`);
  oauthPackages = oauthPackages.map(pkg => `@microfox/${pkg}`);

  // Clear in-memory store for this generation
  inMemoryStore.clear();

  // --- Tool Definitions ---
  const requiredFiles = [
    `src/${metadata.apiName.replace(/\s+/g, '')}Sdk.ts`,
    `src/types/index.ts`,
    `src/schemas/index.ts`,
    `src/index.ts`,
  ];

  // Tool for setting up SDK info and updating package-info.json
  const setupTool = tool({
    description:
      'Provide SDK setup information like auth type, scopes, and documentation details.',
    parameters: SetupInfoSchema,
    execute: async (data: SetupInfoData) => {
      console.log('🛠️ Received setup information:');
      console.log(`- Auth Type: ${data.authType}`);
      if (data.authSdk) {
        console.log(`- Auth SDK: ${data.authSdk}`);
      }
      if (data.oauth2Scopes && data.oauth2Scopes.length > 0) {
        console.log(`- OAuth2 Scopes: ${data.oauth2Scopes.join(', ')}`);
      }
      inMemoryStore.setItem('finalSetupInfo', data);

      const packageInfoPath = path.join(packageDir, 'package-info.json');
      try {
        const packageInfo: PackageInfo = JSON.parse(
          fs.readFileSync(packageInfoPath, 'utf8'),
        );

        packageInfo.authEndpoint =
          data.authType === 'oauth2' && data?.authSdk
            ? `/connect/${data?.authSdk.replace('@microfox/', '')}`
            : '';
        packageInfo.authType = data.authType;
        packageInfo.oauth2Scopes = data.oauth2Scopes || [];

        packageInfo.keyInstructions = {
          link: '',
          setupInfo: data.setupInfo,
        };

        fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2));
        console.log(`✅ Updated package-info.json with setup details.`);

        return {
          success: true,
          message: 'Setup info processed and package-info.json updated.',
        };
      } catch (error) {
        console.error(`❌ Error updating package-info.json:`, error);
        return {
          success: false,
          message: 'Failed to update package-info.json.',
        };
      }
    },
  });

  // Tool for writing a single file
  const writeFileTool = tool({
    description: 'Write content to a specific file within the SDK package.',
    parameters: WriteSingleFileSchema,
    execute: async (data: WriteSingleFileData) => {
      const fullPath = path.join(packageDir, data.path);
      try {
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, data.content + '\n');
        let contents =
          inMemoryStore.getItem<Record<string, string>>(
            'generatedFileContents',
          ) || {};
        contents[data.path] = data.content;
        inMemoryStore.setItem('generatedFileContents', contents);

        console.log(`✅ Written file: ${data.path}`);
        return { success: true, path: data.path };
      } catch (error) {
        console.error(`❌ Error writing file ${data.path}:`, error);
        return {
          success: false,
          path: data.path,
          error: (error as Error).message,
        };
      }
    },
  });
  // --- End Tool Definitions ---

  // Create system prompt and generation prompt
  const systemPrompt = dedent`
    You are a TypeScript SDK generator. Your task is to create a TypeScript SDK for an API based on documentation.


    ## Principles
    1. First carefully analyze the requirements and API documentation
    2. Plan what needs to be done, including:
        - Determining the authentication method
        - Identifying ALL API endpoints and their parameters
        - Planning the SDK structure and methods covering all endpoints
     3. Criticize your plan and refine it to be specific to this task
     4. Write complete, production-ready code with no TODOs or placeholders
     5. Recheck your code for any linting or TypeScript errors
     6. Make sure the SDK is easy to use and follows best practices

    ## Process
    1. First call the \`setupTool\` to provide the final determined authentication type ('apikey', 'oauth2', 'none'), the specific OAuth SDK if applicable ('@microfox/...-oauth'), required OAuth scopes, and detailed \`setupInfo\` (how to get keys, env vars, etc.).
    2. Then, generate the content for the main SDK file (\`src/${metadata.apiName.replace(/\s+/g, '')}Sdk.ts\`) and call the \`writeFileTool\` with the path and content.
    3. Next, generate the content for the types file (\`src/types/index.ts\`) and call the \`writeFileTool\` with the path and content.
    4. Next, generate the content for the schemas file (\`src/schemas/index.ts\`) and call the \`writeFileTool\` with the path and content.
    5. Finally, generate the content for the exports file (\`src/index.ts\`) and call the \`writeFileTool\` with the path and content.

    ## Core Requirements for the SDK Code Generation
    1. Use Zod for defining types with descriptive comments using .describe()
    2. DO NOT use Zod for validation or parsing of API and function responses
    3. The SDK should expose a constructor function or Class named "create${metadata.apiName.replace(/\s+/g, '')}SDK"
    4. The SDK MUST have functions for ALL endpoints mentioned in the documentation
    5. The Functions MUST cover all endpoints and their parameters
    6. A Single Function can be used to call multiple similar endpoints by combining the parameters of the endpoints like how @octokit/rest does it.
    7. The SDK should abstract as much as possible of the API's complexity, so that the API can be easily used by any developer.
    8. The parameters of constructor and functions should be as much abstracted as possible, so that the developer can pass in the parameters in the way that is most convenient for them.
    9. The SDK should be as clean, customizable and reusable as possible
    10. Export all necessary types from \`src/types/index.ts\`
    11. Handle error cases properly so that the developer can easily understand what went wrong
    12. Do not use axios or node-fetch dependencies, use nodejs20 default fetch instead
    13. Provide comprehensive setupInfo via the \`setupTool\` for documentation generation

    ## Project Structure & File Paths
    1. Main SDK: \`src/${metadata.apiName.replace(/\s+/g, '')}Sdk.ts\`
       - Must include all API methods and authentication handling
       - Complete implementation with proper error handling
       - Follow TypeScript best practices

    2. Type Definitions: \`src/types/index.ts\`
       - All necessary interfaces and types
       - Proper JSDoc documentation
       - Export everything needed by the SDK

    3. Validation Schemas: \`src/schemas/index.ts\`
       - Zod schemas matching type definitions
       - Comprehensive validation rules
       - Clear error messages

    4. Package Exports: \`src/index.ts\`
       - Export main SDK class/constructor
       - Re-export types (must be: export * from './types')
       - Do not re-export schemas

    Each component must be properly typed, documented, and follow best practices for security and error handling.

    ## Authentication Implementation
    ${
      metadata.authType === 'auto'
        ? `You must analyze the API documentation to determine the appropriate final auth type for the \`setupTool\` call:
    - Use "oauth2" if the API uses OAuth 2.0 flows (client IDs, authorization codes, redirect URIs)
    - Use "apikey" if the API uses API keys, tokens, or headers for auth
    - Use "none" if no auth is required

    You must explicitly decide which auth type to implement based on the documentation and provide it via the \`setupTool\`.`
        : `The authentication type is initially set to "${metadata.authType}". Confirm or update this type in the \`setupTool\` call.`
    }

    ${
      metadata.authType === 'oauth2' || metadata.authType === 'auto'
        ? `
    ## OAuth 2.0 Implementation Guidelines
    - If you determine the authType is "oauth2", you MUST provide the correct \`authSdk\` name (e.g., "@microfox/google-oauth") and the required \`oauth2Scopes\` array via the \`setupTool\`. Available OAuth packages: ${oauthPackages.join(', ')}
    - The main SDK (\`src/${metadata.apiName.replace(/\s+/g, '')}Sdk.ts\`) should accept all the parameters required by the OAuth package and the SDK itself in the constructor including accessToken, refreshToken(if supported by the provider), clientId, clientSecret, redirectUri, and scopes.
    - The SDK should export functions to validate and refresh the access token which uses the functions from the OAuth package constructor.
    - The SDK should check if the provided access token is valid and if not, throw an error.
    - The environment variable names should be related to the provider, not the package (e.g., "GOOGLE_ACCESS_TOKEN" not "GOOGLE_SHEETS_ACCESS_TOKEN"). These details should be part of the \`setupInfo\` provided to the \`setupTool\`.
    `
        : ''
    }

    ## Tool Call Sequence
    1. Call \`setupTool\` ONCE with \`authType\`, \`authSdk\` (if authType='oauth2'), \`oauth2Scopes\` (if authType='oauth2'), and detailed \`setupInfo\`.
    2. Generate content for \`src/${metadata.apiName.replace(/\s+/g, '')}Sdk.ts\` and call \`writeFileTool\`.
    3. Generate content for \`src/types/index.ts\` and call \`writeFileTool\`.
    4. Generate content for \`src/schemas/index.ts\` and call \`writeFileTool\`.
    5. Generate content for \`src/index.ts\` and call \`writeFileTool\`.

    Ensure complete, production-ready code with no TODOs. Follow all requirements from the system prompt.
  `;

  const generationPrompt = dedent`
    You are requested to generate a TypeScript SDK for ${metadata.apiName} based on the following documentation summary.

    ## User's query (VERY IMPORTANT)
    ${metadata.inputArgs.query}

    ## SDK Information
    - Title: ${metadata.title}
    - Description: ${metadata.description}
    - Package Name: ${metadata.packageName}
    ${
      metadata.authType !== 'auto'
        ? `- Initial Auth Type: ${metadata.authType}`
        : `- Initial Auth Type: auto - Please determine the final auth type ('apikey', 'oauth2', 'none') based on the documentation and provide it via the \`setupTool\`.`
    }
    ${metadata.authSdk ? `- Initial Auth SDK: ${metadata.authSdk}` : ''}

    ## API Documentation Summary
    ${docsSummary}

    ${
      oauthPackageReadme
        ? `
    ## OAuth Package Documentation (${metadata.authSdk})
    ${oauthPackageReadme}

    Use direct string literals for the \`oauth2Scopes\` array passed to the \`setupTool\`, do not use enums if possible.
    `
        : ''
    }

    ## Available Dependencies
    The following packages are already installed in the project:
    - Dev dependencies: @microfox/tsconfig, @types/node, tsup, typescript
    - Dependencies: zod ${metadata?.authSdk ? `, ${metadata?.authSdk}` : ''}

     ## SDK Requirements
     - Create a complete, production-ready SDK with no TODOs or placeholders
     - Ensure all types are properly defined with Zod
     - Include comprehensive error handling
     - Make sure the SDK is easy to use and follows best practices
     - Create a function for EVERY endpoint mentioned in the documentation
     - Provide comprehensive extraInfo for documentation generation
     - Make sure all the types are followed correctly in the code, and not mismatched
     
     ${
       metadata.authType === 'oauth2' || metadata.authType === 'auto'
         ? `
     ## OAuth Implementation Requirements
     - The SDK should accept parameters like accessToken, refreshToken, clientId, clientSecret, redirectUri, and scopes based on the OAuth package documentation
     - The SDK should export functions to validate and refresh the access token which uses the functions exported from the OAuth package
     - The SDK should check if the provided access token is valid and if not, throw an error
     - The environment variable names should be related to the provider, not the package (e.g., "GOOGLE_ACCESS_TOKEN" not "GOOGLE_SHEETS_ACCESS_TOKEN")
     `
         : ''
     }

    
    Ensure complete, production-ready code with no TODOs. Follow all requirements from the system prompt.
  `;

  // Log prompts
  console.log('\n📋 System Prompt Length:', systemPrompt.length);
  console.log('\n📋 Generation Prompt Length:', generationPrompt.length);

  // Generate SDK code with Claude 3.5 Sonnet and execute tools
  console.log('\n🧠 Generating SDK code and executing tools...');
  const { usage, toolResults } = await generateText({
    model: models.claude35Sonnet,
    system: systemPrompt,
    prompt: generationPrompt,
    tools: { setupTool, writeFileTool },
    toolChoice: 'auto',
    maxSteps: 5,
    maxRetries: 3,
  });

  logUsage(models.claude35Sonnet.modelId, usage);
  console.log('Usage:', usage);

  // --- Process Tool Results ---
  console.log('🛠️ Processing tool results...');

  const finalSetupInfo = inMemoryStore.getItem<SetupInfoData>('finalSetupInfo');
  const generatedFileContentsMap =
    inMemoryStore.getItem<Record<string, string>>('generatedFileContents') ||
    {};

  if (!finalSetupInfo) {
    console.error('❌ Error: Setup information was not generated by the AI.');
    throw new Error('Setup information missing.');
  }

  const missingFiles = requiredFiles.filter(
    file => !generatedFileContentsMap[file],
  );
  if (missingFiles.length > 0) {
    console.error(
      `❌ Error: The AI did not generate all required files. Missing: ${missingFiles.join(
        ', ',
      )}`,
    );
    console.log('Generated files:', Object.keys(generatedFileContentsMap));
    throw new Error(`Missing required files: ${missingFiles.join(', ')}`);
  }
  console.log(`✅ All required files generated and written.`);

  // Calculate total bytes of generated files
  const totalBytes = Object.entries(generatedFileContentsMap).reduce(
    (total, [_, content]) => total + Buffer.byteLength(content, 'utf8'),
    0,
  );

  // Update code generation report
  await updateCodeGenReport(
    {
      files: generatedFileContentsMap,
      setupInfo: finalSetupInfo,
      totalBytes,
    },
    packageDir,
  );

  const combinedCode = requiredFiles
    .map(filePath => {
      const content = generatedFileContentsMap[filePath] || '';
      return `\n// --- File: ${filePath} ---\n${content}`;
    })
    .join('\n\n');

  return {
    finalSetupInfo,
    generatedFileContentsMap,
    usage,
    requiredFiles,
    combinedCode,
  };
}

/**
 * Generate SDK based on arguments
 */
export async function generateSDK(
  args: GenerateSDKArgs,
): Promise<SDKResult | undefined> {
  try {
    console.log('🚀 Starting SDK generation process...');

    // Validate arguments
    const validatedArgs = GenerateSDKArgsSchema.parse(args);
    console.log('✅ Arguments validated successfully');

    // Generate metadata using Google Gemini Flash with structured output
    const metadata = await generateMetadata(validatedArgs);
    console.log(`📝 Generated metadata:`);
    console.log(`- API Name: ${metadata.apiName}`);
    console.log(`- Package: ${metadata.packageName}`);
    console.log(`- Title: ${metadata.title}`);
    console.log(`- Description: ${metadata.description}`);
    console.log(`- Keywords: ${metadata.keywords.join(', ')}`);
    console.log(`- Auth Type (Initial): ${metadata.authType}`);
    if (metadata.authSdk) {
      console.log(`- Auth SDK: ${metadata.authSdk}`);
    }

    // Create initial package structure with empty files
    const packageDir = await createInitialPackage(metadata);
    console.log(`📁 Created initial package structure at ${packageDir}`);

    // Extract links from the provided URL
    const allLinks = await extractLinks(validatedArgs.url, packageDir);

    // Analyze links to find useful ones for package creation
    const usefulLinks = await analyzeLinks(allLinks, validatedArgs.query, {
      isBaseUrl: args.isBaseUrl,
      url: args.url,
      packageDir: packageDir,
    });
    console.log(`🔍 Found ${usefulLinks.length} useful links`);
    console.log(usefulLinks);

    // Extract content from useful links
    const scrapedContents = await extractContentFromUrls(usefulLinks, {
      packageDir,
      baseUrl: args.url,
    });
    // Combine all scraped content into a single document
    const combinedContent = scrapedContents
      .map(content => `## Content from: ${content.url}\n\n${content.content}`)
      .join('\n\n---\n\n');

    // Generate a single summary from all the combined content
    const docsSummary = await summarizeGenPackageContent(
      combinedContent,
      validatedArgs.query,
      {
        packageDir,
      },
    );
    // Generate code files using AI
    const {
      finalSetupInfo,
      generatedFileContentsMap,
      usage,
      requiredFiles,
      combinedCode,
    } = await generateCodeFiles(metadata, docsSummary, packageDir);

    // --- End Process Tool Results ---

    // Generate documentation using the combined code and setup info
    await generateDocs(
      combinedCode,
      {
        apiName: metadata.apiName,
        packageName: metadata.packageName,
        title: metadata.title,
        description: metadata.description,
        authType: finalSetupInfo.authType,
        authSdk: finalSetupInfo.authSdk,
      },
      packageDir,
      [finalSetupInfo.setupInfo],
    );

    // Clean up build request log
    await cleanupFoxRequests('pkg-create', {
      url: validatedArgs.url,
    });

    return {
      name: metadata.apiName,
      packageDir,
      packageName: metadata.packageName,
    };
  } catch (error) {
    console.error('❌ Error generating SDK:', error);
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
      'Usage: node generate-sdk.js "API Name/Query" "URL to scrape" [baseUrl]',
    );
    process.exit(1);
  }

  if (!urlArg) {
    console.error('❌ Error: URL argument is required');
    console.log(
      'Usage: node generate-sdk.js "API Name/Query" "URL to scrape" [baseUrl]',
    );
    process.exit(1);
  }

  generateSDK({
    query: queryArg,
    url: urlArg,
    isBaseUrl: isBaseUrlArg?.toLowerCase() === 'baseurl',
  })
    .then(result => {
      if (result) {
        console.log(`✅ SDK generation complete for ${result.packageName}`);
        console.log(`📂 Package location: ${result.packageDir}`);
        return fixBuildIssues(result.packageName);
      } else {
        console.log('⚠️ SDK generation completed with warnings or failed.');
        process.exit(1);
      }
    })
    .then(() => {
      console.log(`✅ Build fixing process initiated.`);
      console.log(`✅ All steps completed.`);
    })
    .catch(error => {
      console.error('❌ Fatal error during SDK generation or build fixing.');
      process.exit(1);
    });
}
