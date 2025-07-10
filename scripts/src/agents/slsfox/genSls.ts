import fs from 'fs';
import path from 'path';
import { generateObject } from 'ai';
import { z } from 'zod';
import { models } from '../../ai/models';
import { getProjectRoot } from '../../utils/getProjectRoot';
import { logUsage } from '../../ai/usage/usageLogger';
import dedent from 'dedent';
import { PackageInfo } from '../../types';

// Types for documentation parsing
interface FunctionDoc {
  name: string;
  description: string;
  parameters: Parameter[];
  returnType: string;
}

interface Parameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  properties?: Parameter[];
}

interface ConstructorDoc {
  name: string;
  description: string;
  parameters: Parameter[];
  returnType: string;
}

/**
 * Copy directory recursively, converting .txt extensions to appropriate extensions
 */
function copyDirectory(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);

    if (entry.isDirectory()) {
      const destPath = path.join(dest, entry.name);
      copyDirectory(srcPath, destPath);
    } else {
      // Convert .txt extensions to appropriate extensions
      let destFileName = entry.name;
      if (entry.name.endsWith('.txt')) {
        const baseName = entry.name.replace('.txt', '');
        destFileName = getProperExtension(baseName);
      }

      const destPath = path.join(dest, destFileName);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Get the proper file extension based on the base filename
 */
function getProperExtension(baseName: string): string {
  const extensionMap: { [key: string]: string } = {
    package: 'package.json',
    tsconfig: 'tsconfig.json',
    eslint: 'eslint.config.js',
    serverless: 'serverless.yml',
    openapi: 'openapi.json',
    sdkInit: 'sdkInit.ts',
    index: 'index.ts',
  };

  return extensionMap[baseName] || `${baseName}.txt`;
}

// Removed parseDocumentation function - now relying entirely on AI generation

// Removed parameter schema generation functions - now handled entirely by AI

/**
 * Generate OpenAPI path for a single function using AI
 */
async function generateOpenAPIPath(
  functionName: string,
  docContent: string,
  constructors: any[],
  packageName: string,
): Promise<any> {
  // Get all keys from constructor
  const allKeys = constructors.flatMap(constructor => [
    ...(constructor.requiredKeys || []),
    ...(constructor.internalKeys || []),
    // ...(constructor.botConfig || []),
  ]);

  const keyMap = new Map();
  allKeys.forEach(key => {
    if (!keyMap.has(key.key)) {
      keyMap.set(key.key, key);
    }
  });
  const uniqueKeys = Array.from(keyMap.values());

  const schema = z
    .object({
      summary: z
        .string()
        .describe('One clear sentence describing what this function does'),
      description: z
        .string()
        .describe('2-3 sentences explaining the function purpose and behavior'),
      parameters: z
        .object({
          type: z.literal('object').describe('Type must be object'),
          description: z.string().describe('Description of the parameters object'),
          properties: z.record(z.any()).describe('Properties of the object'),
          required: z.array(z.string()).optional().describe('Required properties'),
        })
        .describe('Parameters object schema for the function arguments'),
      responses: z
        .record(
          z.object({
            description: z.string().describe('Response description'),
            content: z
              .record(
                z.object({
                  schema: z.any().describe('Response schema'),
                }),
              )
              .optional()
              .describe('Response content'),
          }),
        )
        .describe('OpenAPI responses object'),
    })
    .catchall(z.any());

  const systemPrompt = dedent`You are an expert at analyzing function documentation and generating OpenAPI specifications.


## Principles
1. First carefully analyze the function documentation
2. Plan what needs to be done, including:
   - Identifying ALL parameters of the function
   - Planning the OpenAPI request body schema based on the parameters
   - Planning the OpenAPI responses schema for the function
3. Criticize your plan and refine it to be specific to this task
4. Write complete, production-ready code with no TODOs or placeholders
5. Recheck your code for any linting or TypeScript errors


## Process
Your task is to analyze function documentation and generate OpenAPI path for the function:
1. Generate a clear summary (one sentence)
2. Generate a detailed description (2-3 sentences)
3. Generate a single 'parameters' JSON schema object that represents all of the function's arguments.
4. Generate a complete OpenAPI responses schema

## CRITICAL ANALYSIS RULES:

### Parameters Structure:
The 'parameters' property you generate should be a single JSON Schema object representing the function's arguments. Typically, this will be an object with properties for each argument.
- If the function takes a single object as an argument, model that object's properties.
- If the function takes multiple arguments, model them as properties of a single object.

**Example:**
\`\`\`json
    {
      "type": "object",
  "description": "Configuration object containing all function parameters.",
      "properties": {
    "param1": { "type": "string", "description": "First parameter description." },
    "param2": { "type": "number", "description": "Second parameter description." },
    "param3": { 
      "type": "object", 
      "properties": { "nested": { "type": "boolean" } }
    }
      },
      "required": ["param1"]
}
\`\`\`


### Responses Schema:
Generate complete OpenAPI responses with:
- 200: Success response with appropriate schema
- 400: Client error (bad request)
- 500: Server error
- and any other status codes that are relevant to the function
`;

  const userPrompt = dedent`Analyze this function documentation and generate the required specification:

**Function:** ${functionName}

**Documentation:**
\`\`\`markdown
${docContent}
\`\`\`

Please analyze the Parameters section carefully and generate:
1. summary: One clear sentence describing what this function does
2. description: 2-3 sentences explaining the function's purpose and behavior
3. parameters: A single JSON schema object representing the function's arguments, with type "object" and properties for each argument.
4. responses: Complete OpenAPI responses schema with 200, 400, 500 status codes and any other status codes that are relevant to the function

Focus on the parameter structure - create a single object that encapsulates all parameters.`;

  try {
    const result = await generateObject({
      model: models.claude35Sonnet,
      system: systemPrompt,
      prompt: userPrompt,
      schema,
      maxRetries: 3,
    });

    logUsage(models.claude35Sonnet.modelId, result.usage);

    // Build the complete OpenAPI path from AI-generated content + package info
    let aiContent = result.object;

    return {
      post: {
        operationId: functionName,
        summary: aiContent.summary,
        description: aiContent.description,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  body: {
                    type: 'object',
                    description: `Body of the ${functionName} sls call`,
                    properties: {
                      arguments: aiContent.parameters,
                      constructor: {
                        type: 'string',
                        description: 'Name of the constructor to use.',
                        enum: constructors.map(c => c.name),
                      },
                    },
                    required: ['arguments'],
                  },
                },
              },
            },
          },
        },
        responses: aiContent.responses,
      },
    };
  } catch (error) {
    console.error(
      `❌ Error generating OpenAPI path for ${functionName}:`,
      error,
    );
    throw `Error generating OpenAPI path for ${functionName}: ${error}`;
  }
}

