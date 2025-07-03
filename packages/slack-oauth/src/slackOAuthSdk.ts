import { z } from 'zod';
import {
  SlackOAuthConfig,
  SlackOAuthResponse,
  SlackTokenResponse,
  SlackRevokeResponse,
} from './types';
import {
  slackOAuthConfigSchema,
  slackOAuthResponseSchema,
  slackTokenResponseSchema,
  slackRevokeResponseSchema,
} from './schemas';

export class SlackOAuthSdk {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes: string[];
  private userScopes?: string[];
  private team?: string;
  private isGovSlack: boolean;

  /**
   * Creates a new SlackOAuthSdk instance
   * @param config The configuration object for Slack OAuth
   */
  constructor(config: SlackOAuthConfig) {
    const validatedConfig = slackOAuthConfigSchema.parse(config);
    this.clientId = validatedConfig.clientId;
    this.clientSecret = validatedConfig.clientSecret;
    this.redirectUri = validatedConfig.redirectUri;
    this.scopes = validatedConfig.scopes;
    this.userScopes = validatedConfig.userScopes;
    this.team = validatedConfig.team;
    this.isGovSlack = validatedConfig.isGovSlack || false;
  }

  //not-added  = single_channel=0&install_redirect=&tracked=1&team=

  /**
   * Generates the authorization URL for Slack OAuth
   * @param state Optional state parameter to maintain state across the redirect
   * @returns The complete authorization URL
   */
  public getAuthUrl(state?: string): string {
    const baseUrl = this.isGovSlack
      ? 'https://slack-gov.com/oauth/v2/authorize'
      : 'https://slack.com/oauth/v2/authorize';

    const scopes = [...this.scopes, 'team:read'].join(',');

    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: scopes,
      user_scope: this.userScopes?.join(',') ?? '',
      redirect_uri: this.redirectUri,
      granular_bot_scope: '1',
    });

    if (this.team) {
      params.append('team', this.team);
    }

    if (state) {
      params.append('state', state);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for access and refresh tokens
   * @param code The authorization code received from Slack's OAuth callback
   * @returns A promise that resolves to the token response containing access_token and refresh_token
   * @throws Error if the token exchange fails
   */
  public async exchangeCodeForTokens(
    code: string,
  ): Promise<SlackOAuthResponse> {
    const url = 'https://slack.com/api/oauth.v2.access';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return slackOAuthResponseSchema.parse(data);
  }

  /**
   * Validates an access token by making a request to the Slack API's auth.test endpoint
   * @param token The access token to validate
   * @returns A promise that resolves to the token response containing the user's ID and team ID
   * @throws Error if the token is invalid or the request fails
   */
  public async validateAccessToken(token: string): Promise<SlackTokenResponse> {
    const url = 'https://slack.com/api/auth.test';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return slackTokenResponseSchema.parse(data);
  }

  /**
   * Revokes an access token by making a request to the Slack API's auth.revoke endpoint
   * @param token The access token to revoke
   * @returns A promise that resolves to the revoke response
   * @throws Error if the token is invalid or the request fails
   */
  public async revokeToken(token: string): Promise<SlackRevokeResponse> {
    const url = 'https://slack.com/api/auth.revoke';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return slackRevokeResponseSchema.parse(data);
  }
}

export function createSlackOAuth(config: SlackOAuthConfig): SlackOAuthSdk {
  return new SlackOAuthSdk(config);
}
