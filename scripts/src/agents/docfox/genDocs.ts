import { CoreTool, generateObject, generateText, tool } from 'ai';
import { exec } from 'child_process';
import dedent from 'dedent';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { z } from 'zod';
import { models } from '../../ai/models';
import { logUsage } from '../../ai/usage/usageLogger';
import { updateDocReport } from '../../octokit/commentReports';
import { inMemoryStore } from '../../utils/InMemoryStore';
import { getProjectRoot } from '../../utils/getProjectRoot';

const execAsync = promisify(exec);

// --- Tool Schemas ---

const SaveConstructorDocsSchema = z.object({
  name: z
    .string()
    .describe(
      'The name of the constructor function or class that initializes the SDK',
    ),
  description: z
    .string()
    .describe(
      "A comprehensive description of the constructor's purpose, functionality, and behavior",
    ),
  docs: z
    .string()
    .describe(
      'Complete markdown documentation for the constructor including all parameters, return types, and examples',
    ),
});
type ConstructorDocsData = z.infer<typeof SaveConstructorDocsSchema>;

const SaveFunctionDocsSchema = z.object({
  name: z.string().describe('The name of the function being documented'),
  description: z
    .string()
    .describe(
      'A detailed description of what the function does and how it works',
    ),
  docs: z
    .string()
    .describe(
      'Complete markdown documentation for the function including all parameters, return types, and examples',
    ),
});
type FunctionDocsData = z.infer<typeof SaveFunctionDocsSchema>;

const SaveEnvKeysSchema = z.object({
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
    .default([])
    .describe(
      'List of required API keys needed for authentication with this SDK',
    ),
});
type EnvKeysData = z.infer<typeof SaveEnvKeysSchema>;

const SaveDependenciesSchema = z.object({
  dependencies: z
    .array(z.string())
    .optional()
    .default([])
    .describe(
      "List of dependencies to install. Only include dependencies that are actually needed beyond what's already installed",
    ),
  devDependencies: z
    .array(z.string())
    .optional()
    .default([])
    .describe(
      "List of dev dependencies to install. Only include dev dependencies that are actually needed beyond what's already installed",
    ),
});
type DependenciesData = z.infer<typeof SaveDependenciesSchema>;

// Define the schema for the overall expected output AFTER assembly
const FinalDocsSchema = z.object({
  constructorDocs: SaveConstructorDocsSchema,
  functionsDocs: z.array(SaveFunctionDocsSchema),
  envKeys: SaveEnvKeysSchema.shape.envKeys,
  dependencies: SaveDependenciesSchema.shape.dependencies,
  devDependencies: SaveDependenciesSchema.shape.devDependencies,
});
type FinalDocsData = z.infer<typeof FinalDocsSchema>;

// Interface for SDK metadata
interface SDKMetadata {
  apiName: string;
  packageName: string;
  title: string;
  description: string;
  authType: string;
  authSdk?: string;
}

// Helper type for storing function docs
type StoredFunctionDocs = { [functionName: string]: FunctionDocsData };

// Helper type for environment keys
type EnvKeyType = {
  key: string;
  displayName: string;
  description: string;
  required: boolean;
};

/**
 * Helper function to read function documentation from filesystem
 */
