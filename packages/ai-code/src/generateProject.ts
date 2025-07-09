import { generateObject } from 'ai';
import { z } from 'zod';
import * as path from 'path';
import {
  scanDirectoryStructure,
  formatDirectoryStructure,
} from './utils/scanDirectoryStructure';
import { generateCodeFile } from './generateCodeFile';
import {
  FilePlan,
  GenerateProjectOptions,
  GenerateProjectResult,
} from './types';
import { FilePlanSchema } from './schemas';

function topologicalSort(files: FilePlan[]): FilePlan[] {
  const sorted: FilePlan[] = [];
  const visited = new Set<string>();
  const fullyVisited = new Set<string>();
  const fileMap = new Map(
    files.map((f) => [`${f.path}/${f.fileName}.${f.fileExtension}`, f])
  );

  function visit(file: FilePlan) {
    const fullFileName = `${file.path}/${file.fileName}.${file.fileExtension}`;
    if (fullyVisited.has(fullFileName)) return;
    if (visited.has(fullFileName))
      throw new Error(`Circular dependency detected: ${fullFileName}`);

    visited.add(fullFileName);
    if (file.dependencies) {
      for (const depName of file.dependencies) {
        const dependency = fileMap.get(depName);
        if (dependency) {
          visit(dependency);
        }
      }
    }
    visited.delete(fullFileName);
    fullyVisited.add(fullFileName);
    sorted.push(file);
  }

  for (const file of files) {
    const fullFileName = `${file.path}/${file.fileName}.${file.fileExtension}`;
    if (!fullyVisited.has(fullFileName)) {
      visit(file);
    }
  }
  return sorted;
}

export async function generateProject<TParams = any>(
  options: GenerateProjectOptions<TParams>
): Promise<GenerateProjectResult<TParams>> {
  const {
    model,
    submodel,
    systemPrompt,
    subsystemPrompt,
    userPrompt,
    subuserPrompt,
    dir,
    verbose = false,
    paramsSchema,
    writeFile,
    ...args
  } = options;

  const log = (message: string, data?: any) =>
    verbose && console.log(`[generateProject] ${message}`, data || '');

  // Phase 1: Planning
  log('Phase 1: Starting Project Planning...');
  const planningModel = submodel || model;
  const dirStructure = dir ? scanDirectoryStructure(dir) : undefined;

  const planningSystemPrompt =
    subsystemPrompt ||
    `You are a world-class Principal Software Architect. Your task is to analyze a user's request and create a detailed project plan, breaking it down into a set of files with dependencies. You must also extract any parameters from the request that match the provided schema.`;
  const planningUserPrompt =
    subuserPrompt ||
    `Please generate a detailed project plan based on the following instruction.\n\n<user_instruction>\n${userPrompt}\n</user_instruction>\n\n${dirStructure ? `<directory_structure>\n${formatDirectoryStructure(dirStructure)}\n</directory_structure>` : ''}`;

  const ProjectPlanSchema = paramsSchema
    ? z.object({
        files: z.array(FilePlanSchema),
        params: paramsSchema,
      })
    : z.object({
        files: z.array(FilePlanSchema),
      });

  const { object } = await generateObject({
    model: planningModel,
    system: planningSystemPrompt,
    prompt: planningUserPrompt,
    schema: ProjectPlanSchema,
  });

  const { files: plannedFiles, params } = object as {
    files: FilePlan[];
    params?: TParams;
  };
  const sortedFiles = topologicalSort(plannedFiles);
  log('Project planning complete.', { fileCount: sortedFiles.length });

  // Phase 2: Generation
  log('Phase 2: Starting File Generation...');
  const generatedFiles = new Map<string, string>();

  for (const filePlan of sortedFiles) {
    const fullFileName = `${filePlan.fileName}.${filePlan.fileExtension}`;
    const filePath = path.join(filePlan.path, fullFileName);
    log(`Generating file: ${filePath}`);

    const fileUserPrompt = `Generate the code for the file "${filePath}".
        **File-specific Instructions:** ${filePlan.codeBrief}
        **Overall Project Goal:** ${userPrompt}
        **Dependencies (already generated):**
        ${(filePlan.dependencies || []).map((dep) => `// ${dep}\n${generatedFiles.get(dep) || ''}`).join('\n\n')}
        `;

    const code = await generateCodeFile({
      model,
      systemPrompt,
      userPrompt: fileUserPrompt,
      ...args,
    });

    const finalPath = path.join(dir || '', filePath);
    await writeFile(finalPath, code);
    generatedFiles.set(finalPath, code);
    log(`File generated and submitted: ${finalPath}`);
  }

  return {
    plan: { files: plannedFiles, params: params ?? null },
    generatedFiles,
  };
}
