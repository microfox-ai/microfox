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
  constructor: any,
  packageName: string,
): Promise<any> {
  // Get all keys from constructor
  const allKeys = [
    ...(constructor.requiredKeys || []),
    ...(constructor.internalKeys || []),
    ...(constructor.botConfig || []),
  ];

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
          type: z.literal('array').describe('Type must be array'),
          items: z.array(z.any()).describe('Array of parameter schemas'),
        })
        .describe('Parameters object with type array and items'),
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
3. Generate parameters with type "array" and items array representing function parameters
4. Generate a complete OpenAPI responses schema

## CRITICAL ANALYSIS RULES:

### Parameter Pattern Recognition:
- **SINGLE OBJECT Parameter**: If you see ONE main parameter with nested sub-items (indented), generate ONE object in parameters.items
- **MULTIPLE INDIVIDUAL Parameters**: If you see MULTIPLE main parameters at the same level, generate MULTIPLE items in parameters.items

### Parameters Structure:
The parameters object should always have:
- type: "array"
- items: Array where each item represents one function parameter in the exact order they appear

**Single Object Parameter Example:**
\`\`\`json
{
  "type": "array",
  "items": [
    {
      "type": "object",
      "description": "Configuration object containing all function parameters",
      "properties": {
        "param1": { "type": "string", "description": "First parameter description" },
        "param2": { "type": "number", "description": "Second parameter description" },
        "param3": { "type": "boolean", "description": "Third parameter description" }
      },
      "required": ["param1"]
    }
  ]
}
\`\`\`

**Multiple Individual Parameters Example:**
\`\`\`json
{
  "type": "array",
  "items": [
    {
      "type": "object",
      "description": "First parameter - configuration object",
      "properties": {
        "field1": { "type": "string", "description": "Field description" },
        "field2": { "type": "array", "items": { "type": "object" }, "description": "Array field description" }
      },
      "required": ["field1"]
    },
    {
      "type": "string", 
      "description": "Second parameter - identifier"
    },
    {
      "type": "array",
      "description": "Third parameter - optional array",
      "items": { "type": "object" }
    }
  ]
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
3. parameters: Object with type "array" and items array where each item represents one function parameter (analyze if it's single object or multiple parameters)
4. responses: Complete OpenAPI responses schema with 200, 400, 500 status codes and any other status codes that are relevant to the function

Focus on the parameter structure - look for indentation patterns to determine if it's a single configuration object or multiple individual parameters.`;

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

    // Handle unknown parameter item types by converting them to 'any'
    // if (aiContent.parameters && aiContent.parameters.items) {
    //     aiContent.parameters.items = aiContent.parameters.items.map((item: any) => {
    //         if (!item || typeof item !== 'object') {
    //             return { type: 'any', description: 'Parameter' };
    //         }
    //         return item;
    //     });
    // } else {
    //     // Fallback if parameters structure is missing or invalid
    //     aiContent.parameters = {
    //         type: 'array',
    //         items: [{ type: 'any', description: 'Function parameters' }]
    //     };
    // }

    // Build auth variables array - specific objects for each required key
    const authVariables = allKeys.map(key => ({
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: key.key,
        },
        value: {
          type: 'string',
          description: `value of ${key.key}`,
        },
      },
    }));

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
                      auth: {
                        type: 'object',
                        description: 'Authentication object',
                        properties: {
                          strategy: {
                            type: 'string',
                            description: 'Authentication strategy',
                            enum: [constructor.auth],
                          },
                          variables: {
                            type: 'array',
                            description:
                              'Variables for the authentication strategy',
                            items: authVariables,
                          },
                        },
                      },
                      constructorName: {
                        type: 'string',
                        description: 'Name of the constructor to use.',
                        default: constructor.name,
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

    // Create a fallback OpenAPI path with basic structure
    // console.log(`🔄 Creating fallback OpenAPI path for ${functionName}...`);
    // const authVariables = keysInfo.map(key => ({
    //     type: 'object',
    //     properties: {
    //         key: {
    //             type: 'string',
    //             description: key.key,
    //         },
    //         value: {
    //             type: 'string',
    //             description: `value of ${key.key}`,
    //         },
    //     },
    // }));

    // return {
    //     post: {
    //         operationId: functionName,
    //         summary: `Execute ${functionName} function`,
    //         description: `Executes the ${functionName} function with provided parameters`,
    //         requestBody: {
    //             required: true,
    //             content: {
    //                 'application/json': {
    //                     schema: {
    //                         type: 'object',
    //                         properties: {
    //                             body: {
    //                                 type: 'object',
    //                                 description: `Body of the ${functionName} sls call`,
    //                                 properties: {
    //                                     arguments: {
    //                                         type: 'array',
    //                                         items: [{ type: 'any', description: 'Function parameters' }]
    //                                     },
    //                                     auth: {
    //                                         type: 'object',
    //                                         description: 'Authentication object',
    //                                         properties: {
    //                                             strategy: {
    //                                                 type: 'string',
    //                                                 description: 'Authentication strategy',
    //                                                 enum: [constructor.auth],
    //                                             },
    //                                             variables: {
    //                                                 type: 'array',
    //                                                 description: 'Variables for the authentication strategy',
    //                                                 items: authVariables,
    //                                             },
    //                                         },
    //                                     },
    //                                     packageName: {
    //                                         type: 'string',
    //                                         description: `@microfox/${packageName}`,
    //                                     },
    //                                 },
    //                                 required: ['arguments'],
    //                             },
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //         responses: {
    //             '200': {
    //                 description: 'Successful response',
    //                 content: {
    //                     'application/json': {
    //                         schema: {
    //                             type: 'object',
    //                             properties: {
    //                                 success: { type: 'boolean' },
    //                                 data: { type: 'any' }
    //                             }
    //                         }
    //                     }
    //                 }
    //             },
    //             '400': {
    //                 description: 'Bad request'
    //             },
    //             '500': {
    //                 description: 'Internal server error'
    //             }
    //         },
    //     },
    // };
  }
}

