import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import * as path from 'path';
import {
  scanDirectoryStructure,
  formatDirectoryStructure,
} from './utils/scanDirectoryStructure';
import { FilePlan, GenerateCodeV0Options } from './types';
import { FilePlanSchema } from './schemas';
import { generateCodeFile } from './generateCodeFile';
import { LanguageModelV2 } from '@ai-sdk/provider';
import { google } from '@ai-sdk/google';

type GenerateTextOptions = Parameters<typeof generateText>[0];

/**
 * Generates a single code file in one shot by planning and then delegating to generateFile.
 */
export async function generateCodeV0<TParams = any>(
  options: GenerateCodeV0Options<TParams> & GenerateTextOptions
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
    preparePrompt,
    prepareSystemPrompt,
    onFileSubmit,
  } = options;

  const log = (message: string, data?: any) =>
    verbose && console.log(`[generateCodeV0] ${message}`, data || '');

  // Phase 1: Planning
  log('Phase 1: Planning...');
  const planningModel = submodel || model;
  const dirStructure = dir ? scanDirectoryStructure(dir) : undefined;

  const planningSystemPrompt =
    subsystemPrompt ||
    `You are a master software architect. Your job is to analyze a user's request and create a detailed plan for a single file. You must also extract any parameters from the request.`;
  const planningUserPrompt =
    subuserPrompt ||
    `<user_instruction>\n${userPrompt}\n</user_instruction>\n\n${dirStructure ? `<directory_structure>\n${formatDirectoryStructure(dirStructure)}\n</directory_structure>` : ''}\n\nCreate a file plan and extract parameters.`;

  const PlanWithParamsSchema = paramsSchema
    ? z.object({
        plan: FilePlanSchema,
        params: paramsSchema,
      })
    : z.object({
        plan: FilePlanSchema,
      });

  const { object } = await generateObject({
    model: google('gemini-2.0-flash-001'),
    system: planningSystemPrompt,
    prompt: planningUserPrompt,
    schema: PlanWithParamsSchema,
  });
  const { plan, params } = object as { plan: FilePlan; params?: TParams };
  log('Planning successful.', { plan });

  // Phase 2: Generation
  log('Phase 2: Generating File...');
  const fullFileName = `${plan.fileName}.${plan.fileExtension}`;

  const generationSystemPrompt = params
    ? prepareSystemPrompt
      ? await prepareSystemPrompt({
          filePlan: plan,
          planParams: params,
          systemPrompt,
          userPrompt,
          dirStructure: dirStructure || undefined,
        })
      : systemPrompt
    : systemPrompt;

  const defaultUserPrompt = `Generate the code for the file "${fullFileName}".
    **User Instructions:**
    ${userPrompt}

    **Code Brief:**
    ${plan.codeBrief}
`;
  const generationUserPrompt = params
    ? preparePrompt
      ? await preparePrompt({
          filePlan: plan,
          planParams: params,
          systemPrompt,
          userPrompt,
          dirStructure: dirStructure || undefined,
        })
      : defaultUserPrompt
    : defaultUserPrompt;

  const code = await generateCodeFile({
    ...options,
    model,
    systemPrompt: generationSystemPrompt,
    userPrompt: generationUserPrompt,
  });

  const finalPath = path.join(dir || '', plan.path, fullFileName);
  await onFileSubmit(finalPath, code);
  log(`File "${finalPath}" submitted successfully.`);
}