/**
 * Generate individual OpenAPI JSON files for each function
 */
async function generateIndividualOpenAPIFiles(
  packageInfo: PackageInfo,
  functionDocs: FunctionDoc[],
  packageName: string,
  docContents: Map<string, string>,
  slsDir: string,
): Promise<{ successCount: number; failureCount: number }> {
  const totalFunctions = functionDocs.length;
  console.log(
    `🤖 Generating OpenAPI paths using AI for ${totalFunctions} functions sequentially...`,
  );

  let successCount = 0;
  let failureCount = 0;

  for (const funcDoc of functionDocs) {
    const funcName = funcDoc.name;
    const constructorsForFunc = packageInfo.constructors.filter(c =>
      c.functionalities?.includes(funcName),
    );

    if (constructorsForFunc.length === 0) {
      console.warn(
        `⚠️ No constructor found for function: ${funcName}, skipping.`,
      );
      failureCount++;
      continue;
    }

    const docContent = docContents.get(funcName) || '';
    if (!docContent) {
      console.warn(
        `⚠️ Documentation content not found for function: ${funcName}, skipping.`,
      );
      failureCount++;
      continue;
    }

    const functionSlug = funcDoc.name.replace(/\./g, '-');
    const pathKey = `/${functionSlug}`;
    console.log(
      `🔧 Generating path for: ${pathKey} (${successCount + failureCount + 1}/${totalFunctions})`,
    );

    try {
      const pathSpec = await generateOpenAPIPath(
        funcDoc.name,
        docContent,
        constructorsForFunc,
        packageName,
      );
      const openapiDir = path.join(slsDir, 'openapi');
      if (!fs.existsSync(openapiDir)) {
        fs.mkdirSync(openapiDir, { recursive: true });
      }
      const openapiFuncPath = path.join(openapiDir, `${funcDoc.name}.json`);
      fs.writeFileSync(openapiFuncPath, JSON.stringify(pathSpec, null, 2));

      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate path for ${pathKey}:`, error);
      failureCount++;
    }
  }

  console.log(
    `📊 OpenAPI generation summary: ${successCount} successful, ${failureCount} failed`,
  );

  if (failureCount > 0) {
    console.warn(
      `⚠️ ${failureCount} functions failed to generate. OpenAPI will be incomplete.`,
    );
  }
  return { successCount, failureCount };
}

/**
 * Generate OpenAPI JSON for a package by combining individual function files
 */
function combineOpenAPIFiles(
  slsDir: string,
  packageInfo: PackageInfo,
  packageName: string,
): void {
  const openapiPath = path.join(slsDir, 'openapi.json');
  const openapiDir = path.join(slsDir, 'openapi');
  const sdkPackageJsonPath = path.join(slsDir, '..', 'package.json');
  const sdkPackageJson = fs.existsSync(sdkPackageJsonPath)
    ? JSON.parse(fs.readFileSync(sdkPackageJsonPath, 'utf8'))
    : { version: '1.0.0' };

  let openapi: any;

  // Use existing openapi.json as a base, or create a new one
  if (fs.existsSync(openapiPath)) {
    try {
      openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));
    } catch (e) {
      console.warn(
        `⚠️ Could not parse existing openapi.json, creating a new one.`,
      );
      openapi = {};
    }
  } else {
    openapi = {};
  }

  openapi.openapi = '3.0.1';
  openapi.info = {
    title: `${packageInfo.title} API`,
    version: sdkPackageJson.version,
    mcp_version: "1.0.1",
    description:
      packageInfo.description ||
      `Single entry-point API for all ${packageInfo.title} functions via a wrapper Lambda`,
    contact: {
      name: 'Microfox Dev Support',
      email: 'support@microfox.com',
    },
  };
  openapi.servers = [
    {
      url: `https://api.microfox.com/c/${packageName}`,
      description: 'Unified wrapper endpoint',
    },
  ];
  openapi.components = {
    'x-auth-packages': [
      {
        packageName: packageInfo.name,
      },
    ],
  };

  // Overwrite paths with latest from individual files
  openapi.paths = {};

  if (fs.existsSync(openapiDir)) {
    const functionFiles = fs
      .readdirSync(openapiDir)
      .filter(f => f.endsWith('.json'));
    console.log(
      `Combining ${functionFiles.length} function paths into openapi.json...`,
    );

    for (const file of functionFiles) {
      const funcName = file.replace('.json', '');
      const functionSlug = funcName.replace(/\./g, '-');
      const pathKey = `/${functionSlug}`;

      const filePath = path.join(openapiDir, file);
      try {
        const pathSpec = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        openapi.paths[pathKey] = pathSpec;
      } catch (e) {
        console.error(`❌ Error parsing ${filePath}, skipping...`, e);
      }
    }
  } else {
    console.log(`No 'openapi' directory found to combine files from.`);
  }

  fs.writeFileSync(openapiPath, JSON.stringify(openapi, null, 2));
  console.log(`✅ Updated/created openapi.json at: ${openapiPath}`);
}

