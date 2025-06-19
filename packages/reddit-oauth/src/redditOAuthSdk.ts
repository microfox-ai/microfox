import { z } from 'zod';
import {
  RedditOAuthConfig,
  RedditTokenResponse,
  RedditRefreshTokenResponse,
} from './types';
import {
  redditOAuthConfigSchema,
  redditTokenResponseSchema,
  redditRefreshTokenResponseSchema,
} from './schemas';

export class RedditOAuthSdk {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes: string[];
  private authorizationEndpoint = 'https://www.reddit.com/api/v1/authorize';
  private tokenEndpoint = 'https://www.reddit.com/api/v1/access_token';

  constructor(config: RedditOAuthConfig) {
    const validatedConfig = redditOAuthConfigSchema.parse(config);
    this.clientId = validatedConfig.clientId;
    this.clientSecret = validatedConfig.clientSecret;
    this.redirectUri = validatedConfig.redirectUri || '';
    this.scopes = validatedConfig.scopes;
  }

  /**
   * Generates the authorization URL for Reddit OAuth
   * @param state Optional state parameter to maintain state across the redirect
   * @param duration The duration of the token (temporary or permanent)
   * @returns The complete authorization URL
   */
  public getAuthorizationUrl(
    state: string,
    duration: 'temporary' | 'permanent' = 'permanent',
  ): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      state,
      redirect_uri: this.redirectUri,
      duration,
      scope: this.scopes.join(','),
    });

    return `${this.authorizationEndpoint}?${params.toString()}`;
  }

  /**
   * Generates the authorization URL for Reddit OAuth
   * @returns The complete authorization URL
   */
  public getAuthUrl(): string {
    const state = `${Math.random().toString(36).substring(2, 15)}`;
    const duration = 'permanent';
    return this.getAuthorizationUrl(state, duration);
  }

  /**
   * Exchanges an authorization code for access and refresh tokens
   * @param code The authorization code received from Reddit's OAuth callback
   * @returns A promise that resolves to the token response containing access_token and refresh_token
   * @throws Error if the token exchange fails
   */
  public async getAccessToken(code: string): Promise<RedditTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
    });

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return redditTokenResponseSchema.parse(data);
  }

  /**
   * Refreshes an access token using a refresh token
   * @param refreshToken The refresh token to use for token refresh
   * @returns A promise that resolves to the refreshed token response
   * @throws Error if the token refresh fails
   */
  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<RedditRefreshTokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return redditRefreshTokenResponseSchema.parse(data);
  }

  public async validateAccessToken(accessToken: string): Promise<boolean> {
    const response = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.ok;
  }

  public async revokeToken(
    token: string,
    tokenTypeHint?: 'access_token' | 'refresh_token',
  ): Promise<void> {
    const params = new URLSearchParams({
      token,
      token_type_hint: tokenTypeHint || '',
    });

    const response = await fetch('https://www.reddit.com/api/v1/revoke_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Exchanges an authorization code for access and refresh tokens
   * @param code The authorization code received from Reddit's OAuth callback
   * @returns A promise that resolves to the token response containing access_token and refresh_token
   * @throws Error if the token exchange fails
   */
  public async exchangeCodeForTokens(
    code: string,
  ): Promise<RedditTokenResponse> {
    try {
      const tokenResponse = await this.getAccessToken(code);

      // Validate the access token to ensure its working
      const isValid = await this.validateAccessToken(
        tokenResponse.access_token,
      );
      if (!isValid) {
        throw new Error('Received invalid access token from Reddit');
      }

      return tokenResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to exchange code for tokens: ${error.message}`);
      }
      throw new Error('Failed to exchange code for tokens: Unknown error');
    }
  }
}

export function createRedditOAuth(config: RedditOAuthConfig): RedditOAuthSdk {
  return new RedditOAuthSdk(config);
}
