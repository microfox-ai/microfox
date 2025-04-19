import { z } from 'zod';

export const XOAuthConfigSchema = z.object({
  clientId: z.string().min(1).describe('The client ID obtained from the X developer portal'),
  clientSecret: z.string().min(1).describe('The client secret obtained from the X developer portal'),
  redirectUri: z.string().url().describe('The redirect URI registered in the X developer portal'),
});

export const XOAuthTokensSchema = z.object({
  accessToken: z.string().min(1).describe('The access token for making authenticated requests'),
  tokenType: z.string().min(1).describe('The type of token, usually "bearer"'),
  expiresIn: z.number().optional().describe('The number of seconds until the access token expires'),
  refreshToken: z.string().optional().describe('The refresh token for obtaining a new access token'),
  scope: z.string().optional().describe('The scopes granted to the access token'),
});

export const XOAuthCodeVerifierSchema = z.object({
  codeVerifier: z.string().min(43).max(128).describe('The code verifier used in the PKCE flow'),
});

export const XOAuthAuthorizationResponseSchema = z.object({
  code: z.string().min(1).describe('The authorization code returned by X'),
  state: z.string().min(1).describe('The state parameter returned by X, should match the one sent in the request'),
});

export const XOAuthTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
  scope: z.string().optional(),
});

export const XOAuthRevokeResponseSchema = z.object({
  revoked: z.boolean().describe('Indicates whether the token was successfully revoked'),
});

export const XOAuthScopeSchema = z.enum([
  'tweet.read',
  'tweet.write',
  'tweet.moderate.write',
  'users.email',
  'users.read',
  'follows.read',
  'follows.write',
  'offline.access',
  'space.read',
  'mute.read',
  'mute.write',
  'like.read',
  'like.write',
  'list.read',
  'list.write',
  'block.read',
  'block.write',
  'bookmark.read',
  'bookmark.write',
  'media.write',
]);
