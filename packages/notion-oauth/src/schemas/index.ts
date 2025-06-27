import { z } from 'zod';

export const notionOAuthConfigSchema = z.object({
  clientId: z
    .string()
    .min(1)
    .describe('The client ID for your Notion integration'),
  clientSecret: z
    .string()
    .min(1)
    .describe('The client secret for your Notion integration'),
  redirectUri: z
    .string()
    .url()
    .describe('The redirect URI registered for your Notion integration'),
});

export const notionTokenResponseSchema = z.object({
  access_token: z
    .string()
    .describe(
      'The access token for making authenticated requests to the Notion API',
    ),
  bot_id: z
    .string()
    .optional()
    .describe('The unique identifier for the bot associated with this token'),
  duplicated_template_id: z
    .string()
    .nullable()
    .optional()
    .describe('The ID of the duplicated template, if applicable'),
  owner: z
    .union([
      z.object({
        workspace: z.literal(true),
      }),
      z.object({
        user: z.object({
          object: z.literal('user'),
          id: z.string(),
        }),
      }),
    ])
    .optional()
    .describe('Information about the owner of the token'),
  workspace_icon: z
    .string()
    .optional()
    .describe('The URL of the workspace icon'),
  workspace_id: z.string().optional().describe('The ID of the workspace'),
  workspace_name: z.string().optional().describe('The name of the workspace'),
});
