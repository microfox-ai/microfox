import { z } from 'zod';

// Zod schemas for fontuse SDK validation

/**
 * Schema for FontuseSdk configuration validation
 */
export const FontuseSdkConfigSchema = z.object({
  redisUrl: z.string().optional(),
  redisToken: z.string().optional(),
  ragUrl: z.string().optional(),
  ragToken: z.string().optional(),
});

export type FontuseSdkConfig = z.infer<typeof FontuseSdkConfigSchema>;
