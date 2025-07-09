// Type definitions for ai-agent SDK

import { LanguageModelV2 } from '@ai-sdk/provider';
import { z } from 'zod';
import { FilePlanSchema } from '../schemas';

export interface DirectoryStructure {
  path: string;
  type: 'file' | 'directory';
  name: string;
  children?: DirectoryStructure[];
}


export type FilePlan = z.infer<typeof FilePlanSchema>;

/**
 * Context passed to prompt preparation functions.
 */
export interface PreparePromptContext<TParams = any> {
  filePlan: FilePlan;
  planParams: TParams;
  systemPrompt: string;
  userPrompt: string;
  dirStructure?: DirectoryStructure;
}

export type PreparePrompt<TParams = any> = (
  context: PreparePromptContext<TParams>
) => Promise<string> | string;

export interface PrepareSystemPromptContext<TParams = any> {
  filePlan: FilePlan;
  planParams: TParams;
  systemPrompt: string;
  userPrompt: string;
  dirStructure?: DirectoryStructure;
}

export type PrepareSystemPrompt<TParams = any> = (
  context: PrepareSystemPromptContext<TParams>
) => Promise<string> | string;


/**
 * Options for the single-file generation function (`generateCodeV0`).
 */
export interface GenerateCodeV0Options<TParams = any> {
  model: LanguageModelV2;
  submodel?: LanguageModelV2;
  systemPrompt: string;
  subsystemPrompt?: string;
  userPrompt: string;
  subuserPrompt?: string;
  planParams?: TParams;
  preparePrompt?: PreparePrompt<TParams>;
  prepareSystemPrompt?: PrepareSystemPrompt<TParams>;
  dir?: string;
  verbose?: boolean;
  paramsSchema?: z.ZodSchema<TParams>;
  onFileSubmit: (fileName: string, content: string) => Promise<void> | void;
  maxRetries?: number;
}


/**
 * Context passed to chunk preparation functions.
 */
export interface PrepareChunkContext<TParams = any> {
  filePlan: FilePlan;
  planParams: TParams;
  systemPrompt: string;
  userPrompt: string;
  dirStructure?: DirectoryStructure;
  codeSoFar: string;
  stop: () => void;
}

export type PrepareChunk<TParams = any> = (
  context: PrepareChunkContext<TParams>
) => Promise<string> | string;

/**
 * Context for the onChunkSubmit callback.
 */
export interface OnChunkSubmitContext<TParams = any> {
  chunk: string;
  filePlan: FilePlan;
  planParams: TParams;
  stop: () => void;
}

export type OnChunkSubmit<TParams = any> = (
  context: OnChunkSubmitContext<TParams>
) => Promise<void> | void;


/**
 * Options for the chunk-based single-file generation function (`generateCodeV2`).
 */
export interface GenerateCodeV2Options<TParams = any> {
  model: LanguageModelV2;
  submodel?: LanguageModelV2;
  systemPrompt: string;
  subsystemPrompt?: string;
  userPrompt: string;
  subuserPrompt?: string;
  planParams?: TParams;
  preparePrompt?: PreparePrompt<TParams>;
  prepareSystemPrompt?: PrepareSystemPrompt<TParams>;
  prepareChunkPrompt?: PrepareChunk<TParams>;
  onChunkSubmit?: OnChunkSubmit<TParams>;
  dir?: string;
  verbose?: boolean;
  paramsSchema?: z.ZodSchema<TParams>;
  onFileSubmit: (fileName: string, content: string) => Promise<void> | void;
  maxRetries?: number;
  maxChunks?: number;
}

/**
 * Options for the multi-file project generation function (`generateProject`).
 */
export interface GenerateProjectOptions<TParams = any> {
  model: LanguageModelV2;
  submodel?: LanguageModelV2;
  systemPrompt: string;
  subsystemPrompt?: string;
  userPrompt: string;
  subuserPrompt?: string;
  dir?: string;
  temperature?: number;
  verbose?: boolean;
  paramsSchema?: z.ZodSchema<TParams>;
  writeFile: (filePath: string, content: string) => Promise<void> | void;
}

/**
 * The final result of the project generation process.
 */
export interface GenerateProjectResult<TParams = any> {
  plan: {
    files: FilePlan[];
    params: TParams | null;
  };
  generatedFiles: Map<string, string>;
}
