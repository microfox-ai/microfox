import { z } from 'zod';

export const configSchema = z.object({
  clientId: z.string().min(1).describe('The client ID for the Fillout OAuth application'),
  clientSecret: z.string().min(1).describe('The client secret for the Fillout OAuth application'),
  redirectUri: z.string().url().describe('The redirect URI for the OAuth flow'),
});

export const tokenResponseSchema = z.object({
  access_token: z.string().describe('The access token for authenticating API requests'),
  base_url: z.string().url().describe('The base URL for making API requests'),
});

export const accessTokenInfoSchema = z.object({
  valid: z.boolean().describe('Whether the access token is valid'),
  userId: z.string().describe('The user ID associated with the access token'),
  organizationId: z.string().describe('The organization ID associated with the access token'),
});