/**
 * Generate openapi.md file using AI
 */
async function generateOpenAPIMarkdown(
  packageInfo: PackageInfo,
  slsDir: string,
): Promise<void> {
  const openapiPath = path.join(slsDir, 'openapi.json');
  if (!fs.existsSync(openapiPath)) {
    console.warn(`⚠️ openapi.json not found, skipping markdown generation.`);
    return;
  }
  const openapi = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

  const schema = z.object({
    markdownContent: z
      .string()
      .describe('The full content of the openapi.md file.'),
  });

  const exampleMd = `# Microfox Brave SDK API

This agent provides a comprehensive interface for interacting with the Brave Search API. It's a single entry-point API for all Microfox Brave SDK functions, exposed via a wrapper Lambda. This allows you to perform various search operations including web search, image search, video search, and news search with powerful filtering and customization options.

## Functionality

The API provides the following functionalities:

### 1. Web Search (\`/webSearch\`)

**Summary:** Performs a web search using the Brave Search API.

**Description:** This function allows users to perform web searches and retrieve results from the Brave Search API. It supports a wide range of search parameters including query, country, language, result count, and various filters. The function returns comprehensive search results including web pages, news, videos, discussions, FAQs, and more.

**Key Features:**

- Advanced filtering with result_filter parameter
- Custom date ranges for freshness
- Safe search controls
- Spell checking and text decorations
- Support for custom goggles for re-ranking
- Summary generation capabilities

## Authentication

All API endpoints require authentication using an API key strategy. The \`BRAVE_API_KEY\` must be provided in the authentication variables for each request.

## Common Parameters

Most search functions support these common parameters:

- **q**: The search query (max 400 characters, 50 words)
- **country**: Two-letter country code (e.g., 'US', 'GB')
- **search_lang**: Language for search results
- **ui_lang**: Language for user interface elements
`;

  const systemPrompt = dedent`You are an expert technical writer specializing in creating clear, user-friendly API documentation in Markdown.

Your task is to generate an \`openapi.md\` file based on the provided \`package-info.json\` and \`openapi.json\` contents.

Follow this structure precisely:

1.  **Main Title**: Use the format: \`# Microfox [Package Title] SDK API\`
2.  **Introduction**: Write a concise, one-paragraph introduction to the API, explaining its purpose. You can use the description from the package info as a starting point.
3.  **Functionality Section**:
    *   Add a section titled \`## Functionality\`.
    *   For each endpoint in the \`openapi.json\` paths, create a subsection: \`### [Number]. [Function Name] (\`/[path-slug]\`)\`.
    *   Under each subsection, include:
        *   \`**Summary:**\` followed by the summary from the OpenAPI spec.
        *   \`**Description:**\` followed by the description from the OpenAPI spec.
        *   \`**Key Features:**\` (Optional but recommended) - analyze the function's parameters and description to create a bulleted list of 3-5 key features or capabilities.
4.  **Authentication Section**:
    *   Add a section titled \`## Authentication\`.
    *   Analyze the \`requiredKeys\` from all constructors in the package info.
    *   Write a clear sentence explaining the authentication method (e.g., API key).
    *   List all unique required keys, indicating that they must be provided. For example: "The \`API_KEY_NAME\` must be provided..."
5.  **Common Parameters Section**:
    *   Add a section titled \`## Common Parameters\`.
    *   Analyze the arguments for all functions in the OpenAPI spec.
    *   Identify parameters that appear in most of the functions.
    *   Create a bulleted list of these common parameters, including their name and description. For example: \`- **parameter_name**: The parameter description.\`

Here is an example of a well-structured \`openapi.md\` file:
\`\`\`markdown
${exampleMd}
\`\`\`
`;

  const userPrompt = dedent`Please generate the \`openapi.md\` file for the following package.

**Package Info (\`package-info.json\`):**
\`\`\`json
${JSON.stringify(packageInfo, null, 2)}
\`\`\`

**OpenAPI Specification (\`openapi.json\`):**
\`\`\`json
${JSON.stringify(openapi, null, 2)}
\`\`\`
`;

  try {
    const { object: result, usage } = await generateObject({
      model: models.claude35Sonnet,
      system: systemPrompt,
      prompt: userPrompt,
      schema,
    });

    logUsage(models.claude35Sonnet.modelId, usage);
    const markdownPath = path.join(slsDir, 'openapi.md');
    fs.writeFileSync(markdownPath, result.markdownContent);
    console.log(`✅ Generated openapi.md at: ${markdownPath}`);
  } catch (error) {
    console.error(`❌ Error generating openapi.md:`, error);
  }
}

