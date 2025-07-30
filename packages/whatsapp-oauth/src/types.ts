import { z } from 'zod';

export const whatsappOAuthConfigSchema = z.object({
  apiBaseUrl: z.string().url().optional(),
  whatsappBusinessPhoneNumber: z.string().optional(),
  whatsappBusinessPhoneNumberId: z.string().optional(),
  whatsappBusinessAccountId: z.string().optional(),
});

export type WhatsappOAuthConfig = z.infer<typeof whatsappOAuthConfigSchema>;

export const whatsappVerificationSchema = z.object({
  id: z.string(),
  clientSecretId: z.string(),
  userId: z.string(),
  slug: z.string(),
  code: z.string(),
  callbackUri: z.string().url(),
  phoneNumber: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type WhatsAppVerification = z.infer<typeof whatsappVerificationSchema>;

export const createVerificationPayloadSchema = z.object({
  clientSecretId: z.string(),
  userId: z.string(),
  slug: z.string(),
  code: z.string(),
  callbackUri: z.string().url(),
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