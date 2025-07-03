import { z } from 'zod';

export const redditOAuthConfigSchema = z.object({
  clientId: z
    .string()
    .describe('The client ID obtained during app registration'),
  clientSecret: z
    .string()
    .describe('The client secret obtained during app registration'),
  redirectUri: z
    .string()
    .describe('The redirect URI registered for your application')
    .optional(),
  scopes: z
    .array(z.string())
    .optional()
    .describe('An array of scopes required for your application'),
});

export const redditTokenResponseSchema = z.object({
  access_token: z
    .string()
    .describe('The access token for making authenticated requests'),
  token_type: z.string().describe('The type of token, usually "bearer"'),
  expires_in: z
    .number()
    .describe('The number of seconds until the access token expires'),
  scope: z.string().describe('A comma-separated list of granted scopes'),
  refresh_token: z
    .string()
    .optional()
    .describe('The refresh token for obtaining a new access token'),
});

export const redditAuthorizationResponseSchema = z.object({
  code: z.string().describe('The authorization code returned by Reddit'),
  state: z
    .string()
    .describe('The state parameter used to prevent CSRF attacks'),
});

export const redditRefreshTokenResponseSchema = z.object({
  access_token: z.string().describe('The new access token'),
  token_type: z.string().describe('The type of token, usually "bearer"'),
  expires_in: z
    .number()
    .describe('The number of seconds until the new access token expires'),
  scope: z.string().describe('A comma-separated list of granted scopes'),
});

export const redditErrorResponseSchema = z.object({
  error: z.string().describe('The error code'),
  error_description: z
    .string()
    .optional()
    .describe('A human-readable description of the error'),
});
