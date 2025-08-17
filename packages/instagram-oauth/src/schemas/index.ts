import { z } from 'zod';

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  user_id: z.number(),
  permissions: z.array(z.string()),
});

export const errorResponseSchema = z.object({
  error_type: z.string(),
  code: z.number(),
  error_message: z.string(),
});

export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
