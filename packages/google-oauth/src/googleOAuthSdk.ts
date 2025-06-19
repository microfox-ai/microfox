import { GoogleScope } from './types';
import {
  tokenResponseSchema,
  errorResponseSchema,
  TokenResponse,
  GoogleAuthConfig,
  IdentityInfo,
  TokenResponseOutput,
} from './schemas/index';

export class GoogleOAuthSdk {
  private static readonly AUTH_BASE_URL =
    'https://accounts.google.com/o/oauth2/v2/auth';
  private static readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private static readonly TOKEN_INFO_URL =
    'https://oauth2.googleapis.com/tokeninfo';
  private static readonly USER_INFO_URL =
    'https://www.googleapis.com/oauth2/v3/userinfo';
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];
  private state: string;

  constructor(config: Partial<GoogleAuthConfig>) {
    // Validate required fields
    if (!config.clientId) throw new Error('Client ID is required');
    if (!config.clientSecret) throw new Error('Client Secret is required');

    if (config.redirectUri) {
      try {
        new URL(config.redirectUri);
      } catch {
        throw new Error('Invalid redirect URI');
      }
    }

    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri || '';
    this.scopes = Array.from(
      new Set([
        ...(config.scopes || []),
        GoogleScope.OPENID,
        GoogleScope.EMAIL,
        GoogleScope.PROFILE,
      ]),
    );
    this.state = config.state || this.generateState();
  }

  /**
   * Get the current state parameter
   */
  public async getState(): Promise<string> {
    return this.state;
  }

  /**
   * Get the authorization URL for OAuth 2.0 flow
   */
  public getAuthUrl(): string {
    const authSearchParams = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      state: this.state,
      access_type: 'offline', // To receive a refresh token
      prompt: 'consent',
    });

    return `${GoogleOAuthSdk.AUTH_BASE_URL}?${authSearchParams.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   * @param code The authorization code received from Google
   * @returns Object containing the access token and refresh token
   */
  public async exchangeCodeForTokens(
    code: string,
  ): Promise<TokenResponseOutput> {
    const tokenResponse = await this.getAccessAndRefreshTokens(code);
    return {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token || null,
      idToken: tokenResponse.id_token || null,
      expiresIn: tokenResponse.expires_in,
    };
  }

  /**
   * Refresh an expired access token using a refresh token
   * @param refreshToken The refresh token obtained during initial authorization
   * @returns New access token and optionally a new refresh token
   * @throws Error if refresh token is invalid or expired
   */
  public async refreshAccessToken(
    refreshToken: string,
  ): Promise<TokenResponseOutput> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch(GoogleOAuthSdk.TOKEN_URL, {
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
      refreshToken: tokenResponse.refresh_token || null,
      idToken: tokenResponse.id_token || null,
      expiresIn: tokenResponse.expires_in,
    };
  }

  /**
   * Validate an access token by checking its validity and expiration
   * @param accessToken The access token to validate
   * @returns Object containing validation result and token information
   */
  public async validateAccessToken(accessToken: string): Promise<{
    isValid: boolean;
    expiresAt?: number;
    scopes?: string[];
    email?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `${GoogleOAuthSdk.TOKEN_INFO_URL}?access_token=${accessToken}`,
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          isValid: false,
          error: data.error_description || 'Token validation failed',
        };
      }

      // Check if token is expired
      const expiresAt = data.exp ? parseInt(data.exp) * 1000 : undefined;
      const isExpired = expiresAt ? Date.now() >= expiresAt : false;

      return {
        isValid: !isExpired,
        expiresAt,
        scopes: data.scope ? data.scope.split(' ') : undefined,
        email: data.email,
      };
    } catch (error) {
      return {
        isValid: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error during token validation',
      };
    }
  }

  /**
   * Decodes an ID token to extract user identity information.
   * NOTE: This method does NOT validate the token's signature. It only decodes the payload.
   * It is highly recommended to validate the token on your server before trusting its content.
   *
   * @param idToken The ID token (JWT) to decode.
   * @returns The user's identity information from the token payload.
   * @throws Error if the token is malformed or cannot be decoded.
   */
  public getIdentityInfo(idToken: string): IdentityInfo {
    try {
      const payloadBase64Url = idToken.split('.')[1];
      if (!payloadBase64Url) {
        throw new Error('Invalid ID token: missing payload');
      }

      // In a Node.js environment, use Buffer for robust Base64URL decoding.
      if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
        const payloadJson = Buffer.from(payloadBase64Url, 'base64url').toString(
          'utf8',
        );
        return JSON.parse(payloadJson) as IdentityInfo;
      }

      // In browser environments, use atob and a polyfill-like approach for UTF-8 handling.
      if (typeof atob === 'function') {
        let base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = 4 - (base64.length % 4);
        if (padLength < 4) {
          base64 += '='.repeat(padLength);
        }

        const decoded = atob(base64);
        const utf8Decoded = decodeURIComponent(
          decoded
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
        return JSON.parse(utf8Decoded) as IdentityInfo;
      }

      throw new Error(
        'No compatible Base64URL decoding method found in this environment.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error during token decoding';
      throw new Error(`Failed to decode ID token: ${message}`);
    }
  }

  /**
   * Fetches user profile information from Google's userinfo endpoint.
   * @param accessToken The access token obtained during authorization.
   * @returns User profile information.
   * @throws Error if the access token is invalid or the request fails.
   */
  public static async getUserInfo(accessToken: string): Promise<IdentityInfo> {
    try {
      const response = await fetch(GoogleOAuthSdk.USER_INFO_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error?.message ||
          data?.error_description ||
          'Failed to fetch user info';
        throw new Error(errorMessage);
      }

      return data as IdentityInfo;
    } catch (error) {
      throw new Error(`Failed to fetch user info: ${error}`);
    }
  }

  /**
   * Internal method to get access token from authorization code
   * @param code The authorization code received from Google
   * @returns Google token response containing access token and optional refresh token
   */
  private async getAccessAndRefreshTokens(
    code: string,
  ): Promise<TokenResponse> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch(GoogleOAuthSdk.TOKEN_URL, {
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

    return tokenResponseSchema.parse(data);
  }

  /**
   * Generate a random state parameter for CSRF protection
   */
  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
