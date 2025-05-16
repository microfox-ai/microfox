import { z } from 'zod';

export const filloutOAuthConfigSchema = z.object({
  clientId: z.string().min(1).describe('The client ID for your Fillout application'),
  clientSecret: z.string().min(1).describe('The client secret for your Fillout application'),
  redirectUri: z.string().url().describe('The redirect URI registered with your Fillout application'),
  state: z.string().optional().describe('An optional state parameter for CSRF protection'),
});

export const authorizationResponseSchema = z.object({
  code: z.string().min(1).describe('The authorization code returned by Fillout'),
  state: z.string().min(1).describe('The state parameter returned by Fillout'),
});

export const tokenResponseSchema = z.object({
  access_token: z.string().min(1).describe('The access token for authenticating API requests'),
  base_url: z.string().url().describe('The base URL for making API requests to Fillout'),
});
