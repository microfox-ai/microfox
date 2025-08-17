import { z } from 'zod';
import { Redis } from '@upstash/redis';

export const whatsappOAuthConfigSchema = z.object({
  apiBaseUrl: z.string().url().optional(),
  upstashRedisRestUrl: z.string().url().optional(),
  upstashRedisRestToken: z.string().optional(),
  redis: z.instanceof(Redis).optional(),
});

export type WhatsappOAuthConfig = z.infer<typeof whatsappOAuthConfigSchema>;

export const whatsappVerificationSchema = z.object({
  id: z.string(),
  clientSecretId: z.string(),
  userId: z.string(),
  slug: z.string(),
  code: z.string(),
  phoneNumber: z.string().optional(),
  createdAt: z.date(),
  verified: z.boolean(),
  metadata: z.any().optional(),
});

export type WhatsAppVerification = z.infer<typeof whatsappVerificationSchema>;

export const createVerificationPayloadSchema = z.object({
  id: z.string().optional(),
  clientSecretId: z.string(),
  userId: z.string(),
  slug: z.string(),
  code: z.string().optional(),
  createdAt: z.date().optional(),
  verified: z.boolean().optional(),
});

export type CreateVerificationPayload = z.infer<
  typeof createVerificationPayloadSchema
>;

export const clientSecretSchema = z.object({
  id: z.string(),
  variables: z.array(z.any()),
  botConfig: z.array(z.any()),
});

export type ClientSecret = z.infer<typeof clientSecretSchema>;
