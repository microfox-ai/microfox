export type OpenAIImageModelId =
  | 'dall-e-3'
  | 'dall-e-3-hd'
  | 'dall-e-2'
  | (string & {});

export type OpenAILanguageModelId =
  | 'o1'
  | 'o1-2024-12-17'
  | 'o1-mini'
  | 'o1-mini-2024-09-12'
  | 'o1-preview'
  | 'o1-preview-2024-09-12'
  | 'o3-mini'
  | 'o3-mini-2025-01-31'
  | 'o3'
  | 'o3-2025-04-16'
  | 'o4-mini'
  | 'o4-mini-2025-04-16'
  | 'gpt-4.1'
  | 'gpt-4.1-2025-04-14'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-mini-2025-04-14'
  | 'gpt-4.1-nano'
  | 'gpt-4.1-nano-2025-04-14'
  | 'gpt-4o'
  | 'gpt-4o-2024-05-13'
  | 'gpt-4o-2024-08-06'
  | 'gpt-4o-2024-11-20'
  | 'gpt-4o-audio-preview'
  | 'gpt-4o-audio-preview-2024-10-01'
  | 'gpt-4o-audio-preview-2024-12-17'
  | 'gpt-4o-search-preview'
  | 'gpt-4o-search-preview-2025-03-11'
  | 'gpt-4o-mini-search-preview'
  | 'gpt-4o-mini-search-preview-2025-03-11'
  | 'gpt-4o-mini'
  | 'gpt-4o-mini-2024-07-18'
  | 'gpt-4-turbo'
  | 'gpt-4-turbo-2024-04-09'
  | 'gpt-4-turbo-preview'
  | 'gpt-4-0125-preview'
  | 'gpt-4-1106-preview'
  | 'gpt-4'
  | 'gpt-4-0613'
  | 'gpt-4.5-preview'
  | 'gpt-4.5-preview-2025-02-27'
  | 'gpt-3.5-turbo-0125'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-1106'
  | 'chatgpt-4o-latest'
  | (string & {});

export type OpenAIEmbeddingModelId =
  | 'text-embedding-3-small'
  | 'text-embedding-3-large'
  | 'text-embedding-ada-002'
  | (string & {});

export interface OpenAIChatSettings {
  logitBias?: Record<number, number>;
  logprobs?: boolean | number;
  /**
Whether to enable parallel function calling during tool use. Default to true.
   */
  parallelToolCalls?: boolean;
  /**
Whether to use structured outputs. Defaults to false.
 
When enabled, tool calls and object generation will be strict and follow the provided schema.
 */
  structuredOutputs?: boolean;
  /**
A unique identifier representing your end-user, which can help OpenAI to
monitor and detect abuse. Learn more.
*/
  user?: string;
  /**
Automatically download images and pass the image as data to the model.
OpenAI supports image URLs for public models, so this is only needed for
private models or when the images are not publicly accessible.
 
Defaults to `false`.
   */
  downloadImages?: boolean;
  /**
Simulates streaming by using a normal generate call and returning it as a stream.
Enable this if the model that you are using does not support streaming.
 
Defaults to `false`.
 
@deprecated Use `simulateStreamingMiddleware` instead.
   */
  simulateStreaming?: boolean;
  /**
Reasoning effort for reasoning models. Defaults to `medium`.
   */
  reasoningEffort?: 'low' | 'medium' | 'high';
}
