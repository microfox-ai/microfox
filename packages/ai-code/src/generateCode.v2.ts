// @ts-ignore
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import * as path from 'path';
import {
  scanDirectoryStructure,
  formatDirectoryStructure,
} from './utils/scanDirectoryStructure';
import { FilePlan, GenerateCodeV2Options } from './types';
import { FilePlanSchema } from './schemas';

type GenerateTextOptions = Parameters<typeof generateText>[0];

const extractJsonObject = (str: string): any | null => {
  const match = str.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error('Failed to parse JSON from response:', error);
      return null;
    }
  }
  return null;
};

/**
 * Generates a single code file in chunks by planning and then iteratively building the file.
 */
export async function generateCodeV2<TParams = any>(
  options: GenerateCodeV2Options<TParams> & GenerateTextOptions
): Promise<void> {
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
    prepareSystemPrompt,
    prepareChunkPrompt,
    onFileSubmit,
    onChunkSubmit,
    maxChunks = 10,
    ...args
  } = options;

  const log = (message: string, data?: any) =>
    verbose && console.log(`[generateCodeV2] ${message}`, data || '');

  // Phase 1: Planning
  log('Phase 1: Planning...');
  const planningModel = submodel || model;
  const dirStructure = dir ? scanDirectoryStructure(dir) : undefined;

  const planningSystemPrompt =
    subsystemPrompt ||
    `You are a master software architect. Your job is to analyze a user's request and create a detailed plan for a single file. You must also extract any parameters from the request.`;
  const planningUserPrompt =
    subuserPrompt ||
    `<user_instruction>\n${userPrompt}\n</user_instruction>\n\n${dirStructure ? `<directory_structure>\n${formatDirectoryStructure(dirStructure)}\n</directory_structure>` : ''}\n\nCreate a plan for a single file and extract parameters. The plan should include fileName, fileExtension, path, and a detailed codeBrief. The 'path' should be relative to the root of the directory, e.g., 'utils' or '.' for the root.`;

  const PlanWithParamsSchema = paramsSchema
    ? z.object({
        plan: FilePlanSchema,
        params: paramsSchema,
      })
    : z.object({
        plan: FilePlanSchema,
      });

  const { object } = await generateObject({
    model: planningModel,
    system: planningSystemPrompt,
    prompt: planningUserPrompt,
    schema: PlanWithParamsSchema,
  });
  const { plan, params } = object as { plan: FilePlan; params: TParams };
  log('Planning successful.', { plan, params });

  // Phase 2: Generation
  log('Phase 2: Generating File in Chunks...');
  const fullFileName = `${plan.fileName}.${plan.fileExtension}`;
  const generationSystemPrompt = prepareSystemPrompt
    ? await prepareSystemPrompt({
        filePlan: plan,
        planParams: params,
        systemPrompt,
        userPrompt,
        dirStructure: dirStructure || undefined,
      })
    : systemPrompt;

  let codeSoFar = '';
  let currentChunk = 1;
  let isDone = false;
  let stopGeneration = false;
  const stop = () => {
    stopGeneration = true;
  };

  while (currentChunk <= maxChunks && !isDone && !stopGeneration) {
    log(`Generating chunk ${currentChunk} of ${maxChunks}...`);

    const chunkPrompt = prepareChunkPrompt
      ? await prepareChunkPrompt({
          filePlan: plan,
          planParams: params,
          systemPrompt,
          userPrompt,
          dirStructure: dirStructure || undefined,
          codeSoFar,
          stop,
        })
      : `You are an AI programmer augmenting a code file.
        **File Details:**
        - **Name:** ${fullFileName}
        - **Path:** ${plan.path}
        - **User Instructions:** ${userPrompt}
        - **Code Brief:** ${plan.codeBrief}

        **Current Code:**
        \`\`\`
        ${codeSoFar}
        \`\`\`

        Your task is to add more code to this file according to the plan. Add the next set of functions or logic as a self-contained block.
        Your response should be only the new code to be appended.
        If you believe the file is now complete according to the plan, end your response with "[DONE]".
        Otherwise, end your response with "[CONTINUE]".
      `;

    if (stopGeneration) {
      log('Generation stopped by prepareChunkPrompt.');
      break;
    }

    const { text: chunk } = await generateText({
      model,
      system: generationSystemPrompt,
      prompt: chunkPrompt,
      ...args,
    });

    let processedChunk = chunk;

    // Strip markdown fences
    processedChunk = processedChunk.replace(
      /^\s*```(?:typescript|javascript|ts|js)?\s*\n/i,
      ''
    );
    processedChunk = processedChunk.replace(/```\s*$/, '');

    const doneMatch = /\[DONE\]\s*$/.exec(processedChunk);
    const continueMatch = /\[CONTINUE\]\s*$/.exec(processedChunk);

    if (doneMatch) {
      isDone = true;
      processedChunk = processedChunk.substring(0, doneMatch.index);
    } else if (continueMatch) {
      processedChunk = processedChunk.substring(0, continueMatch.index);
    }

    if (onChunkSubmit) {
      await onChunkSubmit({
        chunk: processedChunk,
        filePlan: plan,
        planParams: params,
        stop,
      });
    }

    codeSoFar += processedChunk;

    if (stopGeneration) {
      log('Generation stopped by onChunkSubmit or prepareChunkPrompt.');
      break;
    }

    currentChunk++;
  }

  if (!isDone && !stopGeneration) {
    log('Max chunks reached without completion. Submitting partial file.');
  }

  const finalPath = path.join(dir || '', plan.path, fullFileName);
  await onFileSubmit(finalPath, codeSoFar);
  log(`File "${finalPath}" submitted successfully.`);
}
