import { generateObject, generateText, Tool } from 'ai';
import { LanguageModelV2 } from '@ai-sdk/provider';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { scanDirectoryStructure } from './utils/scanDirectoryStructure';

// **GOD OF CODE ARCHITECTURE V5 - THE FINAL, CORRECT IMPLEMENTATION**
// 1. Architect AI: Creates a high-level plan of files and conceptual chunks.
// 2. Planner AI: Takes each high-level chunk and decomposes it into a perfect, hierarchical plan.
// 3. Scaffolder: Creates the file structure on disk with placeholders for all chunks.
// 4. Developer AI: Iteratively generates code for each atomic chunk by reading the current file state and surgically inserting new code.
// 5. Assembler: Assembles the final files by inserting the collected imports.
// 6. Corrector AI: Fixes the assembled code.

const PLACEHOLDER_IMPORTS = '/*--MICROFOX-IMPORTS--*/';
const CHUNK_PLACEHOLDER = (chunkId: string) => `/*--CHUNK::${chunkId}--*/`;
const FILE_TYPES_WITH_IMPORTS = new Set(['typescript', 'javascript']);

const logVerbose = (verbose: boolean, logStream: fs.WriteStream | undefined, message: string, data?: any) => {
    if (verbose) {
      const timestamp = new Date().toISOString();
      let logEntry = `${timestamp} - ${message}`;

      if (data !== undefined) {
        if (data instanceof Error) {
          logEntry += `\n${data.stack || data.message}`;
        } else {
          const seen = new WeakSet();
          const replacer = (key: string, value: any) => {
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return '[Circular]';
              }
              seen.add(value);
            }
          // Avoid logging potentially large code blocks in the general log
          if (key === 'code' && typeof value === 'string' && value.length > 100) {
            return `[Code block, length: ${value.length}]`;
            }
            if (typeof value === 'function') {
              return '[Function]';
            }
            return value;
          };
          logEntry += `\n${JSON.stringify(data, replacer, 2)}`;
        }
      }

      console.log(logEntry);
      if (logStream) {
        logStream.write(logEntry.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '') + '\n');
      }
    }
  };

/**
 * Schema for directory structure representation.
 * Recursively defines a tree structure for files and directories.
 */
const DirectoryStructureSchema: z.ZodType<{
  path: string;
  type: 'file' | 'directory';
  name: string;
  children?: any[];
}> = z.object({
  path: z.string().describe('The directory path'),
  type: z.enum(['file', 'directory']).describe('Type of the entry'),
  name: z.string().describe('Name of the file or directory'),
  children: z.array(z.lazy(() => DirectoryStructureSchema)).optional().describe('Child directories and files'),
});

export type DirectoryStructure = z.infer<typeof DirectoryStructureSchema>;

/**
 * Describes a single chunk of code to be generated. This is now a recursive schema.
 */
const ChunkDetailSchemaContents = {
  id: z.string().describe('A unique identifier for this chunk (e.g., "src/utils/helpers.ts:imports", "src/components/Button.tsx:render"). The ID should be namespaced by the file path.'),
  title: z.string().describe('A short, descriptive title for this code chunk (e.g., "Imports", "MyFunction").'),
  description: z
    .string()
    .describe(
      'A one-to-two sentence description of what this chunk of code will contain and what it will accomplish.'
    ),
  dependencies: z.array(z.string()).describe('A list of other chunk IDs that this chunk directly depends on. This is crucial for generation order.'),
  status: z.enum(['pending', 'decomposing', 'generating', 'completed', 'failed']).default('pending').describe('The current processing status of this chunk.'),
  code: z.string().optional().describe('The final generated code for this chunk. This is only present on leaf nodes.'),
  children: z.array(z.lazy(() => ChunkDetailSchema)).optional().describe('A list of sub-chunks, if this chunk is complex and needs to be decomposed.'),
};
export const ChunkDetailSchema: z.ZodType<any> = z.object(ChunkDetailSchemaContents);

// A non-recursive version for the AI to use when decomposing.
const SubChunkPlanSchema = z.object(ChunkDetailSchemaContents).omit({ status: true, code: true, children: true });

// Recursive type definition
type ChunkDetail = z.infer<typeof ChunkDetailSchema>;

/**
 * Defines the structure for a single file to be generated as part of a plan.
 */
