import { z } from 'zod';
import {
  githubOAuthConfigSchema,
  githubTokenResponseSchema,
  githubUserSchema,
  githubEmailSchema,
  githubErrorResponseSchema,
  githubRevokeResponseSchema,
  githubAuthUrlParamsSchema,
} from '../schemas';

export type GitHubOAuthConfig = z.infer<typeof githubOAuthConfigSchema>;
export type GitHubTokenResponse = z.infer<typeof githubTokenResponseSchema>;
export type GitHubUser = z.infer<typeof githubUserSchema>;
export type GitHubEmail = z.infer<typeof githubEmailSchema>;
export type GitHubErrorResponse = z.infer<typeof githubErrorResponseSchema>;
export type GitHubRevokeResponse = z.infer<typeof githubRevokeResponseSchema>;
export type GitHubAuthUrlParams = z.infer<typeof githubAuthUrlParamsSchema>;

export interface GitHubOAuthResponse extends GitHubTokenResponse {
  user?: GitHubUser;
  emails?: GitHubEmail[];
}

export interface GitHubIdentityInfo {
  user: GitHubUser;
  emails?: GitHubEmail[];
}

export interface PKCEParams {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
} 
