import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';
import { generateText, tool } from 'ai';
import { models } from './ai/models';
import dedent from 'dedent';
import { buildPackage } from './utils/execCommands';

const execAsync = promisify(exec);

// Define the schema for the generate_docs tool
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
        .describe(
          'The BRIEF markdown documentation for the constructor including all parameters, return type, usage examples, code examples, and more',
        ),
    })
    .describe('Documentation for the constructor function or class'),
  functionsDocs: z
    .array(
      z.object({
        name: z
          .string()
          .describe('The name of the function (e.g., "createUser")'),
        docs: z
          .string()
          .describe(
            'The BRIEF markdown documentation for the function including all parameters, return type, usage examples, code examples, and more',
          ),
      }),
    )
    .describe('Documentation for each function in the SDK'),
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
            'Environment variable key name in uppercase format (e.g., "GOOGLE_ACCESS_TOKEN")',
          ),
        displayName: z
          .string()
          .describe(
            'Human-readable name for this API key shown in the UI (e.g., "Google Access Token")',
          ),
        description: z
          .string()
          .describe(
            'Detailed description explaining what this key is for and how to obtain it',
          ),
        required: z.boolean().describe('Whether this key is required'),
      }),
    )
    .optional()
    .describe(
      'List of required API keys needed for authentication with this SDK',
    ),
});

type GenerateDocsData = z.infer<typeof GenerateDocsSchema>;

// Interface for SDK metadata
interface SDKMetadata {
  apiName: string;
  packageName: string;
  title: string;
  description: string;
  authType: string;
  authSdk?: string;
}

/**
 * Generate detailed documentation for an SDK
 */
