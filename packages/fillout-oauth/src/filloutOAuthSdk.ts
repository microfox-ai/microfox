import { z } from 'zod';
import { FilloutOAuthConfig, AuthorizationResponse, TokenResponse, FilloutOAuthError } from './types';
import { filloutOAuthConfigSchema, authorizationResponseSchema, tokenResponseSchema } from './schemas';

export class FilloutOAuthSdk {
  private config: FilloutOAuthConfig;

  constructor(config: FilloutOAuthConfig) {
    this.config = filloutOAuthConfigSchema.parse(config);
  }

  /**
   * Generates the authorization URL for the OAuth flow.
   * @returns The authorization URL to redirect the user to.
   */
  public getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state: this.generateState(),
    });

    return `https://build.fillout.com/authorize/oauth?${params.toString()}`;
  }

  /**
   * Exchanges the authorization code for an access token.
   * @param code The authorization code received from the redirect.
   * @returns A promise that resolves to the token response.
   */
  public async getAccessToken(code: string): Promise<TokenResponse> {
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
      throw new FilloutOAuthError('Failed to get access token', response.status);
    }

    const data = await response.json();
    return tokenResponseSchema.parse(data);
  }

  /**
   * Validates the authorization response from Fillout.
   * @param params The query parameters from the redirect URL.
   * @returns The parsed authorization response.
   */
  public validateAuthorizationResponse(params: URLSearchParams): AuthorizationResponse {
    const response = authorizationResponseSchema.parse({
      code: params.get('code'),
      state: params.get('state'),
    });

    if (response.state !== this.config.state) {
      throw new FilloutOAuthError('Invalid state parameter', 400);
    }

    return response;
  }

  /**
   * Checks if the provided access token is valid.
   * Note: Fillout doesn't provide a specific endpoint for token validation.
   * This method is a placeholder and should be implemented based on Fillout's API behavior.
   * @param accessToken The access token to validate.
   * @returns A promise that resolves to a boolean indicating if the token is valid.
   */
  public async isAccessTokenValid(accessToken: string): Promise<boolean> {
    // TODO: Implement token validation logic based on Fillout's API behavior
    // For now, we'll assume the token is valid if it's not empty
    return !!accessToken;
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
