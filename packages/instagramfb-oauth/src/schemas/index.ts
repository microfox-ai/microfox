import { z } from 'zod';

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  long_lived_token: z.string().optional(),
  data_access_expiration_time: z.number().optional(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