/**
 * Generate SDK initialization file content using AI
 */
async function generateSDKInitContent(
  packageInfo: PackageInfo,
): Promise<string> {
  const schema = z.object({
    sdkInitCode: z
      .string()
      .describe('Complete TypeScript code for the sdkInit.ts file'),
  });

  const systemPrompt = `You are an expert TypeScript developer. Your task is to generate a complete \`sdkInit.ts\` file. This file exports a function \`sdkInit\` that takes a configuration object and returns a \`Record<string, Function>\` which maps function names to their bound SDK method implementations.

Here is an example of the expected output file:
\`\`\`typescript
import { createBraveSDK } from '@microfox/brave';

interface SDKConfig {
  constructorName: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig): Record<string, Function> => {
  const { constructorName, BRAVE_API_KEY, ...options } = config;

  if (!BRAVE_API_KEY) {
    throw new Error('BRAVE_API_KEY is required');
  }

  switch (constructorName) {
    case 'createBraveSDK':
      const sdk = createBraveSDK({
        apiKey: BRAVE_API_KEY,
        ...options,
      });
      const sdkMap: Record<string, Function> = {};
      sdkMap.webSearch = sdk.webSearch.bind(sdk);
      sdkMap.imageSearch = sdk.imageSearch.bind(sdk);
      sdkMap.newsSearch = sdk.newsSearch.bind(sdk);
      return sdkMap;
    default:
      // Fallback or handle default case appropriately
      const defaultSdk = createBraveSDK({
        apiKey: BRAVE_API_KEY,
        ...options,
      });
      const defaultSdkMap: Record<string, Function> = {};
      defaultSdkMap.webSearch = defaultSdk.webSearch.bind(defaultSdk);
      defaultSdkMap.imageSearch = defaultSdk.imageSearch.bind(defaultSdk);
      defaultSdkMap.newsSearch = defaultSdk.newsSearch.bind(defaultSdk);
      return defaultSdkMap;
  }
};

export { createBraveSDK };
\`\`\`

## Your Task:
Generate the \`sdkInit.ts\` file by following these rules:

1.  **Imports**: Import all necessary constructor functions from the package \`${packageInfo.name}\`.
2.  **SDKConfig Interface**: Create an interface named \`SDKConfig\`. It should include \`constructorName: string\` and use \`[key: string]: any;\` to allow for other properties.
3.  **sdkInit Function**:
    *   It must accept one argument, \`config: SDKConfig\`.
    *   The return type must be \`Record<string, Function>\`.
    *   Inside the function, destructure \`constructorName\` and all required credential keys from the \`config\` object.
    *   Implement a \`switch\` statement on \`constructorName\`.
    *   For each \`case\`, instantiate the corresponding SDK client.
    *   After instantiation, create a \`sdkMap: Record<string, Function> = {}\`.
    *   For **every** function listed in that constructor's functionalities, populate the \`sdkMap\`. For a function named \`exampleFunc\`, the entry should be \`sdkMap.exampleFunc = sdk.exampleFunc.bind(sdk);\`.
    *   Return the populated \`sdkMap\`.
    *   Include a \`default\` case that uses the first constructor as a fallback, performs the same mapping, and returns the map.
4.  **Exports**: After the \`sdkInit\` function, re-export all the imported constructor functions.`;

  // Create a more detailed representation of constructors for the prompt
  const constructorDetails = packageInfo.constructors
    .map(c => {
      const requiredKeys = [
        ...(c.requiredKeys || []),
        ...(c.internalKeys || []),
        // ...(c.botConfig || []),
      ]
        .map(k => k.key)
        .join(', ');

      const functionalities = (c.functionalities || []).join(', ');

      return `- Constructor Name: ${c.name}
  - Required Keys: ${requiredKeys || 'None'}
  - Functionalities: ${functionalities || 'None'}`;
    })
    .join('\n');

  const userPrompt = `Generate the complete \`sdkInit.ts\` file for the following package:

**Package Name:** \`${packageInfo.name}\`

**Constructors and their functions:**
${constructorDetails}

Please generate the complete \`sdkInit.ts\` file as per the instructions and example provided in the system prompt. Ensure all functionalities for each constructor are mapped correctly.`;

  try {
    const { object: result, usage } = await generateObject({
      model: models.claude35Sonnet,
      system: systemPrompt,
      prompt: userPrompt,
      schema,
      maxRetries: 3,
    });

    logUsage(models.claude35Sonnet.modelId, usage);

    return result.sdkInitCode;
  } catch (error) {
    console.error(`❌ Error generating SDK init content:`, error);
    throw error;
  }
}

