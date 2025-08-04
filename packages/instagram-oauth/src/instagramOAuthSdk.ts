import { InstagramAuthConfig, InstagramScope } from './types';
import { tokenResponseSchema, errorResponseSchema } from './schemas/index';

export class InstagramOAuthSdk {
  private static readonly AUTH_BASE_URL =
    'https://www.instagram.com/oauth/authorize';
  private static readonly TOKEN_URL =
    'https://api.instagram.com/oauth/access_token';
  private static readonly LONG_LIVED_TOKEN_URL =
    'https://graph.instagram.com/access_token';
  private static readonly REFRESH_TOKEN_URL =
    'https://graph.instagram.com/refresh_access_token';

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri?: string;
  private readonly scopes: string[];
  private state: string;

  /**
   * Creates a new InstagramOAuthSdk instance
   * @param config The configuration object for Instagram Business OAuth
   */
  constructor(config: InstagramAuthConfig) {
    if (!config.clientId) throw new Error('Client ID is required');
    if (!config.clientSecret) throw new Error('Client Secret is required');

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scopes = Array.from(
      new Set([
        ...(config.scopes || []),
        InstagramScope.INSTAGRAM_BUSINESS_BASIC,
      ]),
    );
    this.state = config.state || this.generateState();
  }

  /**
   * Generates the authorization URL for Instagram Business OAuth
   * @param state Optional state parameter to maintain state across the redirect
   * @returns The complete authorization URL
   */
  public getAuthUrl(state?: string): string {
    const authSearchParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri || '',
      response_type: 'code',
      scope: this.scopes.join(','),
      state: state || this.state,
    });

    return `${InstagramOAuthSdk.AUTH_BASE_URL}?${authSearchParams.toString()}`;
  }

  /**
   * Exchanges an authorization code for a long-lived access token
   * @param code The authorization code received from Instagram's OAuth callback
   * @returns A promise that resolves to the token response containing long-lived access_token
   * @throws Error if the token exchange fails
   */
  public async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    userId: string;
    permissions: string[];
  }> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this.redirectUri || '',
      code,
    });

    const response = await fetch(InstagramOAuthSdk.TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = errorResponseSchema.parse(data);
      throw new Error(
        `${error.error_type}: ${error.error_message || 'Unknown error'}`,
      );
    }

    const tokenResponse = tokenResponseSchema.parse(data);
    
    // Automatically get long-lived token
    const longLivedTokenResponse = await this.getLongLivedToken(tokenResponse.access_token);
    
    return {
      accessToken: longLivedTokenResponse.accessToken,
      userId: tokenResponse.user_id.toString(),
      permissions: tokenResponse.permissions,
    };
  }

  /**
   * Converts a short-lived token to a long-lived token
   * @param shortLivedToken The short-lived access token
   * @returns A promise that resolves to the long-lived token response
   * @throws Error if the token exchange fails
   */
  public async getLongLivedToken(shortLivedToken: string): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: this.clientSecret,
      access_token: shortLivedToken,
    });

    const response = await fetch(
      `${InstagramOAuthSdk.LONG_LIVED_TOKEN_URL}?${params.toString()}`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to get long-lived token: ${data.error_message || 'Unknown error'}`,
      );
    }

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refreshes a long-lived token (extends the token's validity)
   * @param longLivedToken The long-lived access token to refresh
   * @returns A promise that resolves to the refreshed token response
   * @throws Error if the token refresh fails
   */
  public async refreshToken(longLivedToken: string): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const params = new URLSearchParams({
      grant_type: 'ig_refresh_token',
      access_token: longLivedToken,
    });

    const response = await fetch(
      `${InstagramOAuthSdk.REFRESH_TOKEN_URL}?${params.toString()}`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to refresh token: ${data.error_message || 'Unknown error'}`,
      );
    }

    return {
      accessToken: data.access_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Validates an access token by making a request to the Instagram API
   * @param token The access token to validate
   * @returns A promise that resolves to the user information
   * @throws Error if the token is invalid or the request fails
   */
  public async validateAccessToken(token: string): Promise<{
    userId: string;
    username: string;
  }> {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${token}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      userId: data.id,
      username: data.username,
    };
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

export function createInstagramOAuth(config: InstagramAuthConfig): InstagramOAuthSdk {
  return new InstagramOAuthSdk(config);
}
