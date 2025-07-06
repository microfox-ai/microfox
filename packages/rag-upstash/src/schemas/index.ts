import { z } from 'zod';

// Zod schemas for rag-upstash SDK validation

/**
 * Schema for RagUpstashSdk configuration validation
 */
export const RagUpstashSdkConfigSchema = z.object({
  upstashUrl: z.string().url().optional(),
  upstashToken: z.string().optional(),
});

export type RagUpstashSdkConfig = z.infer<typeof RagUpstashSdkConfigSchema>;