/**
 * Update template files with package-specific information
 */
function updateTemplateFiles(
  slsDir: string,
  packageName: string,
  description: string,
): void {
  // Update package.json
  const packageJsonPath = path.join(slsDir, 'package.json');
  const parentPackageJsonPath = path.join(slsDir, '..', 'package.json');
  const parentPackageJson = JSON.parse(
    fs.readFileSync(parentPackageJsonPath, 'utf8'),
  );
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = `public-${packageName}-api`;
    packageJson.description = description;
    packageJson.dependencies[parentPackageJson.name] =
      `^${parentPackageJson.version}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated package.json for ${packageJson.name}`);
  }

  // Update serverless.yml
  const serverlessPath = path.join(slsDir, 'serverless.yml');
  if (fs.existsSync(serverlessPath)) {
    let serverlessContent = fs.readFileSync(serverlessPath, 'utf8');
    // Replace the service name on the first line
    serverlessContent = serverlessContent.replace(
      /^service:\s+.+$/m,
      `service: public-${packageName}-api`,
    );

    fs.writeFileSync(serverlessPath, serverlessContent);
    console.log(
      `✅ Updated serverless.yml for public-${packageName}-api`,
    );
  }
}

/**
 * Update multiple functions in the OpenAPI JSON
 */
async function updateFunctionsInOpenAPI(
  packageName: string,
  functionNames: string[],
  packageInfo: PackageInfo,
  docsDir: string,
): Promise<boolean> {
  try {
    const projectRoot = getProjectRoot();
    const slsDir = path.join(projectRoot, 'packages', packageName, 'sls');
    const openApiPath = path.join(slsDir, 'openapi.json');

    if (!fs.existsSync(openApiPath)) {
      console.error(`❌ OpenAPI file not found: ${openApiPath}`);
      return false;
    }

    const functionDocs: FunctionDoc[] = [];
    const docContents = new Map<string, string>();

    for (const funcName of functionNames) {
      const docPath = path.join(docsDir, 'functions', `${funcName}.md`);
      if (fs.existsSync(docPath)) {
        const docContent = fs.readFileSync(docPath, 'utf8');
        docContents.set(funcName, docContent);
        const funcDoc: FunctionDoc = {
          name: funcName,
          description: `${funcName} function`,
          parameters: [],
          returnType: 'Promise<any>',
        };
        functionDocs.push(funcDoc);
      } else {
        console.warn(`⚠️ Documentation not found for function: ${funcName}`);
      }
    }

    await generateIndividualOpenAPIFiles(
      packageInfo,
      functionDocs,
      packageName,
      docContents,
      slsDir,
    );

    combineOpenAPIFiles(slsDir, packageInfo, packageName);

    // Generate openapi.md
    console.log(`✍️ Generating OpenAPI markdown documentation...`);
    await generateOpenAPIMarkdown(packageInfo, slsDir);

    console.log(
      `✅ Updated OpenAPI for ${functionNames.length} functions successfully`,
    );

    return true;
  } catch (error) {
    console.error(`❌ Error updating functions in OpenAPI:`, error);
    return false;
  }
}