function readFunctionDocsFromFilesystem(
  packageDir: string,
): StoredFunctionDocs {
  const docsDir = path.join(packageDir, 'docs');
  const functionsMap: StoredFunctionDocs = {};

  if (!fs.existsSync(docsDir)) {
    console.log(`📁 Docs directory does not exist: ${docsDir}`);
    return functionsMap;
  }

  const existingDocFiles = fs
    .readdirSync(docsDir)
    .filter(file => file.endsWith('.md'));

  console.log(
    `📄 Reading ${existingDocFiles.length} existing documentation files from filesystem`,
  );

  for (const file of existingDocFiles) {
    const fileName = file.replace('.md', '');
    const filePath = path.join(docsDir, file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Skip constructor docs (look for constructor-specific patterns)
      if (
        content.includes('## Constructor:') ||
        content.includes('Create a new') ||
        content.includes('Initializes')
      ) {
        console.log(`📋 Skipping constructor documentation: ${fileName}`);
        continue;
      }

      // Extract function name and description from the markdown content
      const functionNameMatch = content.match(/## Function: `([^`]+)`/);
      const functionName = functionNameMatch ? functionNameMatch[1] : fileName;

      // Extract description (first paragraph after the function header)
      const descriptionMatch = content.match(
        /## Function: `[^`]+`\s*\n\n([^\n]+)/,
      );
      const description = descriptionMatch
        ? descriptionMatch[1]
        : `Documentation for ${functionName}`;

      functionsMap[functionName] = {
        name: functionName,
        description: description,
        docs: content,
      };

      console.log(
        `🔧 Read function documentation from filesystem: ${functionName}`,
      );
    } catch (error) {
      console.warn(`⚠️ Could not read existing doc file ${file}:`, error);
    }
  }

  return functionsMap;
}

/**
 * Helper function to read constructor documentation from filesystem
 */
function readConstructorDocsFromFilesystem(
  packageDir: string,
): ConstructorDocsData | null {
  const docsDir = path.join(packageDir, 'docs');

  if (!fs.existsSync(docsDir)) {
    console.log(`📁 Docs directory does not exist: ${docsDir}`);
    return null;
  }

  const existingDocFiles = fs
    .readdirSync(docsDir)
    .filter(file => file.endsWith('.md'));

  console.log(
    `📄 Looking for constructor documentation in ${existingDocFiles.length} files`,
  );

  for (const file of existingDocFiles) {
    const fileName = file.replace('.md', '');
    const filePath = path.join(docsDir, file);

    try {
      const content = fs.readFileSync(filePath, 'utf8');

      // Check if this is a constructor doc (look for constructor-specific patterns)
      if (content.includes('## Constructor:')) {
        console.log(`📋 Found constructor documentation: ${fileName}`);

        // Extract constructor name and description from the markdown content
        const constructorNameMatch =
          content.match(/## Constructor: `([^`]+)`/) ||
          content.match(/# ([^\n]+)/);
        const constructorName = constructorNameMatch
          ? constructorNameMatch[1]
          : fileName;

        // Extract description (first paragraph after the constructor header)
        const descriptionMatch =
          content.match(/## Constructor: `[^`]+`\s*\n\n([^\n]+)/) ||
          content.match(/# [^\n]+\s*\n\n([^\n]+)/);
        const description = descriptionMatch
          ? descriptionMatch[1]
          : `Constructor for ${constructorName}`;

        return {
          name: constructorName,
          description: description,
          docs: content,
        };
      }
    } catch (error) {
      console.warn(`⚠️ Could not read existing doc file ${file}:`, error);
    }
  }

  console.log(`📋 No constructor documentation found in filesystem`);
  return null;
}

/**
 * Phase 1: Generate environment keys and dependencies only
 */
async function generatePhase1(
  code: string,
  metadata: SDKMetadata,
  extraInfo: string[],
  envKeysStoreKey: string,
  dependenciesStoreKey: string,
): Promise<boolean> {
  const phase1SystemPrompt = dedent`
    You are a professional documentation generator for TypeScript SDKs. Your task is to analyze the provided SDK code and generate ONLY environment keys and dependencies by calling the available tools.

    ## IMPORTANT: You MUST call exactly 3 tools in this order:
    1. Call \`saveEnvKeys\` tool with environment variables (or empty array if none needed)
    2. Call \`saveDependencies\` tool with dependencies (or empty arrays if none needed)  
    3. Call \`finalizeDocs\` tool to complete Phase 1

    ## Process
    1. Carefully analyze the SDK code, schemas, types, and extra information provided in the user prompt.
    2. Identify any necessary environment variables based on the code and auth type. Call the \`saveEnvKeys\` tool. If none, call it with an empty array.
    3. Identify any necessary external dependencies or devDependencies needed beyond standard Node/TS. Call the \`saveDependencies\` tool. If none, call it with empty arrays.
    4. DO NOT generate constructor or function documentation in this phase.
    5. ALWAYS call the \`finalizeDocs\` tool to signal completion of this phase - this is REQUIRED.

    ## Environment Variables Requirements
    - All required API keys and tokens
    - For OAuth2 authentication:
      * Include the constructor configs like accessToken, refreshToken, clientId, clientSecret, etc. in the environment variables
      * If the constructor config includes scopes, ALWAYS include a SCOPES environment variable
      * The name of the environment variable should be based on the oauth provider name not the package name.
      * package name should only be used for scoped tokens likes access token, refresh token, scopes, etc..
      * for constructors, use provider names as prefix like for clientId, clientSecret, etc.
      *  For example, for google-oauth, the environment variable should be 
      *   ${metadata.packageName
        ?.replace('@microfox/', '')
        ?.replace(/[-#\/]/g, '_')
        .toUpperCase()}_ACCESS_TOKEN, 
      *   ${metadata.packageName
        ?.replace('@microfox/', '')
        ?.replace(/[-#\/]/g, '_')
        .toUpperCase()}_REFRESH_TOKEN, 
      *   ${metadata.packageName
        ?.replace('@microfox/', '')
        ?.replace(/[-#\/]/g, '_')
        .toUpperCase()}_CLIENT_ID, 
      *   ${metadata.packageName
        ?.replace('@microfox/', '')
        ?.replace(/[-#\/]/g, '_')
        .toUpperCase()}_CLIENT_SECRET, 
      *   ${metadata.packageName
        ?.replace('@microfox/', '')
        ?.replace(/[-#\/]/g, '_')
        .toUpperCase()}_SCOPES etc.
    - For each environment variable:
      * Clear display name
      * Detailed description
      * Required/optional status
      * Format and validation requirements
  `;

  const phase1Prompt = dedent`
    Analyze the TypeScript SDK below and generate ONLY environment keys and dependencies by calling the provided tools (\`saveEnvKeys\`, \`saveDependencies\`, \`finalizeDocs\`).

    IMPORTANT: You must call all 3 tools:
    1. saveEnvKeys (with environment variables or empty array)
    2. saveDependencies (with dependencies or empty arrays)
    3. finalizeDocs (to complete this phase)

    ## Package Name
    ${metadata.packageName}

    ## Package Code
    \`\`\`typescript
    ${code}
    \`\`\`

    ## Extra Information
    ${extraInfo.join('\n\n')}

    ## SDK Information
    - Title: ${metadata.title}
    - Description: ${metadata.description}
    - Auth Type: ${metadata.authType}
    ${metadata.authSdk ? `- Auth SDK: ${metadata.authSdk}` : ''}

    Generate ONLY environment keys and dependencies. Do NOT generate constructor or function documentation.
    Remember to call finalizeDocs at the end to complete Phase 1.
  `;

  let phase1Complete = false;

  const phase1Tools: Record<string, CoreTool<any, any>> = {
    saveEnvKeys: tool({
      description:
        'STEP 1: Saves the list of environment variables required by the SDK. Call this first with environment variables or empty array if none needed.',
      parameters: SaveEnvKeysSchema,
      execute: async (data: EnvKeysData) => {
        console.log(
          `💾 Phase 1 Step 1: Saving env keys: ${data.envKeys?.length || 0} keys`,
        );
        const keysToSave = data.envKeys ?? [];
        inMemoryStore.setItem(envKeysStoreKey, keysToSave);
        return `Environment keys saved (${keysToSave.length} keys). Now call saveDependencies.`;
      },
    }),
    saveDependencies: tool({
      description:
        'STEP 2: Saves the list of external dependencies and devDependencies required by the SDK. Call this second with dependencies or empty arrays if none needed.',
      parameters: SaveDependenciesSchema,
      execute: async (data: DependenciesData) => {
        console.log(
          `💾 Phase 1 Step 2: Saving dependencies: ${data.dependencies?.length || 0} deps, ${data.devDependencies?.length || 0} devDeps`,
        );
        const depsToSave = {
          dependencies: data.dependencies ?? [],
          devDependencies: data.devDependencies ?? [],
        };
        inMemoryStore.setItem(dependenciesStoreKey, depsToSave);
        return `Dependencies saved (${depsToSave.dependencies.length} deps, ${depsToSave.devDependencies.length} devDeps). Now call finalizeDocs to complete Phase 1.`;
      },
    }),
    finalizeDocs: tool({
      description:
        'STEP 3: REQUIRED - Signals that environment keys and dependencies have been generated and saved. Call this last to complete Phase 1.',
      parameters: z.object({}),
      execute: async () => {
        console.log(
          '🏁 Phase 1 Step 3: Complete - Environment keys and dependencies saved.',
        );
        phase1Complete = true;
        return 'Phase 1 documentation generation process finalized successfully.';
      },
    }),
  };

  try {
    console.log(
      '🔑 Starting Phase 1: Environment keys and dependencies generation...',
    );

    const result = await generateText({
      model: models.googleGemini25Pro,
      system: phase1SystemPrompt,
      prompt: phase1Prompt,
      tools: phase1Tools,
      toolChoice: 'auto',
      maxRetries: 3,
      maxSteps: 3, // Only need 3 steps: saveEnvKeys, saveDependencies, finalizeDocs
    });

    if (result.usage) {
      logUsage(models.googleGemini25Pro.modelId, result.usage);
      console.log('Phase 1 Usage:', result.usage);
    }

    console.log(
      `🔍 Phase 1 completed with ${result.toolCalls?.length || 0} tool calls`,
    );
    console.log(`🔍 Phase 1 finalizeDocs called: ${phase1Complete}`);

    if (!phase1Complete) {
      console.warn(
        '⚠️ Phase 1 did not call finalizeDocs tool. This may indicate an issue.',
      );
      // Check if we at least got the required data
      const envKeysData = inMemoryStore.getItem(envKeysStoreKey);
      const dependenciesData = inMemoryStore.getItem(dependenciesStoreKey);

      if (envKeysData !== null && dependenciesData !== null) {
        console.log(
          '✅ Phase 1 data was saved despite finalizeDocs not being called. Proceeding...',
        );
        return true; // Allow proceeding if data was saved
      }
    }

    return phase1Complete;
  } catch (error) {
    console.error('Error during Phase 1 generation:', error);
    return false;
  }
}

/**
 * Phase 2: Generate constructor and function documentation recursively
 */
async function generatePhase2Recursive(
  code: string,
  metadata: SDKMetadata,
  extraInfo: string[],
  constructorStoreKey: string,
  functionsStoreKey: string,
  packageDir: string,
  attempt: number = 1,
  maxAttempts: number = 3,
): Promise<boolean> {
  console.log(`📚 Phase 2 attempt ${attempt}/${maxAttempts}`);

  // Check what's already been generated
  const existingConstructor =
    inMemoryStore.getItem<ConstructorDocsData>(constructorStoreKey);
  const existingFunctions =
    inMemoryStore.getItem<StoredFunctionDocs>(functionsStoreKey) || {};
  const existingFunctionNames = Object.keys(existingFunctions);

  const storeKeyBase = `docs:${metadata.packageName}`;
  const envKeysStoreKey = `${storeKeyBase}:envKeys`;
  const envKeysData =
    inMemoryStore.getItem<EnvKeysData['envKeys']>(envKeysStoreKey) || [];

  // Ensure docs directory exists
  const docsDir = path.join(packageDir, 'docs');
  if (!fs.existsSync(docsDir)) {
    console.log(`📁 Creating docs directory: ${docsDir}`);
    fs.mkdirSync(docsDir, { recursive: true });
  } else {
    console.log(`📁 Docs directory already exists: ${docsDir}`);
  }

  // On first attempt, populate existing functions from filesystem since inMemoryStore was cleaned
  let existingFunctionNamesFromFs: string[] = [];
  let existingConstructorFromFs: string | null = null;

  if (attempt === 1 && fs.existsSync(docsDir)) {
    const existingDocFiles = fs
      .readdirSync(docsDir)
      .filter(file => file.endsWith('.md'));
    console.log(
      `📄 Found ${existingDocFiles.length} existing documentation files in docs directory`,
    );

    for (const file of existingDocFiles) {
      const fileName = file.replace('.md', '');
      const filePath = path.join(docsDir, file);

      try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check if this is a constructor doc (look for constructor-specific patterns)
        if (
          content.includes('## Constructor:') ||
          content.includes('Create a new') ||
          content.includes('Initializes')
        ) {
          existingConstructorFromFs = fileName;
          console.log(
            `📋 Found existing constructor documentation: ${fileName}`,
          );
        } else {
          // Assume it's a function doc
          existingFunctionNamesFromFs.push(fileName);
          console.log(`🔧 Found existing function documentation: ${fileName}`);
        }
      } catch (error) {
        console.warn(`⚠️ Could not read existing doc file ${file}:`, error);
      }
    }
  }

  let contextInfo = '';

  // Combine existing documentation from both in-memory store and filesystem
  const hasExistingConstructor =
    existingConstructor || existingConstructorFromFs;
  const allExistingFunctionNames = [
    ...existingFunctionNames,
    ...existingFunctionNamesFromFs,
  ];
  const uniqueExistingFunctionNames = [...new Set(allExistingFunctionNames)];

  if (hasExistingConstructor || uniqueExistingFunctionNames.length > 0) {
    contextInfo = '\n## Already Generated Documentation\n';

    if (hasExistingConstructor) {
      const constructorName =
        existingConstructor?.name || existingConstructorFromFs;
      contextInfo += `- Constructor "${constructorName}" has already been documented. DO NOT regenerate it.\n`;
    }

    if (uniqueExistingFunctionNames.length > 0) {
      contextInfo += `- Functions already documented: ${uniqueExistingFunctionNames.join(', ')}. DO NOT regenerate these functions.\n`;
    }

    contextInfo +=
      'Focus ONLY on generating documentation for components that have NOT been documented yet.\n';
  }

  const phase2SystemPrompt = dedent`
    You are a professional documentation generator for TypeScript SDKs. Your task is to analyze the provided SDK code and generate comprehensive documentation for the constructor and functions by calling the available tools.

    ## Process
    1. Carefully analyze the SDK code, schemas, types, and extra information provided in the user prompt.
    2. Check the context information to see what has already been documented.
    3. If the constructor has NOT been documented yet, identify the main constructor/class and call the \`saveConstructorDocs\` tool.
    4. Identify ALL functions available in the SDK (exported or methods on the main class).
    5. For EACH function that has NOT been documented yet, call the \`saveFunctionDocs\` tool with its detailed documentation.
    6. DO NOT regenerate documentation for components that have already been documented.
    7. Once ALL remaining documentation components have been saved using the tools, call the \`finalizeDocs\` tool to signal completion.

    ## Documentation Format
    Each function documentation should follow this structure:

    \`\`\`markdown
    ## Function: \`functionName\`

    [Clear, detailed description of what the function does and its purpose]

    **Purpose:**
    [Explain the main purpose and use cases of the function]

    **Parameters:**
    [Describe each parameter in detail, including:
    - Parameter name and type (for arrays, specify element type like array<string>, array<number>, array<object>, etc.)
    - Whether it's required or optional
    - Detailed description of what the parameter represents
    - Any constraints or valid values
    - Default values if applicable
    - For each parameter type that is an object, array, or named type, provide a detailed description of its structure and purpose]

    **Return Value:**
    [Describe what the function returns, including:
    - Return type (for arrays, specify element type like array<string>, array<number>, array<object>, etc.)
    - Description of the returned value
    - Any special cases or conditions
    - Error cases if applicable
    - For return types that are objects, arrays, or named types, provide a detailed description of their structure]

    **Examples:**
    [Provide examples that demonstrate all possible functionality of the function. Include examples for:
    - Minimal usage with only required arguments
    - Full usage with all optional arguments
    - Different input types and formats
    - Edge cases and special conditions
    - Error handling scenarios
    - Return value variations]

    \`\`\`typescript
    // Example 1: Minimal usage with only required arguments
    const result1 = functionName({
      // Required string parameter - should be a valid identifier
      param1: '<identifier>',
      // Required array<string> parameter - list of valid identifiers
      param2: ['<identifier1>', '<identifier2>']
    });

    // Example 2: Full usage with all optional arguments
    const result2 = functionName({
      // Required string parameter - should be a valid identifier
      param1: '<identifier>',
      // Required array<string> parameter - list of valid identifiers
      param2: ['<identifier1>', '<identifier2>'],
      // Optional number parameter - controls behavior (default: 0)
      optionalParam1: 42,
      // Optional array<object> parameter - additional configuration
      optionalParam2: [
        { id: '<id1>', value: 1 },
        { id: '<id2>', value: 2 }
      ],
      // Optional boolean parameter - enables feature (default: false)
      optionalParam3: true
    });
    \`\`\`
    \`\`\`

    Generate documentation that is comprehensive, detailed, well-structured, technically accurate, and follows TypeScript best practices.
  `;

  const phase2Prompt = dedent`
    Generate comprehensive documentation for the TypeScript SDK below by calling the provided tools (\`saveConstructorDocs\`, \`saveFunctionDocs\`, \`finalizeDocs\`). Call the appropriate save tool for any undocumented constructor and functions, then call finalize.

    ## Package Name
    ${metadata.packageName}

    ## Package Code
    \`\`\`typescript
    ${code}
    \`\`\`

    ## Extra Information
    ${extraInfo.join('\n\n')}

    ## Environment Keys
    ${envKeysData.map(key => `- ${key.key}: ${key.description}`).join('\n')}
    Make sure you use the above keys in the constructors as necessary.

    ## SDK Information
    - Title: ${metadata.title}
    - Description: ${metadata.description}
    - Auth Type: ${metadata.authType}
    ${metadata.authSdk ? `- Auth SDK: ${metadata.authSdk}` : ''}
    ${contextInfo}

    Generate documentation for constructor and functions that have NOT been documented yet.
  `;

  let phase2Complete = false;

  const phase2Tools: Record<string, CoreTool<any, any>> = {
    saveConstructorDocs: tool({
      description:
        'Saves the generated documentation for the SDK constructor or main class.',
      parameters: SaveConstructorDocsSchema,
      execute: async (data: ConstructorDocsData) => {
        console.log(`💾 Saving constructor docs: ${data.name}`);
        inMemoryStore.setItem(constructorStoreKey, data);
        // Get package directory
        const docsDir = path.join(packageDir, 'docs');
        // Create docs directory if it doesn't exist
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }
        const safeFuncName = data.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        if (safeFuncName !== data.name) {
          console.warn(
            `⚠️ Sanitized function name "${data.name}" to "${safeFuncName}" for filename.`,
          );
        }
        if (!safeFuncName) {
          console.error(
            `❌ Invalid function name found: "${data.name}". Skipping file write.`,
          );
        }
        fs.writeFileSync(path.join(docsDir, `${safeFuncName}.md`), data.docs);
        return `Constructor documentation for ${data.name} saved.`;
      },
    }),
    saveFunctionDocs: tool({
      description:
        'Saves the generated documentation for a single SDK function.',
      parameters: SaveFunctionDocsSchema,
      execute: async (data: FunctionDocsData) => {
        console.log(`💾 Saving function docs: ${data.name}`);
        const existingFunctions =
          inMemoryStore.getItem<StoredFunctionDocs>(functionsStoreKey) || {};
        existingFunctions[data.name] = data;
        inMemoryStore.setItem(functionsStoreKey, existingFunctions);
        // Get package directory
        const docsDir = path.join(packageDir, 'docs');

        // Create docs directory if it doesn't exist
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }
        const safeFuncName = data.name.replace(/[^a-zA-Z0-9_-]/g, '_');
        if (safeFuncName !== data.name) {
          console.warn(
            `⚠️ Sanitized function name "${data.name}" to "${safeFuncName}" for filename.`,
          );
        }
        if (!safeFuncName) {
          console.error(
            `❌ Invalid function name found: "${data.name}". Skipping file write.`,
          );
        }
        fs.writeFileSync(path.join(docsDir, `${safeFuncName}.md`), data.docs);
        return `Function documentation for ${data.name} saved.`;
      },
    }),
    finalizeDocs: tool({
      description:
        'Signals that all remaining documentation components have been generated and saved.',
      parameters: z.object({}),
      execute: async () => {
        console.log(
          '🏁 Phase 2 complete: Constructor and function documentation saved.',
        );
        phase2Complete = true;
        return 'Phase 2 documentation generation process finalized.';
      },
    }),
  };

  try {
    const result = await generateText({
      model: models.googleGemini25Pro,
      system: phase2SystemPrompt,
      prompt: phase2Prompt,
      tools: phase2Tools,
      toolChoice: 'auto',
      maxRetries: 5,
      maxSteps: 10,
    });

    if (result.usage) {
      logUsage(models.googleGemini25Pro.modelId, result.usage);
      console.log(`Phase 2 Attempt ${attempt} Usage:`, result.usage);
    }

    console.log(`🔍 Phase 2 result: ${result}`);
    // If finalizeDocs wasn't called and we haven't reached max attempts, try again
    if (!phase2Complete && attempt < maxAttempts) {
      console.log(`⚠️ Phase 2 attempt ${attempt} incomplete, retrying...`);
      return generatePhase2Recursive(
        code,
        metadata,
        extraInfo,
        constructorStoreKey,
        functionsStoreKey,
        packageDir,
        attempt + 1,
        maxAttempts,
      );
    }

    return phase2Complete;
  } catch (error) {
    console.error(`Error during Phase 2 attempt ${attempt}:`, error);

    // If we haven't reached max attempts, try again
    if (attempt < maxAttempts) {
      console.log(`⚠️ Phase 2 attempt ${attempt} failed, retrying...`);
      return generatePhase2Recursive(
        code,
        metadata,
        extraInfo,
        constructorStoreKey,
        functionsStoreKey,
        packageDir,
        attempt + 1,
        maxAttempts,
      );
    }

    return false;
  }
}

/**
 * Generate detailed documentation for an SDK using tool calls
 */
export async function generateDocs(
  code: string,
  metadata: SDKMetadata,
  packageDir: string,
  extraInfo: string[] = [],
  skipPhase2: boolean = false,
): Promise<boolean> {
  const storeKeyBase = `docs:${metadata.packageName}`;
  const constructorStoreKey = `${storeKeyBase}:constructor`;
  const functionsStoreKey = `${storeKeyBase}:functions`;
  const envKeysStoreKey = `${storeKeyBase}:envKeys`;
  const dependenciesStoreKey = `${storeKeyBase}:dependencies`;

  // --- Clear previous data for this package ---
  console.log(
    `🧹 Clearing previous documentation data for ${metadata.packageName}...`,
  );
  if (skipPhase2) {
    console.log(
      `⏭️ skipPhase2 enabled - will use existing documentation from filesystem`,
    );
  }
  inMemoryStore.removeItem(constructorStoreKey);
  inMemoryStore.removeItem(functionsStoreKey);
  inMemoryStore.removeItem(envKeysStoreKey);
  inMemoryStore.removeItem(dependenciesStoreKey);

  try {
    // Update documentation report - start generation
    await updateDocReport(
      'generate',
      {
        status: 'in-progress',
        details: {
          package: metadata.packageName,
          title: metadata.title,
        },
      },
      packageDir,
    );

    // Phase 1: Generate environment keys and dependencies
    console.log(
      '\n🔑 Phase 1: Generating environment keys and dependencies...',
    );
    const phase1Success = await generatePhase1(
      code,
      metadata,
      extraInfo,
      envKeysStoreKey,
      dependenciesStoreKey,
    );

    if (!phase1Success) {
      throw new Error('Phase 1 (env keys & dependencies) generation failed');
    }

    // Phase 2: Generate constructor and function documentation recursively
    let phase2Success = true;
    if (skipPhase2) {
      console.log(
        '\n⏭️ Phase 2: Skipping constructor and function documentation generation (skipPhase2=true)...',
      );
      console.log(
        '📄 Will use existing documentation from filesystem if available',
      );
    } else {
      console.log(
        '\n📚 Phase 2: Generating constructor and function documentation...',
      );
      phase2Success = await generatePhase2Recursive(
        code,
        metadata,
        extraInfo,
        constructorStoreKey,
        functionsStoreKey,
        packageDir,
      );

      console.log(`🔍 Phase 2 completed, phase2Success: ${phase2Success}`);

      if (!phase2Success) {
        throw new Error('Phase 2 (constructor & functions) generation failed');
      }
    }

    // Update documentation report - generation complete
    await updateDocReport(
      'generate',
      {
        status: 'success',
        details: {
          'Phase 1': 'Environment keys and dependencies generated',
          'Phase 2': skipPhase2
            ? 'Skipped (using existing docs)'
            : 'Constructor and function documentation generated',
        },
      },
      packageDir,
    );

    // Continue with existing assembly logic...
    console.log('🧩 Assembling documentation from storage...');
    const constructorDataFromMemory =
      inMemoryStore.getItem<ConstructorDocsData>(constructorStoreKey);

    // Read constructor documentation from filesystem if not in memory
    const constructorDataFromFs =
      skipPhase2 || !constructorDataFromMemory
        ? readConstructorDocsFromFilesystem(packageDir)
        : null;

    // Use constructor data from memory first, then filesystem
    const constructorData = constructorDataFromMemory || constructorDataFromFs;

    const functionsMapFromMemory =
      inMemoryStore.getItem<StoredFunctionDocs>(functionsStoreKey) || {};

    // Read function documentation from filesystem as well
    const functionsMapFromFs = readFunctionDocsFromFilesystem(packageDir);

    // Combine function docs from both sources, prioritizing in-memory store
    const functionsMap: StoredFunctionDocs = {
      ...functionsMapFromFs,
      ...functionsMapFromMemory,
    };

    console.log(`📊 Documentation assembly summary:`);
    console.log(
      `  - Constructor from memory: ${constructorDataFromMemory ? 'Yes' : 'No'}`,
    );
    console.log(
      `  - Constructor from filesystem: ${constructorDataFromFs ? 'Yes' : 'No'}`,
    );
    console.log(`  - Constructor available: ${constructorData ? 'Yes' : 'No'}`);
    console.log(
      `  - Functions from memory: ${Object.keys(functionsMapFromMemory).length} functions`,
    );
    console.log(
      `  - Functions from filesystem: ${Object.keys(functionsMapFromFs).length} functions`,
    );
    console.log(
      `  - Total combined functions: ${Object.keys(functionsMap).length} functions`,
    );

    const envKeysData =
      inMemoryStore.getItem<EnvKeysData['envKeys']>(envKeysStoreKey) || [];
    const dependenciesData = inMemoryStore.getItem<DependenciesData>(
      dependenciesStoreKey,
    ) || { dependencies: [], devDependencies: [] };

    // --- Basic Validation ---
    if (!constructorData) {
      const errorMsg = skipPhase2
        ? 'No constructor documentation found in filesystem. When skipPhase2=true, constructor docs must exist in the docs directory.'
        : 'Failed to retrieve constructor documentation from store.';
      throw new Error(errorMsg);
    }
    if (Object.keys(functionsMap).length === 0) {
      console.warn(
        skipPhase2
          ? '⚠️ No function documentation found in memory or filesystem. This might be expected if the SDK has no functions, or you may need to generate docs first without skipPhase2.'
          : '⚠️ No function documentation was saved. This might be expected if the SDK has no functions, or it might indicate an issue.',
      );
    }

    // Assemble into the final structure
    const assembledData: FinalDocsData = {
      constructorDocs: constructorData,
      functionsDocs: Object.values(functionsMap),
      envKeys: envKeysData,
      dependencies: dependenciesData.dependencies,
      devDependencies: dependenciesData.devDependencies,
    };

    // --- Proceed with existing logic using assembledData ---
    try {
      // Update documentation report - validation step (using assembled data)
      await updateDocReport(
        'validate',
        {
          status: 'success',
          details: {
            'Constructor Docs': assembledData.constructorDocs.docs.length,
            'Functions Docs': assembledData.functionsDocs.length,
            'Env Keys': assembledData.envKeys?.length || 0,
          },
        },
        packageDir,
      );

      const validatedData = assembledData;
      const constructorName = validatedData.constructorDocs.name;

      console.log(
        '📝 Assembled documentation successfully with the following info:',
      );
      console.log(`- Constructor: ${constructorName}`);
      console.log(`- Functions: ${validatedData.functionsDocs.length}`);
      console.log(`- Environment Keys: ${validatedData.envKeys?.length || 0}`);

      // Update documentation report - save step
      await updateDocReport(
        'save',
        {
          status: 'success',
          details: {
            constructor: constructorName,
            functions: validatedData.functionsDocs.length,
            envKeys: validatedData.envKeys?.length || 0,
          },
        },
        packageDir,
      );

      // Update package-info.json with constructor info
      const packageInfoPath = path.join(packageDir, 'package-info.json');
      const packageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));

      console.log('searching for the logo');
      const logoDir = path.join(__dirname, '../../logos');
      let listItemsInDirectory: string[] = [];
      if (fs.existsSync(logoDir)) {
        listItemsInDirectory = fs.readdirSync(logoDir);
      } else {
        console.warn(`Logo directory not found: ${logoDir}`);
      }

      if (listItemsInDirectory.length > 0) {
        try {
          const { object: logo } = await generateObject({
            model: models.googleGeminiPro,
            system: `You are a helpful assistant that searches the correct logo file slug (without extension) for the package based on its title and description. Pick the most relevant logo slug from the provided list. If no relevant logo is found, do not return a logo slug.`,
            prompt: `Available logo file slugs (without extensions like .svg): ${listItemsInDirectory.map(f => f.replace('.svg', '')).join(', ')}. Pick the most appropriate logo slug for the package titled "${packageInfo.title}" with description: "${packageInfo.description}".`,
            schema: z.object({
              logo: z
                .string()
                .describe(
                  'Picked slug of the logo (e.g., "google-sheets", "slack")',
                )
                .optional(),
            }),
          });
          console.log('logo picked:', logo);
          if (logo.logo) {
            const logoFileName = listItemsInDirectory.find(f =>
              f.startsWith(logo.logo + '.'),
            );
            if (logoFileName) {
              packageInfo.icon = `https://raw.githubusercontent.com/microfox-ai/microfox/refs/heads/main/logos/${logoFileName}`;
              console.log(`Icon set to: ${packageInfo.icon}`);
            } else {
              console.warn(
                `Selected logo slug "${logo.logo}" does not correspond to a file in the logos directory.`,
              );
            }
          }
        } catch (logoError) {
          console.error('Error generating logo suggestion:', logoError);
        }
      } else {
        console.log('No logos found in directory to select from.');
      }

      console.log('Setting a better description for the package');
      try {
        const { object: description } = await generateObject({
          model: models.googleGeminiPro,
          system: `You are a helpful assistant that refines package descriptions. Generate a concise and informative description (max 1-2 sentences) for the package based on its title and functionalities.`,
          prompt: `Package Title: "${packageInfo.title}". Current Description: "${packageInfo.description}". Supported Functionalities: ${validatedData.functionsDocs.map(f => f.name).join(', ')}. Generate an improved, concise description.`,
          schema: z.string().describe('The improved package description.'),
        });
        if (description && description.trim().length > 0) {
          packageInfo.description = description.trim();
          console.log('New description:', packageInfo.description);
        } else {
          console.warn('Generated description was empty, keeping original.');
        }
      } catch (descError) {
        console.error('Error generating better description:', descError);
      }

      // Add constructor info
      packageInfo.constructors = [
        {
          name: constructorName,
          description: `Create a new ${metadata.title} client through which you can interact with the API`,
          auth: metadata.authType,
          ...(metadata.authType === 'apikey' && {
            apiType: 'api_key',
          }),
          ...(metadata.authType === 'oauth2' && {
            authSdk: metadata.authSdk,
          }),
          ...(metadata.authType === 'oauth2' &&
            packageInfo.authEndpoint && {
              authEndpoint: packageInfo.authEndpoint,
            }),
          requiredKeys: !packageInfo.authEndpoint
            ? validatedData.envKeys.map(key => ({
                key: key.key,
                displayName: key.displayName,
                description: key.description,
                required: key.required,
                ...(key.key.includes('SCOPES') &&
                  packageInfo.oauth2Scopes && {
                    defaultValue: packageInfo.oauth2Scopes,
                  }),
              }))
            : [],
          internalKeys: packageInfo.authEndpoint
            ? validatedData.envKeys.map(key => ({
                key: key.key,
                displayName: key.displayName,
                description: key.description,
                required: key.required,
                ...(key.key.includes('SCOPES') &&
                  packageInfo.oauth2Scopes && {
                    defaultValue: packageInfo.oauth2Scopes,
                  }),
              }))
            : [],
          functionalities: validatedData.functionsDocs.map(f => f.name),
        },
      ];

      // Add extraInfo
      packageInfo.extraInfo = extraInfo;

      // Install dependencies if provided
      const depsString = validatedData.dependencies?.join(' ') || '';
      const devDepsString = validatedData.devDependencies?.join(' ') || '';

      try {
        const originalDir = process.cwd();
        if (!fs.existsSync(packageDir)) {
          throw new Error(`Package directory does not exist: ${packageDir}`);
        }
        process.chdir(packageDir);
        if (depsString) {
          console.log('📦 Installing dependencies...', depsString);
          await execAsync(`npm i ${depsString} --save --save-exact`);
          console.log(`✅ Installed dependencies: ${depsString}`);
        }
        if (devDepsString) {
          console.log('📦 Installing dev dependencies...', devDepsString);
          await execAsync(`npm i ${devDepsString} --save-dev --save-exact`);
          console.log(`✅ Installed dev dependencies: ${devDepsString}`);
        }
        process.chdir(originalDir);
      } catch (error) {
        console.error(`❌ Failed to install dependencies: ${error}`);
        await updateDocReport(
          'build',
          {
            status: 'failure',
            error: `Dependency installation failed: ${error instanceof Error ? error.message : String(error)}`,
          },
          packageDir,
        );
      }

      // Update package.json with newly installed dependencies
      const packageJsonPath = path.join(packageDir, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      packageInfo.dependencies = Object.keys(packageJson?.dependencies || {});
      packageInfo.devDependencies = Object.keys(
        packageJson?.devDependencies || {},
      );

      // Write updated package-info.json
      fs.writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2));
      console.log(`📝 Updated ${packageInfoPath}`);

      // Generate README.md
      const readmeContent = generateMainReadme(
        metadata,
        validatedData.constructorDocs,
        validatedData.functionsDocs,
        (validatedData.envKeys || []) as Array<EnvKeyType>,
        extraInfo,
      );
      fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);
      fs.writeFileSync(path.join(packageDir, 'docs', 'main.md'), readmeContent);
      console.log(`📝 Generated README.md at ${packageDir}`);

      console.log(
        `✅ Updated documentation files and package info at ${packageDir}`,
      );

      // --- Final Cleanup ---
      console.log(
        `🧹 Cleaning up temporary documentation data for ${metadata.packageName}...`,
      );
      inMemoryStore.removeItem(constructorStoreKey);
      inMemoryStore.removeItem(functionsStoreKey);
      inMemoryStore.removeItem(envKeysStoreKey);
      inMemoryStore.removeItem(dependenciesStoreKey);
    } catch (error) {
      // Update documentation report - error case during processing/build
      console.error(
        '❌ Error processing documentation or building package:',
        error,
      );
      // --- Cleanup on Error ---
      console.log(
        `🧹 Cleaning up temporary documentation data for ${metadata.packageName} after error...`,
      );
      inMemoryStore.removeItem(constructorStoreKey);
      inMemoryStore.removeItem(functionsStoreKey);
      inMemoryStore.removeItem(envKeysStoreKey);
      inMemoryStore.removeItem(dependenciesStoreKey);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('❌ Top-level error during documentation generation:', error);
    try {
      await updateDocReport(
        'generate',
        {
          status: 'failure',
          error: `Unhandled error: ${error instanceof Error ? error.message : String(error)}`,
        },
        packageDir,
      );
    } catch (reportError) {
      console.error(
        'Failed to update report after top-level error:',
        reportError,
      );
    }

    // --- Cleanup on Error ---
    console.log(
      `🧹 Cleaning up temporary documentation data for ${metadata.packageName} after top-level error...`,
    );
    inMemoryStore.removeItem(constructorStoreKey);
    inMemoryStore.removeItem(functionsStoreKey);
    inMemoryStore.removeItem(envKeysStoreKey);
    inMemoryStore.removeItem(dependenciesStoreKey);

    return false;
  }
}