export const FileDetailSchema = z.object({
  fileName: z.string().describe('The name of the file without the extension.'),
  fileExtension: z.string().describe('The file extension (e.g., "ts", "js", "json").'),
  fullFileName: z.string().describe('The complete filename with the extension.'),
  path: z.string().describe('The relative path where the file should be created.'),
  type: z.enum(['typescript', 'javascript', 'json', 'markdown', 'yaml', 'text', 'other']).describe('The type of file.'),
  brief: z.string().describe('A brief, one-sentence description of what this file contains.'),
  dependencies: z.array(z.string()).optional().describe('This is deprecated in favor of chunk-level dependencies.'),
  chunks: z
    .array(ChunkDetailSchema)
    .describe(
      'An array of the top-level chunks for this file. These may be decomposed into sub-chunks during generation.'
    ),
});

export type FileDetail = z.infer<typeof FileDetailSchema>;

const PlanSchema = z.object({
  files: z.array(FileDetailSchema).describe('The detailed list of files to be generated to fulfill the instruction. Only define the TOP-LEVEL chunks for each file.'),
  codeBrief: z.string().optional().describe('A brief, one-paragraph summary of what the generated code will do and how the files work together.'),
});

/**
 * The schema for a chunk of code generated by the AI.
 */
export const CodeChunkSchema = z.object({
  code: z.string().describe('A chunk of code for the file. This can be a partial piece or the entire file if it is small.'),
  imports: z.array(z.object({
    module: z.string().describe('The module or path to import from (e.g., "react", "./utils").'),
    specifiers: z.array(z.string()).describe('The named or default imports (e.g., ["useState", "default as React"]).'),
  })).optional().describe('A list of imports required by this chunk\'s code.'),
});

/**
 * Defines the schema for the state that will be saved to disk.
 */
export const GenerationStateSchema = z.object({
  plan: PlanSchema, // The full, evolving plan with code and statuses
  fileImports: z.record(z.string(), z.record(z.string(), z.array(z.string()))).optional().describe('A map of file paths to their required imports.'),
});

/**
 * A class to manage the state and content of a single file being generated.
 */
class FileContext {
    public content: string = '';
    public fileDetail: FileDetail;
    private chunkMap: Map<string, ChunkDetail> = new Map();

    constructor(fileDetail: FileDetail) {
        this.fileDetail = fileDetail;
        this.buildChunkMap(fileDetail.chunks);
    }

    private buildChunkMap(chunks: ChunkDetail[]) {
        for (const chunk of chunks) {
            this.chunkMap.set(chunk.id, chunk);
            if (chunk.children) {
                this.buildChunkMap(chunk.children);
            }
        }
    }
    
    public getChunk(chunkId: string): ChunkDetail | undefined {
        return this.chunkMap.get(chunkId);
    }

    public updateChunkCode(chunkId: string, code: string) {
        const chunk = this.getChunk(chunkId);
        if (chunk) {
            chunk.code = code;
        }
    }

    public assemble(sortedChunkIds: string[]): string {
        let body = '';
        for (const chunkId of sortedChunkIds) {
            const chunk = this.getChunk(chunkId);
            if (chunk?.code) {
                body += `\n\n${chunk.code}`;
            }
        }
        return body.trim();
    }

    public serialize(): string {
        return JSON.stringify({
            content: this.content,
            fileDetail: this.fileDetail,
        });
    }

    public static deserialize(json: string): FileContext {
        const data = JSON.parse(json);
        const context = new FileContext(data.fileDetail);
        context.content = data.content;
        return context;
    }
}


/**
 * Context passed to prompt preparation functions, containing all state
 * needed for dynamic prompt generation during a code generation loop.
 */
export interface PreparePromptContext<TParams = any> {
  planParams: TParams;
  chunkToGenerate: ChunkDetail;
  dependencies: Map<string, string>; // Map of chunkId to generated code content
}

/**
 * A function that prepares the user prompt for a generation step.
 */
export type PreparePrompt<TParams = any> = (
  context: PreparePromptContext<TParams>
) => string;

/**
 * Context passed to the system prompt preparation function.
 */
export interface PrepareSystemPromptContext<TParams = any> {
  planParams: TParams;
  systemPrompt: string;
  userPrompt: string;
  dirStructure?: DirectoryStructure;
}

/**
 * A function that prepares the system prompt for a generation step.
 */
