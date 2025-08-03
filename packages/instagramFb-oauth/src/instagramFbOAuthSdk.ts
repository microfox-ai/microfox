import {
  InstagramFbAuthConfig,
  InstagramFbScope,
} from './types';
import { tokenResponseSchema, errorResponseSchema } from './schemas/index';

export class InstagramFbOAuthSdk {
  private static readonly AUTH_BASE_URL =
    'https://www.facebook.com/v22.0/dialog/oauth';
  private static readonly TOKEN_URL =
    'https://graph.facebook.com/v22.0/oauth/access_token';
  private static readonly LONG_LIVED_TOKEN_URL =
    'https://graph.facebook.com/v22.0/oauth/access_token';
  private static readonly ME_URL =
    'https://graph.facebook.com/v22.0/me/accounts';
  
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];
  private state: string;

  /**
   * Creates a new InstagramFbOAuthSdk instance
   * @param config The configuration object for Instagram FB Business OAuth
   */
  constructor(config: InstagramFbAuthConfig) {
    if (!config.clientId) throw new Error('Client ID is required');
    if (!config.clientSecret) throw new Error('Client Secret is required');
    if (!config.redirectUri) throw new Error('Redirect URI is required');

    try {
      new URL(config.redirectUri);
    } catch {
      throw new Error('Invalid redirect URI');
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scopes = Array.from(
      new Set([
        ...(config.scopes || []),
        InstagramFbScope.INSTAGRAM_BASIC,
        InstagramFbScope.INSTAGRAM_CONTENT_PUBLISH,
        InstagramFbScope.INSTAGRAM_MANAGE_COMMENTS,
        InstagramFbScope.INSTAGRAM_MANAGE_INSIGHTS,
        InstagramFbScope.PAGES_SHOW_LIST,
        InstagramFbScope.PAGES_READ_ENGAGEMENT,
      ]),
    );
    this.state = config.state || this.generateState();
  }

  /**
   * Generates the authorization URL for Instagram FB Business OAuth
   * @param state Optional state parameter to maintain state across the redirect
   * @returns The complete authorization URL
   */
  public getAuthUrl(state?: string): string {
    const authSearchParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: state || this.state,
      scope: this.scopes.join(','),
      response_type: 'code',
      display: 'page',
      extras: JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } }),
    });

    return `${InstagramFbOAuthSdk.AUTH_BASE_URL}?${authSearchParams.toString()}`;
  }

  /**
   * Exchanges an authorization code for access tokens
   * @param code The authorization code received from Instagram's OAuth callback
   * @returns A promise that resolves to the token response containing access_token and refresh_token
   * @throws Error if the token exchange fails
   */
  public async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    dataAccessExpirationTime: number | null;
  }> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    const response = await fetch(InstagramFbOAuthSdk.TOKEN_URL, {
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
        `${error.error}: ${error.error_description || 'Unknown error'}`,
      );
    }

    const tokenResponse = tokenResponseSchema.parse(data);
    
    // Automatically get long-lived token as refresh token
    const longLivedTokenResponse = await this.getLongLivedToken(tokenResponse.access_token);
    
    return {
      accessToken: tokenResponse.access_token,
      refreshToken: longLivedTokenResponse.accessToken,
      expiresIn: tokenResponse.expires_in,
      dataAccessExpirationTime:
        tokenResponse.data_access_expiration_time || null,
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
      grant_type: 'fb_exchange_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      fb_exchange_token: shortLivedToken,
    });

    const response = await fetch(
      `${InstagramFbOAuthSdk.LONG_LIVED_TOKEN_URL}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const error = errorResponseSchema.parse(data);
      throw new Error(
        `${error.error}: ${error.error_description || 'Unknown error'}`,
      );
    }

    const tokenResponse = tokenResponseSchema.parse(data);
    return {
      accessToken: tokenResponse.access_token,
      tokenType: tokenResponse.token_type || 'bearer',
      expiresIn: tokenResponse.expires_in,
    };
  }

  /**
   * Validates an access token by fetching Instagram Business Account information
   * @param accessToken The access token to validate
   * @returns A promise that resolves to the Instagram Business Account information
   * @throws Error if the token is invalid or the request fails
   */
  public async validateAccessToken(accessToken: string): Promise<{
    pageId: string;
    pageName: string;
    pageAccessToken: string;
    instagramAccountId: string;
  }> {
    const response = await fetch(
      `${InstagramFbOAuthSdk.ME_URL}?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to validate access token: ${JSON.stringify(data)}`,
      );
    }

    if (!data.data || data.data.length === 0) {
      throw new Error('No Instagram Business Account found');
    }

    const page = data.data[0];
    return {
      pageId: page.id,
      pageName: page.name,
      pageAccessToken: page.access_token,
      instagramAccountId: page.instagram_business_account?.id,
    };
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

export function createInstagramFbOAuth(config: InstagramFbAuthConfig): InstagramFbOAuthSdk {
  return new InstagramFbOAuthSdk(config);
}
