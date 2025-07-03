import { z } from 'zod';
import { GoogleScope } from '../types';

export const googleAuthConfigSchema = z.object({
  clientId: z.string().nonempty('Client ID is required'),
  clientSecret: z.string().nonempty('Client Secret is required'),
  redirectUri: z.string().optional().describe('Invalid redirect URI'),
  scopes: z.array(z.string()).optional(),
  state: z.string().optional(),
});

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string().optional(),
  scope: z.string(),
  id_token: z.string().optional(),
});

export const tokenResponseOutputSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional().nullable(),
  idToken: z.string().optional().nullable(),
  expiresIn: z.number(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

export const identityInfoSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  picture: z.string().url().optional(),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  locale: z.string().optional(),
  hd: z.string().optional(),
});

export type GoogleAuthConfig = z.infer<typeof googleAuthConfigSchema>;
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
export type TokenResponseOutput = z.infer<typeof tokenResponseOutputSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type IdentityInfo = z.infer<typeof identityInfoSchema>;