export type PrepareSystemPrompt<TParams = any> = (
  context: PrepareSystemPromptContext<TParams>
) => string;

/**
 * Formats the directory structure into a string representation for the AI prompt.
 */
function formatDirectoryStructure(node: DirectoryStructure, depth = 0): string {
  let output = '  '.repeat(depth) + `- ${node.name} (${node.type})\n`;
  if (node.children) {
    for (const child of node.children) {
      output += formatDirectoryStructure(child, depth + 1);
    }
  }
  return output;
}

async function writeState(filePath: string, state: z.infer<typeof GenerationStateSchema>) {
  await fs.promises.writeFile(filePath, JSON.stringify(state, null, 2));
}

async function updateFileWithChunk(filePath: string, chunkId: string, code: string): Promise<string> {
  const originalContent = await fs.promises.readFile(filePath, 'utf-8');
  const placeholder = CHUNK_PLACEHOLDER(chunkId);
  
  if (!originalContent.includes(placeholder)) {
    console.warn(`[updateFileWithChunk] Warning: placeholder for chunk "${chunkId}" not found in file "${filePath}". Code was not inserted.`);
    return originalContent;
  }
  
  // This is a surgical replacement of just the placeholder.
  const newContent = originalContent.replace(placeholder, code);
  await fs.promises.writeFile(filePath, newContent);
  return newContent;
}

