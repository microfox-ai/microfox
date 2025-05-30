import {
  InstagramFbBusinessAuthConfig,
  InstagramFbBusinessScope,
} from './types';
import { tokenResponseSchema, errorResponseSchema } from './schemas/index';

export class InstagramFbBusinessOAuthSdk {
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

  constructor(config: InstagramFbBusinessAuthConfig) {
    if (!config.clientId) throw new Error('Client ID is required');
    if (!config.clientSecret) throw new Error('Client Secret is required');
    if (!config.redirectUri) throw new Error('Redirect URI is required');

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.scopes = Array.from(
      new Set([
        ...(config.scopes || []),
        InstagramFbBusinessScope.INSTAGRAM_BASIC,
        InstagramFbBusinessScope.INSTAGRAM_CONTENT_PUBLISH,
        InstagramFbBusinessScope.INSTAGRAM_MANAGE_COMMENTS,
        InstagramFbBusinessScope.INSTAGRAM_MANAGE_INSIGHTS,
        InstagramFbBusinessScope.PAGES_SHOW_LIST,
        InstagramFbBusinessScope.PAGES_READ_ENGAGEMENT,
      ]),
    );
    this.state = config.state || this.generateState();
  }

  public getAuthUrl(): string {
    const authSearchParams = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: this.state,
      scope: this.scopes.join(','),
      response_type: 'code',
      display: 'page',
      extras: JSON.stringify({ setup: { channel: 'IG_API_ONBOARDING' } }),
    });

    return `${InstagramFbBusinessOAuthSdk.AUTH_BASE_URL}?${authSearchParams.toString()}`;
  }

  public async exchangeCodeForTokens(code: string): Promise<{
    accessToken: string;
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

    const response = await fetch(InstagramFbBusinessOAuthSdk.TOKEN_URL, {
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
    return {
      accessToken: tokenResponse.access_token,
      expiresIn: tokenResponse.expires_in,
      dataAccessExpirationTime:
        tokenResponse.data_access_expiration_time || null,
    };
  }

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
      `${InstagramFbBusinessOAuthSdk.LONG_LIVED_TOKEN_URL}?${params.toString()}`,
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

  public async getInstagramBusinessAccount(accessToken: string): Promise<{
    pageId: string;
    pageName: string;
    pageAccessToken: string;
    instagramBusinessAccountId: string;
  }> {
    const response = await fetch(
      `${InstagramFbBusinessOAuthSdk.ME_URL}?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Instagram Business Account: ${JSON.stringify(data)}`,
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
      instagramBusinessAccountId: page.instagram_business_account?.id,
    };
  }

  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