/**
 * Main function to generate SLS structure for a package
 */
export async function generateSLSStructure(
  packageName: string,
  specificFunctions?: string[],
): Promise<boolean> {
  try {
    const projectRoot = getProjectRoot();
    console.log(`🔍 Project root: ${projectRoot}`);
    const packageDir = path.join(projectRoot, 'packages', packageName);
    const packageInfoPath = path.join(packageDir, 'package-info.json');
    const docsDir = path.join(packageDir, 'docs');
    const slsDir = path.join(packageDir, 'sls');
    const templateDir = path.join(__dirname, 'template');

    if (specificFunctions && specificFunctions.length > 0) {
      console.log(
        `🔧 Updating OpenAPI for specific functions: ${specificFunctions.join(', ')} in ${packageName}...`,
      );
    } else {
      console.log(`🚀 Generating SLS structure for ${packageName}...`);
    }

    // Check if package exists
    if (!fs.existsSync(packageDir)) {
      console.error(`❌ Package directory not found: ${packageDir}`);
      return false;
    }

    // Read package info
    if (!fs.existsSync(packageInfoPath)) {
      console.error(`❌ Package info not found: ${packageInfoPath}`);
      return false;
    }

    const packageInfo: PackageInfo = JSON.parse(
      fs.readFileSync(packageInfoPath, 'utf8'),
    );
    const constructors = packageInfo.constructors;

    if (!constructors || constructors.length === 0) {
      console.error(
        `❌ No constructors found in package info for ${packageName}`,
      );
      return false;
    }

    console.log(
      `📋 Found ${constructors.length} constructors: ${constructors.map(c => c.name).join(', ')}`,
    );

    // Get functionalities from constructors
    const functionalities = [
      ...new Set(constructors.flatMap(c => c.functionalities || [])),
    ];
    console.log(
      `📋 Found ${functionalities.length} unique functions across all constructors: ${functionalities.join(', ')}`,
    );

    // If specific functions are requested, validate they exist
    if (specificFunctions && specificFunctions.length > 0) {
      // Filter out constructor functions from specific functions
      const constructorNames = constructors.map(c => c.name);
      const filteredFunctions = specificFunctions.filter(func => {
        if (constructorNames.includes(func)) {
          console.log(
            `⏭️ Skipping constructor function: ${func} (constructors don't need OpenAPI endpoints)`,
          );
          return false;
        }
        return true;
      });

      // Update specificFunctions to the filtered list
      specificFunctions = filteredFunctions;

      // If all functions were constructors, exit early
      if (specificFunctions.length === 0) {
        console.log(
          `ℹ️ All specified functions were constructors. No OpenAPI updates needed.`,
        );
        return true;
      }

      const invalidFunctions = specificFunctions.filter(
        func => !functionalities.includes(func),
      );
      if (invalidFunctions.length > 0) {
        console.error(
          `❌ Functions not found in package functionalities: ${invalidFunctions.join(', ')}`,
        );
        console.error(`Available functions: ${functionalities.join(', ')}`);
        console.log(
          `Removing invalid functions from specificFunctions: ${invalidFunctions.join(', ')}`,
        );
        specificFunctions = specificFunctions.filter(
          func => !invalidFunctions.includes(func),
        );
        console.log(
          `Updated specificFunctions: ${specificFunctions.join(', ')}`,
        );
      }
    }

    // Check if SLS directory exists for specific function updates
    const slsExists = fs.existsSync(slsDir);

    if (specificFunctions && specificFunctions.length > 0 && slsExists) {
      // For specific function updates, regenerate SDK init and update OpenAPI
      console.log(`🔧 Regenerating SDK initialization file...`);
      const constructorDocContents = new Map<string, string>();
      for (const constructor of constructors) {
        const constructorDocPath = path.join(docsDir, `${constructor.name}.md`);
        if (!fs.existsSync(constructorDocPath)) {
          console.error(
            `❌ Constructor documentation not found: ${constructorDocPath}`,
          );
          return false;
        }
        constructorDocContents.set(
          constructor.name,
          fs.readFileSync(constructorDocPath, 'utf8'),
        );
      }

      const sdkInitContent = await generateSDKInitContent(
        packageInfo,
      );
      const sdkInitPath = path.join(slsDir, 'src', 'sdkInit.ts');
      fs.writeFileSync(sdkInitPath, sdkInitContent);
      console.log(`✅ Regenerated SDK Init at: ${sdkInitPath}`);

      // Update specific functions in OpenAPI
      return await updateFunctionsInOpenAPI(
        packageName,
        specificFunctions,
        packageInfo,
        docsDir,
      );
    }

    // Full SLS generation (either no specific functions or SLS doesn't exist)
    if (specificFunctions && specificFunctions.length > 0 && !slsExists) {
      console.log(`📁 SLS directory doesn't exist, creating full structure...`);
    }

    // Check if template exists
    if (!fs.existsSync(templateDir)) {
      console.error(`❌ Template directory not found: ${templateDir}`);
      return false;
    }

    // Copy template to sls directory
    console.log(`📁 Copying template to ${slsDir}...`);
    if (fs.existsSync(slsDir)) {
      console.log(`⚠️ SLS directory already exists, removing it first...`);
      fs.rmSync(slsDir, { recursive: true, force: true });
    }
    copyDirectory(templateDir, slsDir);
    console.log(`✅ Template copied successfully`);

    // Overwrite index.ts with the new standardized template
    const newIndexTsContent = `import dotenv from 'dotenv';
import { sdkInit } from './sdkInit.js';
import { APIGatewayEvent } from 'aws-lambda';
import {
  ToolParse,
  createApiResponse,
  ApiError,
  InternalServerError,
} from '@microfox/tool-core';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config(); // for any local vars

const toolHandler = new ToolParse({
  encryptionKey: process.env.ENCRYPTION_KEY,
});

export const handler = async (event: APIGatewayEvent): Promise<any> => {
  if (event.path === '/docs.json' && event.httpMethod === 'GET') {
    try {
      const openapiPath = path.resolve(__dirname, 'openapi.json');
      const openapiSpec = fs.readFileSync(openapiPath, 'utf-8');
      return createApiResponse(200, JSON.parse(openapiSpec));
    } catch (error) {
      console.error('Error reading openapi.json:', error);
      const internalError = new InternalServerError('Could not load API specification.');
      return createApiResponse(internalError.statusCode, {
        error: internalError.message,
      });
    }
  }

  try {
    // Extract environment variables from the new structure
    toolHandler.populateEnvVars(event);

    const constructorName = toolHandler.extractConstructor(event);

    // Map functions
    const sdkMap = sdkInit({
      constructorName,
      ...process.env,
    });

    // Extract function arguments
    const args = toolHandler.extractArguments(event);

    // Extract function from the SDK map
    const fn = toolHandler.extractFunction(sdkMap, event);

    // Invoke the function
    const result = await toolHandler.executeFunction(fn, args);

    // Return successful response
    return createApiResponse(200, result);
  } catch (error) {
    console.error('Error in handler:', error);

    // Handle custom API errors
    if (error instanceof ApiError) {
      return createApiResponse(error.statusCode, { error: error.message });
    }

    // Handle unexpected errors
    const internalError = new InternalServerError(
      error instanceof Error ? error.message : String(error),
    );
    return createApiResponse(internalError.statusCode, {
      error: internalError.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};`;
    const indexPath = path.join(slsDir, 'src', 'index.ts');
    fs.writeFileSync(indexPath, newIndexTsContent);
    console.log(`✅ Overwrote src/index.ts with new template.`);

    // Update template files with package-specific information
    updateTemplateFiles(slsDir, packageName, packageInfo.description);

    // Read constructor documentation (for SDK generation)
    const constructorDocContents = new Map<string, string>();
    for (const constructor of constructors) {
      const constructorDocPath = path.join(
        docsDir,
        'constructors',
        `${constructor.name}.md`,
      );
      if (!fs.existsSync(constructorDocPath)) {
        console.error(
          `❌ Constructor documentation not found: ${constructorDocPath}`,
        );
        return false;
      }
      constructorDocContents.set(
        constructor.name,
        fs.readFileSync(constructorDocPath, 'utf8'),
      );
    }

    // Generate SDK Init file first
    console.log(`🔧 Generating SDK initialization file...`);
    const sdkInitContent = await generateSDKInitContent(packageInfo);
    const sdkInitPath = path.join(slsDir, 'src', 'sdkInit.ts');
    fs.writeFileSync(sdkInitPath, sdkInitContent);
    console.log(`✅ Generated SDK Init at: ${sdkInitPath}`);

    // Create a simple constructor doc object for SDK generation
    // Read function documentation (for AI generation)
    const functionDocs: FunctionDoc[] = [];
    const docContents = new Map<string, string>();

    // If specific functions are provided, only process those; otherwise process all
    const functionsToProcess =
      specificFunctions && specificFunctions.length > 0
        ? specificFunctions
        : functionalities;

    for (const funcName of functionsToProcess) {
      // Skip constructor functions (double-check for full generation)
      if (constructors.some(c => c.name === funcName)) {
        console.log(
          `⏭️ Skipping constructor function: ${funcName} (constructors don't need OpenAPI endpoints)`,
        );
        continue;
      }

      const docPath = path.join(docsDir, 'functions', `${funcName}.md`);
      if (fs.existsSync(docPath)) {
        const docContent = fs.readFileSync(docPath, 'utf8');
        docContents.set(funcName, docContent);
        // Create a simple function doc object for the OpenAPI generation
        const funcDoc: FunctionDoc = {
          name: funcName,
          description: `${funcName} function`,
          parameters: [], // Will be analyzed by AI
          returnType: 'Promise<any>',
        };
        functionDocs.push(funcDoc);
        console.log(`📖 Read documentation for: ${funcName}`);
      } else {
        console.warn(`⚠️ Documentation not found for function: ${funcName}`);
      }
    }

    // Generate OpenAPI JSON
    console.log(`🔧 Generating individual OpenAPI function files...`);
    await generateIndividualOpenAPIFiles(
      packageInfo,
      functionDocs,
      packageName,
      docContents,
      slsDir,
    );

    // Combine individual files into the main openapi.json
    console.log(`🔧 Combining OpenAPI files...`);
    combineOpenAPIFiles(slsDir, packageInfo, packageName);
    const openApiPath = path.join(slsDir, 'openapi.json');
    console.log(`✅ Generated and combined OpenAPI at: ${openApiPath}`);

    // Generate openapi.md
    console.log(`✍️ Generating OpenAPI markdown documentation...`);
    await generateOpenAPIMarkdown(packageInfo, slsDir);

    // Update package.json
    console.log(`📦 Updating package.json...`);
    console.log(`✅ Updated package.json with dependency: ${packageInfo.name}`);

    console.log(`\n✅ Successfully generated SLS structure for ${packageName}`);
    console.log(`📁 SLS directory: ${slsDir}`);
    console.log(`🔗 OpenAPI: ${path.join(slsDir, 'openapi.json')}`);
    console.log(`🔗 OpenAPI MD: ${path.join(slsDir, 'openapi.md')}`);
    console.log(`🔗 SDK Init: ${path.join(slsDir, 'src', 'sdkInit.ts')}`);

    return true;
  } catch (error) {
    console.error(
      `❌ Error generating SLS structure for ${packageName}:`,
      error,
    );
    return false;
  }
}

// CLI usage
if (require.main === module) {
  const packageName = process.argv[2];
  const specificFunctionsArg = process.argv[3];

  if (!packageName) {
    console.error('Please provide a package name as an argument');
    console.error('Usage: node genSls.js <package-name> [function-names]');
    console.error(
      '  <package-name>: Name of the package to generate SLS structure for',
    );
    console.error(
      '  [function-names]: Optional. Comma-separated list of function names to update in OpenAPI',
    );
    console.error('  Example: node genSls.js my-package "func1,func2,func3"');
    process.exit(1);
  }

  // Parse specific functions from comma-separated string
  const specificFunctions = specificFunctionsArg
    ? specificFunctionsArg
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0)
    : undefined;

  (async () => {
    try {
      const success = await generateSLSStructure(
        packageName,
        specificFunctions,
      );
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error('❌ Unhandled error:', error);
      process.exit(1);
    }
  })();
}