function topologicalSort(allChunks: Map<string, ChunkDetail>): string[] {
  const sorted: string[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  const visit = (chunkId: string) => {
    if (recursionStack.has(chunkId)) {
      throw new Error(`Circular dependency detected in chunks: ${[...recursionStack, chunkId].join(' -> ')}`);
    }
    if (visited.has(chunkId)) {
      return;
    }

    visited.add(chunkId);
    recursionStack.add(chunkId);

    const chunk = allChunks.get(chunkId);
    if (chunk) {
      for (const depId of chunk.dependencies) {
        if (!allChunks.has(depId)) {
          // It's possible a dependency is in a file that is not being generated.
          // For now, we'll log a warning. A stricter implementation might throw an error.
          console.warn(`[TopologicalSort] Warning: Chunk "${chunkId}" has an unknown dependency "${depId}". This dependency will be ignored.`);
          continue;
        }
        visit(depId);
      }
    }

    recursionStack.delete(chunkId);
    sorted.push(chunkId);
  };

  for (const chunkId of allChunks.keys()) {
    if (!visited.has(chunkId)) {
      visit(chunkId);
    }
  }

  return sorted;
}

/**
 * Options for the single-file code generation function.
 */
export interface GenerateCodeOptions<TParams = any> {
  model: LanguageModelV2;
  submodel?: LanguageModelV2;
  systemPrompt: string;
  userPrompt: string;
  planParams?: TParams;
  dir?: string;
  temperature?: number;
  verbose?: boolean;
  paramsSchema?: z.ZodSchema<TParams>;
  tools?: Record<string, Tool<any, any>>;
  preparePrompt?: (context: PreparePromptContext<TParams>) => Promise<string>;
  prepareSystemPrompt?: (context: PrepareSystemPromptContext<TParams>) => Promise<string>;
  logStream?: fs.WriteStream;
  onChunk?: (chunk: {
    chunkDetail: ChunkDetail;
    generatedCode: string;
    chunkNumber: number;
    totalChunks: number;
  }) => Promise<void> | void;
  onFileSubmit: (fileDetail: FileDetail, content: string) => Promise<void> | void;
  maxRetries?: number;
  stateFilePath: string;
}

/**
 * A function that generates a single file, chunk by chunk, based on a detailed prompt.
 */
export async function generateCodeV1<TParams = any>(
  options: GenerateCodeOptions<TParams>
): Promise<void> {
  const {
    model,
    submodel,
    systemPrompt,
    userPrompt,
    dir,
    temperature = 0,
    verbose = false,
    paramsSchema,
    tools,
    preparePrompt,
    prepareSystemPrompt,
    logStream,
    onChunk,
    onFileSubmit,
    maxRetries = 3,
    stateFilePath,
  } = options;

  let planParams = options.planParams || ({} as TParams);
  const dirStructure = dir ? scanDirectoryStructure(dir) : undefined;

  // =================================================================
  // 1. ARCHITECT PHASE: HIGH-LEVEL PLANNING
  // =================================================================
  logVerbose(verbose, logStream, '[INFO] Starting project planning phase (Architect)...');
  
  const architectSystemPrompt = `You are a master software architect. Your sole responsibility is to analyze a user's request and create a high-level project plan. You do not write code. You plan.
You will be given a high-level system prompt from the user that you should follow.

**Your Task:**
1.  **Decompose the Request:** Break down the user's goal into a logical set of files.
2.  **Define Top-Level Chunks:** For each file, define only the largest, most essential **conceptual components** or "chunks." Think of these as the main sections of the file (e.g., \`Imports and Setup\`, \`Message Sending Tests\`, \`Message Reaction Tests\`).
3.  **DO NOT Decompose Further:** Your job is to create the highest-level conceptual plan. A different, specialized AI will handle the detailed decomposition. Do not nest chunks in your output.

**Output:**
- You MUST respond with a single JSON object that strictly adheres to the provided schema.
- The 'chunks' array must be a flat list of high-level concepts.`;
  
  const architectUserPrompt = `
<user_system_prompt>
${systemPrompt}
</user_system_prompt>

<user_instruction>
${userPrompt}
</user_instruction>
${dirStructure ? `<directory_structure>\n${formatDirectoryStructure(dirStructure)}\n</directory_structure>` : ''}
${paramsSchema ? `\nExtract any parameters you find into the 'params' object, conforming to the provided JSON schema.` : ''}

Based on the instruction and directory structure, create the high-level generation plan. Remember to only define the top-level, conceptual chunks for each file. Do not create a nested or detailed plan.`;

  const PlanningSchemaWithParams = z.object({
    plan: PlanSchema,
    params: paramsSchema || z.any().optional().describe('Parameters extracted from user prompt.'),
  });

    const planResult = await generateObject({
      model: submodel || model,
    system: architectSystemPrompt,
    prompt: architectUserPrompt,
    schema: PlanningSchemaWithParams,
  });

  const plan = planResult.object.plan;
    planParams = { ...planParams, ...planResult.object.params };
  
  logVerbose(verbose, logStream, '[INFO] High-level plan complete.', { plan: plan, params: planParams });
  
  const generationState: z.infer<typeof GenerationStateSchema> = {
    plan,
    fileImports: {},
  };
  await writeState(stateFilePath, generationState);

  // =================================================================
  // 2. PLANNER PHASE: DETAILED DECOMPOSITION
  // =================================================================
  logVerbose(verbose, logStream, '[INFO] Starting chunk planning and decomposition phase (Planner)...');

  const planAndDecomposeChunks = async (files: FileDetail[]): Promise<void> => {
    const plannerSystemPrompt = `You are an expert technical planner. Your sole purpose is to take a high-level conceptual chunk and decompose it into a perfect, optimized, and hierarchical plan for a developer AI to follow.

**CRITICAL: You MUST use the 'submitPlan' tool to respond. Do NOT return raw JSON or markdown.**

**Your Task:**
1.  **Analyze the High-Level Chunk:** Understand its goal and context within the file.
2.  **Create a Hierarchical Sub-Chunk Plan:** Break down the work into a detailed tree of "sub-chunks."
    - **Recursively decompose** complex ideas until each chunk represents a single, atomic unit of code (like a single function, a specific \`it\` test case, a block of constants, or the initial imports).
    - **Deep nesting is required.** A test suite chunk should be broken down into \`describe\` blocks, and each of those into specific \`it\` test cases.
    - **Every element in a 'children' array MUST be a complete chunk object, not a string.**
    - **Define Dependencies:** Accurately map the dependencies between your new, detailed sub-chunks.
3.  **Assign Unique IDs:** Ensure every sub-chunk you create has a unique ID, following the parent chunk's ID as a namespace.

**Output:**
- You MUST call the 'submitPlan' tool with your detailed plan.
- The plan must be deeply nested and highly detailed. This is your only job.
- NEVER return raw JSON or markdown fences.`;

    for (const file of files) {
      const decomposedChunks: ChunkDetail[] = [];
      for (const topLevelChunk of file.chunks) {
        logVerbose(verbose, logStream, `[INFO] Decomposing top-level chunk: ${topLevelChunk.id}`);
        
        let lastError: any;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const plannerUserPrompt = `
**File to be created:** ${file.path}/${file.fullFileName}
**High-Level Chunk to Decompose:** "${topLevelChunk.title}"
**Description:** ${topLevelChunk.description}

**CRITICAL INSTRUCTION:** You MUST call the 'submitPlan' tool with your detailed plan. Do NOT return raw JSON or markdown.

Create the detailed, hierarchical, and optimized execution plan for this chunk by calling the \`submitPlan\` tool with the atomic sub-chunks.`;

                const finalPlannerUserPrompt = (lastError && attempt > 1)
                    ? `${plannerUserPrompt}\n\n---\nATTEMPT ${attempt - 1} FAILED. Your previous response was invalid.
Error: ${JSON.stringify(lastError.issues || lastError.message, null, 2)}
Your Invalid Response:
\`\`\`
${lastError.text || 'No response text.'}
\`\`\`
Please correct your response. It MUST be a single call to the 'submitPlan' tool.`
                    : plannerUserPrompt;

                const result = await generateText({
                    model: submodel || model,
                    system: plannerSystemPrompt,
                    prompt: finalPlannerUserPrompt,
                    tools: {
                        submitPlan: {
                            description: 'Submits the detailed, hierarchical plan for the chunk.',
                            parameters: z.object({
                                subChunks: z.array(ChunkDetailSchema).describe('The detailed, hierarchical list of sub-chunks.'),
                            }),
                        }
                    },
                    temperature: 0, // Be precise for planning
                });
                
                const planCall = result.toolCalls?.find(t => t.toolName === 'submitPlan');

                if (!planCall) {
                    // Try to extract JSON from the response if it's wrapped in markdown
                    let jsonText = result.text;
                    const jsonMatch = result.text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
                    if (jsonMatch) {
                        jsonText = jsonMatch[1];
                    }
                    
                    try {
                        const parsedPlan = JSON.parse(jsonText);
                        if (parsedPlan.subChunks && Array.isArray(parsedPlan.subChunks)) {
                            // We have valid JSON with subChunks, use it
                            decomposedChunks.push(...parsedPlan.subChunks);
                            lastError = null;
                            break;
                        }
                    } catch (parseError) {
                        // JSON parsing failed, throw the original error
                    }
                    
                    throw new Error(`Invalid response from Planner AI. Must call 'submitPlan' tool. Response: ${result.text}`);
                }
                
                // We replace the original high-level chunk with its detailed decomposition
                decomposedChunks.push(...planCall.args.subChunks);
                lastError = null; // Clear error on success
                break; // Exit retry loop
            } catch (error: any) {
                lastError = error;
                logVerbose(verbose, logStream, `[WARN] Planner attempt ${attempt} failed for chunk ${topLevelChunk.id}`, error);
            }
        }
        if (lastError) {
            throw new Error(`Planner failed to decompose chunk ${topLevelChunk.id} after ${maxRetries} attempts. Last error: ${lastError.message}`);
        }
      }
      // Replace the file's high-level chunks with the new, detailed, decomposed chunks
      file.chunks = decomposedChunks;
    }
    await writeState(stateFilePath, generationState);
  };
  
  await planAndDecomposeChunks(generationState.plan.files);

  // =================================================================
  // 3. SCAFFOLDER PHASE: CREATE FILE SKELETONS
  // =================================================================
  logVerbose(verbose, logStream, '[INFO] Scaffolding files with placeholders...');
  
  const allLeafChunks = new Map<string, ChunkDetail>();
  const collectLeafChunks = (chunks: ChunkDetail[]) => {
      for (const chunk of chunks) {
          if (chunk.children && chunk.children.length > 0) {
              collectLeafChunks(chunk.children);
          } else {
              allLeafChunks.set(chunk.id, chunk);
          }
      }
  };

  for (const file of generationState.plan.files) {
    const absoluteFilePath = dir ? path.join(dir, file.path, file.fullFileName) : path.join(file.path, file.fullFileName);
    
    // Create a flattened map of all leaf chunks for this file
    const fileLeafChunks: ChunkDetail[] = [];
    const getFileLeafChunks = (chunks: ChunkDetail[]) => {
      for (const chunk of chunks) {
        if (chunk.children && chunk.children.length > 0) {
            getFileLeafChunks(chunk.children);
        } else {
            fileLeafChunks.push(chunk);
        }
      }
    };
    getFileLeafChunks(file.chunks);
    
    const sortedFileChunkIds = topologicalSort(new Map(fileLeafChunks.map(c => [c.id, c])));
    
    let scaffoldContent = FILE_TYPES_WITH_IMPORTS.has(file.type) ? `${PLACEHOLDER_IMPORTS}\n` : '';
    scaffoldContent += sortedFileChunkIds.map(id => CHUNK_PLACEHOLDER(id)).join('\n');

    const fileDir = path.dirname(absoluteFilePath);
    await fs.promises.mkdir(fileDir, { recursive: true }).catch(() => {});
    await fs.promises.writeFile(absoluteFilePath, scaffoldContent);
  }

  // =================================================================
  // 4. DEVELOPER PHASE: CODE GENERATION
  // =================================================================
  logVerbose(verbose, logStream, '[INFO] Starting atomic chunk code generation (Developer)...');
  
  const generatedCodeMap = new Map<string, string>();
  let generatedChunkCount = 0;
  
  // Get a flat list of all leaf chunks in topological order to drive the generation process.
  const allChunksMap = new Map<string, ChunkDetail>();
  const collectAllChunksForMap = (chunks: ChunkDetail[]) => {
      for (const chunk of chunks) {
          if (chunk.children && chunk.children.length > 0) {
              collectAllChunksForMap(chunk.children);
          } else {
              allChunksMap.set(chunk.id, chunk);
          }
      }
  };
  generationState.plan.files.forEach(file => collectAllChunksForMap(file.chunks));
  const sortedLeafChunkIds = topologicalSort(allChunksMap);
  const totalLeafChunks = sortedLeafChunkIds.length;
  
  const chunkToFileMap = new Map<string, FileDetail>();
  generationState.plan.files.forEach(file => {
    const collect = (chunks: ChunkDetail[]) => {
        chunks.forEach(c => {
            chunkToFileMap.set(c.id, file);
            if(c.children) collect(c.children);
        });
    };
    collect(file.chunks);
  });


  for (const chunkId of sortedLeafChunkIds) {
    const chunk = Array.from(allChunksMap.values()).find(c => c.id === chunkId)!;
    const file = chunkToFileMap.get(chunkId)!;
    const absoluteFilePath = dir ? path.join(dir, file.path, file.fullFileName) : path.join(file.path, file.fullFileName);

    logVerbose(verbose, logStream, `[INFO] Generating code for leaf chunk: ${chunk.id}`);

    // Prepare context: find code of dependencies that are already generated
    const dependencyContent = new Map<string, string>();
    for (const depId of chunk.dependencies) {
      const content = generatedCodeMap.get(depId);
      if (content) {
        dependencyContent.set(depId, content);
      }
    }

    const currentFileContent = await fs.promises.readFile(absoluteFilePath, 'utf-8');

    let developerSystemPrompt = `You are an expert software developer. Your only purpose is to write the code for a single, atomic chunk of a larger file. You are performing a surgical replacement of a placeholder.

**Your Task:**
You will be given the entire content of a file as it currently exists, with a specific placeholder comment for you to replace.
Your response MUST be ONLY the code for the specified chunk.
This code MUST integrate perfectly with the surrounding code in the file. Do NOT redefine existing classes, interfaces, or variables.

**CRITICAL: Your output must be only the raw code for the chunk. Do not wrap it in markdown fences.**`;

    let developerUserPrompt = `
**File to be surgically modified:** \`${file.path}/${file.fullFileName}\`

**Current File Content:**
\`\`\`${file.type}
${currentFileContent}
\`\`\`

---

**YOUR ASSIGNMENT:**
You must replace the placeholder \`${CHUNK_PLACEHOLDER(chunk.id)}\` with the correct TypeScript code for the chunk titled **"${chunk.title}"**.

**Chunk Description:** ${chunk.description}

**Dependencies (for context only):**
The code for chunks that this chunk depends on is provided below. Do not duplicate this code.
---
${Array.from(dependencyContent.entries())
    .map(([id, code]) => `// DEPENDENCY CHUNK: ${id}\n\n${code}`)
    .join('\n\n// -----\n\n') || 'This chunk has no dependencies.'}
