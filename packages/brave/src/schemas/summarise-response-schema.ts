import { z } from 'zod';
import {
  ThumbnailSchema,
  ImagePropertiesSchema,
  MetaUrlSchema,
} from './schemas';

// SummaryImage Schema (extends Image)
export const summaryImageSchema = z.object({
  thumbnail: ThumbnailSchema,
  url: z.string(),
  properties: ImagePropertiesSchema,
  text: z.string(),
});

// SummaryEntity Schema
export const summaryEntitySchema = z.object({
  uuid: z.string(),
  name: z.string(),
  url: z.string(),
  text: z.string(),
  images: z.array(summaryImageSchema),
  highlight: z.array(
    z.object({
      start: z.number(),
      end: z.number(),
    }),
  ),
});

// SummaryMessage Schema
export const summaryMessageSchema = z.object({
  type: z.enum(['token', 'enum_item', 'enum_start', 'enum_end']),
  data: z.union([summaryEntitySchema, z.string()]),
});

// SummaryContext Schema
export const summaryContextSchema = z.object({
  title: z.string(),
  url: z.string(),
  meta_url: MetaUrlSchema,
});

// SummaryAnswer Schema
export const summaryAnswerSchema = z.object({
  answer: z.string(),
  score: z.number(),
  highlight: z.object({
    start: z.number(),
    end: z.number(),
  }),
});

// SummaryEnrichments Schema
export const summaryEnrichmentsSchema = z.object({
  raw: z.string(),
  images: z.array(summaryImageSchema),
  qa: z.array(summaryAnswerSchema),
  entities: z.array(summaryEntitySchema),
  context: z.array(summaryContextSchema),
});

// SummaryEntityInfo Schema
export const summaryEntityInfoSchema = z.object({
  provider: z.string(),
  description: z.string(),
});

// Main SummarizerSearchApiResponse Schema
export const summarizerSearchApiResponseSchema = z.object({
  type: z.literal('summarizer'),
  status: z.enum(['failed', 'complete']),
  title: z.string(),
  summary: z.array(summaryMessageSchema),
  enrichments: summaryEnrichmentsSchema,
  followups: z.array(z.string()),
  entities_infos: z.record(z.string(), summaryEntityInfoSchema),
});

// TypeScript Types
export type SummaryImage = z.infer<typeof summaryImageSchema>;
export type SummaryEntity = z.infer<typeof summaryEntitySchema>;
export type SummaryMessage = z.infer<typeof summaryMessageSchema>;
export type SummaryContext = z.infer<typeof summaryContextSchema>;
export type SummaryAnswer = z.infer<typeof summaryAnswerSchema>;
export type SummaryEnrichments = z.infer<typeof summaryEnrichmentsSchema>;
export type SummaryEntityInfo = z.infer<typeof summaryEntityInfoSchema>;
export type SummarizerSearchApiResponse = z.infer<
  typeof summarizerSearchApiResponseSchema
>;
