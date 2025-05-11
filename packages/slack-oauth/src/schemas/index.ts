import { z } from 'zod';

export const slackOAuthConfigSchema = z.object({
  clientId: z.string().describe('The Client ID obtained from the Slack App Management page'),
  clientSecret: z.string().describe('The Client Secret obtained from the Slack App Management page'),
  redirectUri: z.string().url().describe('The URL where Slack will redirect the user after authorization'),
  scopes: z.array(z.string()).describe('Array of scopes requested for the bot token'),
  userScopes: z.array(z.string()).optional().describe('Optional array of scopes requested for the user token'),
  team: z.string().optional().describe('Optional ID of the Slack workspace to authorize against'),
  isGovSlack: z.boolean().optional().describe('Optional flag to use GovSlack endpoints'),
});

const slackTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const slackEnterpriseSchema = z.object({
  id: z.string(),
  name: z.string(),
}).nullable();

const slackAuthedUserSchema = z.object({
  id: z.string(),
  scope: z.string(),
  access_token: z.string(),
  token_type: z.string(),
});

export const slackOAuthResponseSchema = z.object({
  ok: z.boolean(),
  access_token: z.string(),
  token_type: z.string(),
  scope: z.string(),
  bot_user_id: z.string(),
  app_id: z.string(),
  team: slackTeamSchema,
  enterprise: slackEnterpriseSchema,
  authed_user: slackAuthedUserSchema.optional(),
});

export const slackTokenResponseSchema = z.object({
  ok: z.boolean(),
  url: z.string(),
  team: z.string(),
  user: z.string(),
  team_id: z.string(),
  user_id: z.string(),
});

export const slackRevokeResponseSchema = z.object({
  ok: z.boolean(),
  revoked: z.boolean(),
});

