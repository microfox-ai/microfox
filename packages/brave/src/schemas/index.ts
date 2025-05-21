import { z } from 'zod';
import {
  RequestHeadersSchema,
  LocalSearchHeadersSchema,
} from './request-headers';
import { WebSearchParamsSchema } from './request-search-params';

export const BraveSDKOptionsSchema = z
  .object({
    apiKey: z.string().optional(),
    headers: RequestHeadersSchema.optional(),
    localSearchHeaders: LocalSearchHeadersSchema.optional(),
    enableRedisTracking: z.boolean().optional(),
    redisTrackingId: z.string().optional(),
  })
  .describe('Options for initializing the Brave SDK');

export const SummarizerSearchParamsSchema = z
  .object({
    key: z
      .string()
      .describe('The summarizer key obtained from a prior web search'),
    entity_info: z.boolean().optional().describe('Include entity information'),
  })
  .describe('Parameters for summarizer search');

export const ImageSearchParamsSchema = WebSearchParamsSchema.omit({
  summary: true,
  extra_snippets: true,
}).describe('Parameters for image search');

export const VideoSearchParamsSchema = WebSearchParamsSchema.omit({
  summary: true,
  extra_snippets: true,
}).describe('Parameters for video search');

export const NewsSearchParamsSchema = WebSearchParamsSchema.omit({
  summary: true,
  extra_snippets: true,
}).describe('Parameters for news search');

export const SuggestSearchParamsSchema = z
  .object({
    q: z.string().describe('Search query'),
    country: z.string().optional().describe('2-letter country code'),
    count: z.number().optional().describe('Number of suggestions'),
  })
  .describe('Parameters for suggest search');

export const SpellcheckSearchParamsSchema = z
  .object({
    q: z.string().describe('Search query'),
    country: z.string().optional().describe('2-letter country code'),
  })
  .describe('Parameters for spellcheck search');

// Type definitions
export type BraveSDKOptions = z.infer<typeof BraveSDKOptionsSchema>;
export type SummarizerSearchParams = z.infer<
  typeof SummarizerSearchParamsSchema
>;
export type ImageSearchParams = z.infer<typeof ImageSearchParamsSchema>;
export type VideoSearchParams = z.infer<typeof VideoSearchParamsSchema>;
export type NewsSearchParams = z.infer<typeof NewsSearchParamsSchema>;
export type SuggestSearchParams = z.infer<typeof SuggestSearchParamsSchema>;
export type SpellcheckSearchParams = z.infer<
  typeof SpellcheckSearchParamsSchema
>;