/**
 * Generate README.md content
 */
function generateMainReadme(
  metadata: SDKMetadata,
  constructorDocs: ConstructorDocsData,
  functionsDocs: Array<FunctionDocsData>,
  envKeys: Array<EnvKeyType>,
  extraInfo: string[],
): string {
  const { title, description, packageName } = metadata;

  const constructorName = constructorDocs.name;
  const safeConstructorName = constructorName.replace(/[^a-zA-Z0-9_-]/g, '_');

  let content = `# ${title}\n\n${description}\n\n`;

  let installPackages = [packageName];
  if (metadata.authType === 'oauth2' && metadata.authSdk) {
    installPackages.push(metadata.authSdk);
  }

  content += `## Installation\n\n\`\`\`bash\nnpm install ${installPackages.join(' ')}\n\`\`\`\n\n`;

  if (envKeys && envKeys.length > 0) {
    content += `## Environment Variables\n\n`;
    content += `To use this package, you need to set the following environment variables:\n\n`;

    for (const key of envKeys) {
      content += `- \`${key.key}\`: ${key.description} ${key.required ? '** (Required)**' : '(Optional)'}\n`;
    }

    content += `\n`;
  } else {
    content += `## Environment Variables\n\nThis package does not require any environment variables.\n\n`;
  }

  content += '## API Reference\n\n';
  content +=
    'For detailed documentation on the constructor and all available functions, please refer to the following files:\n\n';

  content += `- [**${constructorName}** (Constructor)](./docs/constructors/${safeConstructorName}.md): Initializes the client.\n`;

  for (const func of functionsDocs) {
    const safeFuncName = func.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    if (safeFuncName) {
      content += `- [${func.name}](./docs/functions/${safeFuncName}.md)\n`;
    }
  }
  content += '\n';

  return content;
}