---

Now, call the \`generateChunk\` tool with the precise code needed to replace the placeholder.
`;

    const promptContext: PreparePromptContext<TParams> = {
        planParams,
        chunkToGenerate: chunk,
        dependencies: dependencyContent,
    };

    if (prepareSystemPrompt) {
        const preparedSystemPrompt = await prepareSystemPrompt({ planParams, systemPrompt: developerSystemPrompt, userPrompt: developerUserPrompt, dirStructure: dirStructure ?? undefined });
        developerSystemPrompt = preparedSystemPrompt;
    }
    
    if (preparePrompt) {
        const preparedUserPrompt = await preparePrompt(promptContext);
        developerUserPrompt = preparedUserPrompt;
    }

    let lastError: any;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const finalDeveloperUserPrompt = (lastError && attempt > 1)
          ? `${developerUserPrompt}\n\n---\nATTEMPT ${attempt - 1} FAILED. Your previous response was invalid.
Error: ${lastError.message || 'No error message provided.'}
Your Invalid Response:
\`\`\`
${lastError.text || 'No response text.'}
\`\`\`
Please correct your response. It MUST be a single call to the 'generateChunk' tool.`
          : developerUserPrompt;

        const result = await generateText({
          model,
          system: developerSystemPrompt,
          prompt: finalDeveloperUserPrompt,
          tools: {
            ...tools,
            generateChunk: {
              description: 'Generates the final code for a simple, atomic chunk.',
              parameters: z.object({
                code: z.string().describe('The final code for the chunk.'),
                imports: z.array(z.object({
                  module: z.string(),
                  specifiers: z.array(z.string()),
                })).optional().describe('A list of imports required by the generated code.'),
              }),
            }
          },
          temperature,
        });
        
        const generateCall = result.toolCalls?.find(t => t.toolName === 'generateChunk');

        if (generateCall) {
            const { code, imports } = generateCall.args;
            logVerbose(verbose, logStream, `[INFO] Generating code for chunk ${chunk.id}.`);
            chunk.code = code;
            generatedCodeMap.set(chunk.id, chunk.code);

            await updateFileWithChunk(absoluteFilePath, chunk.id, code);

            generatedChunkCount++;
            if (onChunk) {
              await onChunk({
                chunkDetail: chunk,
                generatedCode: code,
                chunkNumber: generatedChunkCount,
                totalChunks: totalLeafChunks,
              });
            }

          // Handle imports
            if (imports && FILE_TYPES_WITH_IMPORTS.has(file.type)) {
                if (!generationState.fileImports) generationState.fileImports = {};
                if (!generationState.fileImports[absoluteFilePath]) generationState.fileImports[absoluteFilePath] = {};
                
                for (const imp of imports) {
                    const existing = new Set(generationState.fileImports[absoluteFilePath][imp.module] || []);
                    imp.specifiers.forEach(s => existing.add(s));
                    generationState.fileImports[absoluteFilePath][imp.module] = Array.from(existing).sort();
                }
            }
        } else {
            throw new Error(`Invalid response from developer AI. Must call 'generateChunk'. Response: ${result.text}`);
        }
        
        chunk.status = 'completed';
        await writeState(stateFilePath, generationState);
        lastError = null;
        break; 
      } catch (error: any) {
        lastError = error;
        logVerbose(verbose, logStream, `[WARN] Attempt ${attempt} failed for chunk ${chunk.id}`, error);
      }
    }
    if(lastError) {
      throw new Error(`Failed to process chunk ${chunk.id} after ${maxRetries} attempts. Last error: ${lastError.message}`);
    }
  }

  // =================================================================
  // 5. FINAL ASSEMBLY & WRITE
  // =================================================================
  logVerbose(verbose, logStream, '[INFO] Assembling final import blocks...');
  
  for (const file of generationState.plan.files) {
    const absoluteFilePath = dir ? path.join(dir, file.path, file.fullFileName) : path.join(file.path, file.fullFileName);
    let finalFileContent = await fs.promises.readFile(absoluteFilePath, 'utf-8');
    
    // 1. Generate import statements
    let importStatements = '';
    if (FILE_TYPES_WITH_IMPORTS.has(file.type)) {
        const importsForFile = generationState.fileImports?.[absoluteFilePath];
        if (importsForFile) {
            for (const modulePath of Object.keys(importsForFile).sort()) {
                const specifiers = importsForFile[modulePath];
                if (specifiers.length > 0) {
                    const defaultImport = specifiers.find(s => s.startsWith('default as'));
                    const namedImports = specifiers.filter(s => !s.startsWith('default as'));
                    let importLine = 'import ';
                    if (defaultImport) {
                        importLine += `${defaultImport.split(' as ')[1]}`;
                        if (namedImports.length > 0) importLine += ', ';
                    }
                    if (namedImports.length > 0) {
                        importLine += `{ ${namedImports.join(', ')} }`;
                    }
                    importLine += ` from '${modulePath}';\n`;
                    importStatements += importLine;
                }
            }
        }
    }
    if (importStatements) {
        finalFileContent = finalFileContent.replace(PLACEHOLDER_IMPORTS, importStatements.trim());
    } else {
        finalFileContent = finalFileContent.replace(`${PLACEHOLDER_IMPORTS}\n`, '');
    }
    
    await onFileSubmit(file, finalFileContent);
    logVerbose(verbose, logStream, `[INFO] Successfully wrote final version of file: ${absoluteFilePath}`);
  }
  
  // =================================================================
  // 6. CORRECTION PHASE: FIX & REFINE
  // =================================================================
  logVerbose(verbose, logStream, '[INFO] Starting correction phase...');

  for (const file of generationState.plan.files) {
    const absoluteFilePath = dir ? path.join(dir, file.path, file.fullFileName) : path.join(file.path, file.fullFileName);
      
    // Read the generated content
    let generatedContent = '';
    try {
        generatedContent = await fs.promises.readFile(absoluteFilePath, 'utf-8');
    } catch (error: any) {
        logVerbose(verbose, logStream, `[WARN] Could not read file for correction: ${absoluteFilePath}`, error);
        continue;
    }

    const correctorSystemPrompt = `You are an expert programmer and test engineer with an obsessive attention to detail. Your task is to take a raw, AI-generated code file, identify all of its flaws, and return a perfectly corrected, production-ready version.

**CRITICAL RULES:**
1.  **Fix All Imports:** The testing framework is **Vitest**. Ensure all test-related imports (\`describe\`, \`it\`, \`expect\`, etc.) are from a single, consolidated \`vitest\` import. Remove all duplicate or unused imports.
2.  **Correct All Syntax:** Fix any and all syntax errors. The previous test run failed with the error **"Transform failed... Expected 'as' but found '}'"**. This indicates a likely issue with import/export syntax. Scrutinize this carefully.
3.  **Do Not Redefine:** The provided code may contain duplicated class or type definitions. You MUST consolidate these into a single, correct definition.
4.  **Ensure Code is Runnable:** The final output must be a single, complete, and syntactically perfect code file that can be executed without errors.
5.  **Return ONLY Raw Code:** Your output must be ONLY the corrected code. Do not include any explanations, apologies, or markdown formatting. **Especially, do not include \`\`\`typescript or \`\`\` at the beginning or end of your response.** Just the raw, corrected code.`;

      const correctorUserPrompt = `
Please correct the following code from the file \`${file.fullFileName}\`. It contains serious errors, such as duplicated class and type definitions. You must consolidate these into single, valid definitions and fix all other errors.

**File Path:** ${absoluteFilePath}

**Original, Flawed Code:**
\`\`\`${file.type}
${generatedContent}
\`\`\`

Return only the fully corrected, runnable code.
`;

      try {
        const correctionResult = await generateText({
            model: submodel || model,
            system: correctorSystemPrompt,
            prompt: correctorUserPrompt,
            temperature: 0, // Be precise
        });

        let correctedCode = correctionResult.text;
        
        // Programmatic guardrail to remove markdown fences - more robust
        correctedCode = correctedCode
            .replace(/^```[a-zA-Z]*\s*\n/, '') // Remove opening fence
            .replace(/\n\s*```\s*$/, '') // Remove closing fence
            .replace(/^```[a-zA-Z]*\s*/, '') // Remove any remaining opening fence without newline
            .replace(/\s*```\s*$/, ''); // Remove any remaining closing fence without newline

        // Overwrite the file with the corrected code
        await onFileSubmit(file, correctedCode);
        logVerbose(verbose, logStream, `[INFO] Successfully corrected and overwrote file: ${absoluteFilePath}`);
      } catch (error: any) {
        logVerbose(verbose, logStream, `[ERROR] Failed to correct file: ${absoluteFilePath}`, error);
      }
  }
  
  logVerbose(verbose, logStream, '[INFO] All files generated successfully.');
}

// Export schemas and types
export { DirectoryStructureSchema };