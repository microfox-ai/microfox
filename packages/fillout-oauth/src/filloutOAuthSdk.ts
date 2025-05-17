import { z } from 'zod';
import { FilloutOAuthConfig, TokenResponse, AccessTokenInfo } from './types';
import { configSchema, tokenResponseSchema } from './schemas';

export class FilloutOAuthSdk {
  private config: FilloutOAuthConfig;
  private baseUrl: string = 'https://api.fillout.com';

  constructor(config: FilloutOAuthConfig) {
    this.config = configSchema.parse(config);
  }

  /**
   * Generates the authorization URL for the OAuth flow.
   * @param state An optional state parameter for CSRF protection
   * @returns The authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      ...(state && { state }),
    });

    return `https://build.fillout.com/authorize/oauth?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for an access token.
   * @param code The authorization code received from the redirect
   * @returns A promise resolving to the token response
   */
  async getAccessToken(code: string): Promise<TokenResponse> {
    const response = await fetch('https://server.fillout.com/public/oauth/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return tokenResponseSchema.parse(data);
  }

  /**
   * Invalidates an access token.
   * @param accessToken The access token to invalidate
   */
  async invalidateToken(accessToken: string): Promise<void> {
    const response = await fetch('https://server.fillout.com/public/oauth/invalidate', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to invalidate token: ${response.statusText}`);
    }
  }

  /**
   * Checks if an access token is valid.
   * @param accessToken The access token to check
   * @returns A promise resolving to the access token info if valid, or null if invalid
   */
  async checkAccessToken(accessToken: string): Promise<AccessTokenInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return {
        valid: true,
        userId: data.userId,
        organizationId: data.organizationId,
      };
    } catch (error) {
      console.error('Error checking access token:', error);
      return null;
    }
  }

  /**
   * Sets the base URL for API requests.
   * @param url The new base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
}

export function createFilloutOAuth(config: FilloutOAuthConfig): FilloutOAuthSdk {
  return new FilloutOAuthSdk(config);
}
