import { z } from 'zod';
import { slackOAuthConfigSchema, slackOAuthResponseSchema, slackTokenResponseSchema, slackRevokeResponseSchema } from '../schemas';

export type SlackOAuthConfig = z.infer<typeof slackOAuthConfigSchema>;
export type SlackOAuthResponse = z.infer<typeof slackOAuthResponseSchema>;
export type SlackTokenResponse = z.infer<typeof slackTokenResponseSchema>;
export type SlackRevokeResponse = z.infer<typeof slackRevokeResponseSchema>;

export type SlackTeam = {
  id: string;
  name: string;
};

export type SlackEnterprise = {
  id: string;
  name: string;
} | null;

export type SlackAuthedUser = {
  id: string;
  scope: string;
  access_token: string;
  token_type: string;
};