/**
 * Generate OpenAPI JSON for a package using AI (sequential generation)
 */
async function generateOpenAPI(
  packageInfo: PackageInfo,
  functionDocs: FunctionDoc[],
  packageName: string,
  docContents: Map<string, string>,
): Promise<any> {
  const openapi = {
    openapi: '3.0.1',
    info: {
      title: `${packageInfo.title} API`,
      version: '1.0.0',
      description: `Single entry-point API for all ${packageInfo.title} functions via a wrapper Lambda`,
      packageName: packageInfo.name,
      contact: {
        name: 'Microfox Dev Support',
        email: 'support@microfox.com',
      },
    },
    servers: [
      {
        url: `https://api.microfox.com/c/${packageName}`,
        description: 'Unified wrapper endpoint',
      },
    ],
    paths: {} as any,
  };

  // Generate paths for each function using AI sequentially
  const totalFunctions = packageInfo.constructors.reduce(
    (acc, c) => acc + (c.functionalities?.length || 0),
    0,
  );
  console.log(
    `🤖 Generating OpenAPI paths using AI for ${totalFunctions} functions across ${packageInfo.constructors.length} constructors sequentially...`,
  );

  let successCount = 0;
  let failureCount = 0;

  for (const constructor of packageInfo.constructors) {
    const constructorFunctionalities = constructor.functionalities || [];
    for (const funcName of constructorFunctionalities) {
      const funcDoc = functionDocs.find(f => f.name === funcName);
      if (!funcDoc) {
        console.warn(`⚠️ funcDoc not found for function: ${funcName}, skipping.`);
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

      const constructorNameForPath = constructor.name.replace(/\./g, '-');
      const functionSlug = funcDoc.name.replace(/\./g, '-');
      const pathKey = `/${constructorNameForPath}/${functionSlug}`;
      console.log(
        `🔧 Generating path for: ${pathKey} (${successCount + failureCount + 1}/${totalFunctions})`,
      );

      try {
        const pathSpec = await generateOpenAPIPath(
          funcDoc.name,
          docContent,
          constructor,
          packageName,
        );
        openapi.paths[pathKey] = pathSpec;
        successCount++;
        console.log(`✅ Generated AI path for: ${pathKey}`);
      } catch (error) {
        console.error(`❌ Failed to generate path for ${pathKey}:`, error);
        failureCount++;
      }
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

  return openapi;
}

/**
 * Generate SDK initialization file content using AI
 */
async function generateSDKInitContent(
  packageInfo: PackageInfo,
  constructorDocContents: Map<string, string>,
  templatePath: string,
): Promise<string> {
  // Read the template file
  const template = fs.readFileSync(templatePath, 'utf8');

  const schema = z.object({
    sdkInitCode: z
      .string()
      .describe('Complete TypeScript code for the sdkInit.ts file'),
  });

  const systemPrompt = `You are an expert TypeScript developer. Your task is to generate a complete \`sdkInit.ts\` file for a micro-service. This file will export a factory function called \`sdkInit\` that creates and returns an SDK client instance based on a provided constructor name.

You will be given information about the package, its constructors, and their documentation.

Here is an example of a good \`sdkInit.ts\` file:
\`\`\`typescript
import { WebClient, MicrofoxSlackClient } from '@microfox/slack';

interface SDKConfig {
  constructorName: string;
  SLACK_BOT_TOKEN: string;
  [key: string]: any;
}

export const sdkInit = (config: SDKConfig): WebClient | MicrofoxSlackClient => {
  const { constructorName, SLACK_BOT_TOKEN, ...options } = config;

  if (!SLACK_BOT_TOKEN) {
    throw new Error('SLACK_BOT_TOKEN is required');
  }

  switch (constructorName) {
    case 'WebClient':
      return new WebClient(SLACK_BOT_TOKEN, options);
    case 'MicrofoxSlackClient':
      return new MicrofoxSlackClient(SLACK_BOT_TOKEN, options);
    default:
      throw new Error(\`Constructor "\\\${constructorName}" is not supported.\`);
  }
};

export { WebClient, MicrofoxSlackClient };
\`\`\`

## Your Task:
Generate the \`sdkInit.ts\` file by following these rules:
1.  **Imports**: Import all constructor classes from the package \`${packageInfo.name}\`.
2.  **SDKConfig Interface**: Create an interface named \`SDKConfig\`. It must include \`constructorName: string\` and all possible credential keys from ALL constructors. Use \`[key: string]: any;\` for additional options.
3.  **sdkInit Function**:
    *   It must accept one argument, \`config: SDKConfig\`.
    *   The return type must be a union of all possible constructor class types (e.g., \`WebClient | MicrofoxSlackClient\`).
    *   Inside the function, destructure \`constructorName\` and all credential keys from the \`config\` object.
    *   Implement a \`switch\` statement on \`constructorName\`.
    *   Each \`case\` should correspond to a constructor name. Inside the case, validate the required credentials for that specific constructor, and then create and return a \`new\` instance of it, passing the appropriate credentials.
    *   Include a \`default\` case that throws an error for an unsupported constructor.
4.  **Exports**: After the \`sdkInit\` function, re-export all the imported constructor classes.`;

  const userPrompt = `Now, generate the complete \`sdkInit.ts\` file for the following package:

**Package Information:**
- Name: ${packageInfo.name}
- Title: ${packageInfo.title}
- Description: ${packageInfo.description}

**Constructors:**
${packageInfo.constructors
  .map(
    c =>
      `- Name: ${c.name}, Auth Type: ${c.auth}, Required Keys: ${[
        ...(c.requiredKeys || []),
        ...(c.internalKeys || []),
        ...(c.botConfig || []),
      ]
        .map(k => k.key)
        .join(', ')}
  - Functions: ${(c.functionalities || []).join(', ')}`,
  )
  .join('\n')}

**Constructor Documentations:**
${Array.from(constructorDocContents.entries())
  .map(([name, content]) => `\n**${name}**:\n\`\`\`\n${content}\n\`\`\``)
  .join('')}

Please generate the complete \`sdkInit.ts\` file as instructed. Do not use the template, generate from scratch based on the rules and the example.`;

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
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = `public-${packageName}-api`;
    packageJson.description = description;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated package.json name to: ${packageJson.name}`);
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
      `✅ Updated serverless.yml service to: public-${packageName}-api`,
    );
  }
}

/**
 * Update package.json to include the package dependency
 */
function updatePackageJson(slsDir: string, packageInfo: PackageInfo): void {
  const packageJsonPath = path.join(slsDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const sdkPackageJson = JSON.parse(
    fs.readFileSync(path.join(slsDir, '..', 'package.json'), 'utf8'),
  );

  // Update name and description
  packageJson.name =
    'public-' + packageInfo.name.replace('@microfox/', '') + '-api';
  packageJson.description = packageInfo.description;

  // Add the package as a dependency
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  packageJson.dependencies[packageInfo.name] = `^${sdkPackageJson.version}`;

  const serverlessPath = path.join(slsDir, 'serverless.yml');
  let serverlessContent = fs.readFileSync(serverlessPath, 'utf8');
  serverlessContent = serverlessContent.replace(
    /^service:\s+.+$/m,
    `service: public-${packageInfo.name.replace('@microfox/', '')}-api`,
  );
  fs.writeFileSync(serverlessPath, serverlessContent);

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
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

    // Read existing OpenAPI JSON
    const openapi = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));

    // Get constructor name for validation
    const constructorNames = packageInfo.constructors.map(c => c.name);

    let successCount = 0;
    let failureCount = 0;
    let skippedCount = 0;

    // Update each specified function
    for (const functionName of functionNames) {
      // Skip constructor functions
      if (constructorNames.includes(functionName)) {
        console.log(
          `⏭️ Skipping constructor function: ${functionName} (constructors don't need OpenAPI endpoints)`,
        );
        skippedCount++;
        continue;
      }

      const constructorsForFunction = packageInfo.constructors.filter(c =>
        c.functionalities?.includes(functionName),
      );

      if (constructorsForFunction.length === 0) {
        console.warn(
          `⚠️ Function ${functionName} not found in any constructor's functionalities. Skipping.`,
        );
        continue;
      }

      const docPath = path.join(docsDir, `${functionName}.md`);
      if (!fs.existsSync(docPath)) {
        console.error(
          `❌ Documentation not found for function: ${functionName}`,
        );
        failureCount++;
        continue;
      }

      const docContent = fs.readFileSync(docPath, 'utf8');
      console.log(`🔧 Updating OpenAPI path for function: ${functionName}`);

      try {
        for (const constructor of constructorsForFunction) {
          const constructorNameForPath = constructor.name.replace(/\./g, '-');
          const functionSlug = functionName.replace(/\./g, '-');
          const pathKey = `/${constructorNameForPath}/${functionSlug}`;
          const pathSpec = await generateOpenAPIPath(
            functionName,
            docContent,
            constructor,
            packageName,
          );
          openapi.paths[pathKey] = pathSpec;
          console.log(
            `✅ Generated AI path for: ${functionName} with constructor ${constructor.name}`,
          );
        }
        successCount++;
      } catch (error) {
        console.error(`❌ Error updating function ${functionName}:`, error);
        failureCount++;
      }
    }

    // Write updated OpenAPI JSON
    fs.writeFileSync(openApiPath, JSON.stringify(openapi, null, 2));
    console.log(
      `✅ Updated OpenAPI for ${successCount} functions (${failureCount} failed, ${skippedCount} skipped)`,
    );

    return failureCount === 0;
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

      const sdkInitTemplatePath = path.join(templateDir, 'src', 'sdkInit.txt');
      const sdkInitContent = await generateSDKInitContent(
        packageInfo,
        constructorDocContents,
        sdkInitTemplatePath,
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

    // Update template files with package-specific information
    updateTemplateFiles(slsDir, packageName, packageInfo.description);

    // Read constructor documentation (for SDK generation)
    const constructorDocContents = new Map<string, string>();
    for (const constructor of constructors) {
      const constructorDocPath = path.join(docsDir, 'constructors', `${constructor.name}.md`);
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
    console.log(`🔧 Generating OpenAPI specification...`);
    const openapi = await generateOpenAPI(
      packageInfo,
      functionDocs,
      packageName,
      docContents,
    );
    const openApiPath = path.join(slsDir, 'openapi.json');
    fs.writeFileSync(openApiPath, JSON.stringify(openapi, null, 2));
    console.log(`✅ Generated OpenAPI at: ${openApiPath}`);

    // Generate SDK Init file
    console.log(`🔧 Generating SDK initialization file...`);
    const sdkInitTemplatePath = path.join(templateDir, 'src', 'sdkInit.txt');
    const sdkInitContent = await generateSDKInitContent(
      packageInfo,
      constructorDocContents,
      sdkInitTemplatePath,
    );
    const sdkInitPath = path.join(slsDir, 'src', 'sdkInit.ts');
    fs.writeFileSync(sdkInitPath, sdkInitContent);
    console.log(`✅ Generated SDK Init at: ${sdkInitPath}`);

    // Update package.json
    console.log(`📦 Updating package.json...`);
    updatePackageJson(slsDir, packageInfo);
    console.log(`✅ Updated package.json with dependency: ${packageInfo.name}`);

    console.log(`\n✅ Successfully generated SLS structure for ${packageName}`);
    console.log(`📁 SLS directory: ${slsDir}`);
    console.log(`🔗 OpenAPI: ${path.join(slsDir, 'openapi.json')}`);
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
