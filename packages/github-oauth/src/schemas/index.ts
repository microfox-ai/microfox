import { z } from 'zod';

export const githubOAuthConfigSchema = z.object({
  clientId: z
    .string()
    .describe('The Client ID obtained from the GitHub App settings page'),
  clientSecret: z
    .string()
    .describe('The Client Secret obtained from the GitHub App settings page'),
  redirectUri: z
    .string()
    .url()
    .describe('The URL where GitHub will redirect the user after authorization'),
  scopes: z
    .array(z.string())
    .describe('Array of scopes requested for the access token'),
  state: z
    .string()
    .optional()
    .describe('Optional state parameter for CSRF protection'),
  allowSignup: z
    .boolean()
    .optional()
    .describe('Whether or not unauthenticated users will be offered an option to sign up for GitHub during the OAuth flow'),
  login: z
    .string()
    .optional()
    .describe('Suggests a specific account to use for signing in and authorizing the app'),
});

export const githubTokenResponseSchema = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  refresh_token: z.string().optional(),
  refresh_token_expires_in: z.number().optional(),
});

export const githubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string(),
  gravatar_id: z.string().nullable(),
  url: z.string(),
  html_url: z.string(),
  followers_url: z.string(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  received_events_url: z.string(),
  type: z.string(),
  site_admin: z.boolean(),
  name: z.string().nullable(),
  company: z.string().nullable(),
  blog: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  hireable: z.boolean().nullable(),
  bio: z.string().nullable(),
  twitter_username: z.string().nullable(),
  public_repos: z.number(),
  public_gists: z.number(),
  followers: z.number(),
  following: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  private_gists: z.number().optional(),
  total_private_repos: z.number().optional(),
  owned_private_repos: z.number().optional(),
  disk_usage: z.number().optional(),
  collaborators: z.number().optional(),
  two_factor_authentication: z.boolean().optional(),
  plan: z.object({
    name: z.string(),
    space: z.number(),
    private_repos: z.number(),
    collaborators: z.number(),
  }).optional(),
});

export const githubEmailSchema = z.object({
  email: z.string(),
  verified: z.boolean(),
  primary: z.boolean(),
  visibility: z.string().nullable(),
});

export const githubErrorResponseSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
  error_uri: z.string().optional(),
});

export const githubRevokeResponseSchema = z.object({
  // GitHub doesn't return a specific response for successful revocation
  // It returns 204 No Content on success
  status: z.literal('success').optional(),
});

export const githubAuthUrlParamsSchema = z.object({
  client_id: z.string(),
  redirect_uri: z.string(),
  scope: z.string().optional(),
  state: z.string().optional(),
  allow_signup: z.boolean().optional(),
  login: z.string().optional(),
  code_challenge: z.string().optional(),
  code_challenge_method: z.string().optional(),
}); 
