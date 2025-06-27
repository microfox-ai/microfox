import { z } from 'zod';

export const UsageTypeSchema = z.enum(['llm', 'api_1']);
export type UsageType = z.infer<typeof UsageTypeSchema>;

export const UsageTrackerConstructorOptionsSchema = z.object({
  redisOptions: z
    .object({
      url: z.string(),
      token: z.string(),
    })
    .optional(),
  prefix: z.string().optional(),
});

export type UsageTrackerConstructorOptions = z.infer<
  typeof UsageTrackerConstructorOptionsSchema
>;

const LLMUsageSchema = z.object({
  type: z.literal('llm'),
  model: z.string().optional(),
  inputTokens: z.number().optional(),
  outputTokens: z.number().optional(),
  cachedInputTokens: z.number().optional(),
  reasoningTokens: z.number().optional(),
  totalTokens: z.number().optional(),
});

const API1UsageSchema = z.object({
  type: z.literal('api_1'),
  requestKey: z.string().optional(),
  requestCount: z.number(),
  requestData: z.number().optional(),
  markup: z.number().optional(),
});

const BaseUsageSchema = z.object({
  package: z.string(),
  timestamp: z.string().optional(),
  markup: z.number().optional(),
});

export const UsageSchema = z.intersection(
  BaseUsageSchema,
  z.discriminatedUnion('type', [LLMUsageSchema, API1UsageSchema]),
);

export type Usage = z.infer<typeof UsageSchema>;

export type LLMUsage = z.infer<typeof LLMUsageSchema>;
export type API1Usage = z.infer<typeof API1UsageSchema>;
export type BaseUsage = z.infer<typeof BaseUsageSchema>;
