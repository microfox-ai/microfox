import { z } from 'zod';

export interface NotionOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
}

export interface NotionTokenResponse {
  access_token: string;
  bot_id: string;
  duplicated_template_id: string | null;
  owner:
    | {
        workspace: boolean;
      }
    | {
        user: {
          object: 'user';
          id: string;
        };
      };
  workspace_icon: string;
  workspace_id: string;
  workspace_name: string;
}

export class NotionAPIError extends Error {
  constructor(
    public readonly error: string,
    public readonly statusCode: number,
    public readonly errorDescription?: string,
  ) {
    super(`Notion API Error: ${error}`);
    this.name = 'NotionAPIError';
  }
}

export type { z };
