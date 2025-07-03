import { z } from 'zod';
import crypto from 'crypto';
import {
  NotionOAuthConfig,
  NotionTokenResponse,
  NotionAPIError,
} from './types';
import { notionOAuthConfigSchema, notionTokenResponseSchema } from './schemas';

export class NotionOAuthSdk {
  private config: NotionOAuthConfig;

  constructor(config: NotionOAuthConfig) {
    this.config = notionOAuthConfigSchema.parse(config);
  }

  /**
   * Generates the authorization URL for the Notion OAuth flow.
   * @param state Optional state parameter for CSRF protection
   * @returns The authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || '/callback',
      response_type: 'code',
      owner: 'user',
    });

    if (state) {
      params.append('state', state);
    } else {
      params.append('state', this.generateState());
    }

    return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param code The authorization code received from Notion
   * @returns A promise that resolves to the token response
   */
  async exchangeCodeForTokens(code: string): Promise<NotionTokenResponse> {
    const tokenEndpoint = 'https://api.notion.com/v1/oauth/token';
    const headers = new Headers({
      Authorization: `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    });

    const body = JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
    });

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        throw await this.handleApiError(response);
      }

      const data = await response.json();
      return notionTokenResponseSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid token response: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validates an access token by making a test request to the Notion API.
   * @param accessToken The access token to validate
   * @returns A promise that resolves to true if the token is valid, false otherwise
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    const testEndpoint = 'https://api.notion.com/v1/users/me';
    const headers = new Headers({
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    });

    try {
      const response = await fetch(testEndpoint, { headers });
      return response.ok;
    } catch (error) {
      console.error('Error validating access token:', error);
      return false;
    }
  }

  /**
   * Generates a random state string for CSRF protection.
   * @returns A random state string
   */
  private generateState(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Handles API errors by parsing the response and throwing a custom error.
   * @param response The fetch Response object
   * @returns A promise that rejects with a NotionAPIError
   */
  private async handleApiError(response: Response): Promise<never> {
    const errorData = await response.json();
    throw new NotionAPIError(
      errorData.error || 'Unknown error',
      response.status,
      errorData.error_description,
    );
  }
}