export async function generateDocs(
  sdkCode: string,
  metadata: SDKMetadata,
  packageDir: string,
  extraInfo: string[] = [],
): Promise<boolean> {
  try {
    // Create tool to generate detailed documentation
    const generateDocsTool = tool({
      description: 'Generate detailed documentation for the SDK',
      parameters: GenerateDocsSchema,
      execute: async (data: GenerateDocsData) => {
        try {
          // Validate the data against the schema
          const validatedData = GenerateDocsSchema.parse(data);
          const constructorName = validatedData.constructorDocs.name;

          console.log(
            '📝 Generated detailed documentation with the following info:',
          );
          console.log(`- Constructor: ${constructorName}`);
          console.log(`- Functions: ${validatedData.functionsDocs.length}`);
          console.log(`- Environment Keys: ${validatedData.envKeys?.length || 0}`);

          // Get package directory
          const docsDir = path.join(packageDir, 'docs');

          // Create docs directory if it doesn't exist
          if (!fs.existsSync(docsDir)) {
            fs.mkdirSync(docsDir, { recursive: true });
          }

          // Save constructor documentation file
          fs.writeFileSync(
            path.join(docsDir, `${constructorName}.md`),
            validatedData.constructorDocs.docs || '',
          );

          // Save function documentation files
          for (const func of validatedData.functionsDocs) {
            fs.writeFileSync(path.join(docsDir, `${func.name}.md`), func.docs || '');
          }

          // Update package-info.json with constructor info
          const packageInfoPath = path.join(packageDir, 'package-info.json');
          const packageInfo = JSON.parse(
            fs.readFileSync(packageInfoPath, 'utf8'),
          );

          // Add readme_map
          packageInfo.readme_map = {
            title: `@microfox/${metadata.packageName} README`,
            description: `The full README for the ${metadata.title}`,
            path: '/README.md',
            constructors: [
              {
                name: constructorName,
                description: `The documentation for the constructor ${constructorName} that initializes this SDK.`,
                path: `/docs/${constructorName}.md`,
              },
            ],
            functionalities: validatedData.functionsDocs.map(f => ({
              name: f.name,
              description: `The documentation for the ${f.name} function.`,
              path: `/docs/${f.name}.md`,
            })),
          };

          // Add constructor info
          packageInfo.constructors = [
            {
              name: constructorName,
              description: `Create a new ${metadata.title} client through which you can interact with the API`,
              auth: packageInfo.authEndpoint ? 'oauth2' : 'apiKey',
              authSdk: packageInfo.authEndpoint
                ? packageInfo.authEndpoint.replace('/connect/', '@microfox/')
                : '',
              outputKeys: [],
              requiredKeys: !packageInfo.authEndpoint
                ? validatedData.envKeys?.map(key => ({
                  key: key.key,
                  displayName: key.displayName,
                  description: key.description,
                })) || []
                : [],
              internalKeys: packageInfo.authEndpoint
                ? validatedData.envKeys?.map(key => ({
                  key: key.key,
                  displayName: key.displayName,
                  description: key.description,
                })) || []
                : [],
              functionalities: validatedData.functionsDocs.map(f => f.name),
            },
          ];

          // Add keysInfo
          packageInfo.keysInfo = validatedData.envKeys?.map(key => ({
            key: key.key,
            constructors: [constructorName],
            description: key.description,
            required: key.required,
          })) || [];

          // Add extraInfo
          packageInfo.extraInfo = extraInfo;

          // Install dependencies if provided
          if (validatedData.dependencies && validatedData.dependencies.length > 0) {
            console.log('📦 Installing dependencies...');
            const depsString = validatedData.dependencies.join(' ');

            try {
              const originalDir = process.cwd();
              process.chdir(packageDir);
              await execAsync(`npm i ${depsString}`);

              // Update package.json with dependencies
              const packageJsonPath = path.join(packageDir, 'package.json');
              const packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, 'utf8'),
              );

              // Add new dependencies to package.json
              for (const dep of validatedData.dependencies) {
                const [name, version] = dep.split('@');
                packageJson.dependencies[name] = version || '^1.0.0';
              }

              // Write updated package.json
              fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2),
              );

              // Return to original directory
              process.chdir(originalDir);

              console.log(`✅ Installed dependencies: ${depsString}`);
            } catch (error) {
              console.error(`❌ Failed to install dependencies: ${error}`);
            }
          }

          // Install dev dependencies if provided
          if (validatedData.devDependencies && validatedData.devDependencies.length > 0) {
            console.log('📦 Installing dev dependencies...');
            const devDepsString = validatedData.devDependencies.join(' ');

            try {
              const originalDir = process.cwd();
              process.chdir(packageDir);
              await execAsync(`npm i --save-dev ${devDepsString}`);

              // Update package.json with dev dependencies
              const packageJsonPath = path.join(packageDir, 'package.json');
              const packageJson = JSON.parse(
                fs.readFileSync(packageJsonPath, 'utf8'),
              );

              // Add new dev dependencies to package.json
              for (const dep of validatedData.devDependencies) {
                const [name, version] = dep.split('@');
                packageJson.devDependencies[name] = version || '^1.0.0';
              }

              // Write updated package.json
              fs.writeFileSync(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2),
              );

              // Return to original directory
              process.chdir(originalDir);

              console.log(`✅ Installed dev dependencies: ${devDepsString}`);
            } catch (error) {
              console.error(`❌ Failed to install dev dependencies: ${error}`);
            }
          }

          // Update package-info.json with dependencies
          if (validatedData.dependencies && validatedData.dependencies.length > 0) {
            packageInfo.dependencies = Array.from(
              new Set(['zod', ...validatedData.dependencies.map(d => d.split('@')[0])]),
            );
          }

          // Write updated package-info.json
          fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2));

          // Generate README.md
          const readmeContent = generateReadme(
            metadata,
            validatedData.constructorDocs,
            validatedData.functionsDocs,
            validatedData.envKeys || [],
            extraInfo,
          );
          fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);

          console.log(`✅ Updated documentation files at ${packageDir}`);

          // Build the package
          await buildPackage(packageDir);

          return {
            success: true,
            packageDir,
            constructorName: constructorName,
          };
        } catch (error) {
          console.error('❌ Error in generate_docs tool execution:', error);
          throw error;
        }
      },
    });

    // Create system prompt for documentation generation
    const docsSystemPrompt = dedent`
      You are a documentation generator for a TypeScript SDK. Your task is to create detailed documentation for the SDK based on the provided code and extra information.
      
      ## Process
      1. First carefully analyze the SDK code and extra information
      2. Identify the constructor and all functions in the SDK
      3. Create detailed documentation for the constructor and each function
      4. Make sure the documentation is comprehensive and easy to understand
      
      ## Core Requirements for the Documentation Generation
      1. The constructorDocs should have a detailed description of the constructor, including the parameters, initialization, usage examples, code examples, and more
      2. The functionsDocs should have a brief documentation for the functions, including the parameters, return type, usage examples, code examples, and more
      3. The documentation should be well written with Markdown format and should be well organized and easy to understand
      4. The documentation should include examples of how to use the SDK
      5. The documentation should explain authentication requirements and how to obtain necessary credentials
      
      ## Tool Usage
      - To generate the documentation, use the generate_docs tool with the following parameters:
        - constructorDocs: The constructor name and documentation
        - functionsDocs: An array of objects with function names and their documentation
        - dependencies: Optional array of dependencies to install
        - devDependencies: Optional array of dev dependencies to install
        - envKeys: Optional array of environment variable keys needed for authentication
      
      - The generate_docs tool will:
        1. Save constructor documentation to docs/constructor_name.md
        2. Save function documentation to docs/function_name.md files
        3. Update package-info.json with constructor info
        4. Install any dependencies you specify
        5. Build the package
    `;

    const docsGenerationPrompt = dedent`
      You are requested to generate detailed documentation for a TypeScript SDK based on the following code and extra information.
      
      ## SDK Code
      \`\`\`typescript
      ${sdkCode}
      \`\`\`
      
      ## Extra Information
      ${extraInfo.join('\n\n')}
      
      ## SDK Information
      - Title: ${metadata.title}
      - Description: ${metadata.description}
      - Auth Type: ${metadata.authType}
      ${metadata.authSdk ? `- Auth SDK: ${metadata.authSdk}` : ''}
      
      ## Documentation Requirements
      - Create BRIEF documentation for the constructor and each function including all parameters, return type, usage examples, code examples, and more
      - Include examples of how to use the SDK in the documentation
      - Explain authentication requirements and how to obtain necessary credentials
      - Use the extra information provided to enhance the documentation
    `;

    // Generate documentation with Claude 3.5 Sonnet
    console.log('\n🧠 Generating detailed documentation...');
    const docsResult = await generateText({
      model: models.googleGeminiPro,
      system: docsSystemPrompt,
      prompt: docsGenerationPrompt,
      maxTokens: 8000,
      tools: {
        generate_docs: generateDocsTool,
      },
      toolChoice: 'required',
      maxSteps: 1,
      onStepFinish: step => {
        console.log('step', step.usage);
      },
    });

    console.log('Usage:', docsResult.usage);

    // Check for tool results
    if (!docsResult.toolResults || docsResult.toolResults.length === 0) {
      console.warn(
        '⚠️ No tool results received, documentation generation may have failed',
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Error generating documentation:', error);
    return false;
  }
}