if (require.main === module) {
  (async () => {
    const packageName = process.argv[2];
    const skipPhase2 = process.argv[3] === 'skip';
    if (!packageName) {
      console.error('Please provide a package name as an argument');
      process.exit(1);
    }

    const packageDir = path.join(getProjectRoot(), 'packages', packageName);

    if (!fs.existsSync(packageDir)) {
      console.error(`Package directory not found: ${packageDir}`);
      process.exit(1);
    }

    const srcDir = path.join(packageDir, 'src');
    let tsFiles: string[] = [];
    if (fs.existsSync(srcDir)) {
      tsFiles = fs
        .readdirSync(srcDir)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
        .map(file => path.join('src', file));
    } else {
      console.warn(
        `Source directory not found: ${srcDir}. Cannot read TS files.`,
      );
      process.exit(1);
    }

    let combinedCode = '';
    for (const file of tsFiles) {
      const filePath = path.join(packageDir, file);
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        combinedCode += `\n// --- File: ${file} ---\n${fileContent}\n`;
      } catch (readError) {
        console.error(`Error reading file ${filePath}:`, readError);
        process.exit(1);
      }
    }

    if (!combinedCode.trim()) {
      console.error('No TypeScript code found in src directory.');
      process.exit(1);
    }

    const packageInfoPath = path.join(packageDir, 'package-info.json');
    let packageInfo: any;
    try {
      packageInfo = JSON.parse(fs.readFileSync(packageInfoPath, 'utf8'));
    } catch (jsonError) {
      console.error(`Error reading or parsing ${packageInfoPath}:`, jsonError);
      process.exit(1);
    }

    const packageBuilderPath = path.join(packageDir, 'package-builder.json');
    let packageBuilder: any;
    try {
      packageBuilder = JSON.parse(fs.readFileSync(packageBuilderPath, 'utf8'));
    } catch (jsonError) {
      console.error(
        `Error reading or parsing ${packageBuilderPath}:`,
        jsonError,
      );
    }

    const constructors = packageInfo.constructors || [];
    const firstConstructor = constructors[0] || {};

    const metadata: SDKMetadata = packageBuilder.sdkMetadata;

    const extraInfo = packageInfo.extraInfo || [];

    try {
      const success = await generateDocs(
        combinedCode,
        metadata,
        packageDir,
        extraInfo,
        skipPhase2,
      );
      if (success) {
        console.log(
          `\n✅ Successfully generated documentation for ${packageName}`,
        );
      } else {
        console.error(
          `\n❌ Failed to generate documentation for ${packageName}`,
        );
        process.exitCode = 1;
      }
    } catch (docError) {
      console.error(
        `\n❌ Unhandled exception during generateDocs for ${packageName}:`,
        docError,
      );
      process.exitCode = 1;
    }
  })();
}