/**
 * Generate README.md content
 */
function generateReadme(
  metadata: SDKMetadata,
  constructorDocs: { name: string; docs: string },
  functionsDocs: Array<{ name: string; docs: string }>,
  envKeys: Array<{
    key: string;
    displayName: string;
    description: string;
    required: boolean;
  }>,
  extraInfo: string[],
): string {
  const { title, description, packageName } = metadata;

  // Extract constructor name
  const constructorName = constructorDocs.name;

  // Create README content
  let content = `# ${title}\n\n${description}\n\n`;

  // Add installation section
  content += `## Installation\n\n\`\`\`bash\nnpm install ${packageName}\n\`\`\`\n\n`;

  // Add authentication section
  content += `## Authentication\n\n`;

  if (metadata.authType === 'oauth2') {
    content += `This SDK uses OAuth 2.0 for authentication. You need to provide the following credentials:\n\n`;
    content += `- \`accessToken\`: Your OAuth access token\n`;
    content += `- \`refreshToken\`: Your OAuth refresh token\n`;
    content += `- \`clientId\`: Your OAuth client ID\n`;
    content += `- \`clientSecret\`: Your OAuth client secret\n\n`;
    content += `You can obtain these credentials by following the OAuth 2.0 flow for ${metadata.apiName}.\n\n`;
  } else if (metadata.authType === 'apiKey') {
    content += `This SDK uses API key authentication. You need to provide the following credentials:\n\n`;

    for (const key of envKeys) {
      content += `- \`${key.key}\`: ${key.description}\n`;
    }

    content += `\nYou can obtain these credentials from the ${metadata.apiName} developer portal.\n\n`;
  } else {
    content += `This SDK does not require authentication.\n\n`;
  }

  // Add environment variables section
  if (envKeys.length > 0) {
    content += `## Environment Variables\n\n`;
    content += `The following environment variables are used by this SDK:\n\n`;

    for (const key of envKeys) {
      content += `- \`${key.key}\`: ${key.description} ${key.required ? '(Required)' : '(Optional)'}\n`;
    }

    content += `\n`;
  }

  // Add extra information section
  if (extraInfo.length > 0) {
    content += `## Additional Information\n\n`;

    for (const info of extraInfo) {
      content += `${info}\n\n`;
    }
  }

  // Add constructor section
  content += `## Constructor\n\n`;
  content += `## [${constructorName}](./docs/${constructorName}.md)\n\n`;
  content += `${constructorDocs.docs}\n\n`;

  // Add functions section
  content += `## Functions\n\n`;

  for (const func of functionsDocs) {
    content += `## [${func.name}](./docs/${func.name}.md)\n\n`;
    content += `${func.docs}\n\n`;
  }

  return content;
}

if (require.main === module) {
  const packageDir = path.join(__dirname, '../packages/reddit');
  const sdkCode = fs.readFileSync(path.join(packageDir, 'src/redditSdk.ts'), 'utf8');
  const metadata = {
    apiName: 'reddit',
    packageName: 'reddit',
    title: 'Reddit TypeScript SDK',
    description: 'A TypeScript SDK for interacting with the Reddit API',
    authType: 'oauth2',
    authSdk: '@microfox/reddit',
  };
  const extraInfo = [
    'To use this SDK, you need to create a Reddit application at https://www.reddit.com/prefs/apps',
    'The Reddit API has rate limits that you should be aware of when using this SDK',
  ];

  generateDocs(sdkCode, metadata, packageDir, extraInfo);
}
