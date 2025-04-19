import { z } from 'zod';
import {
  XOAuthConfig,
  XOAuthTokens,
  XOAuthCodeVerifier,
  XOAuthTokenResponse,
  XOAuthRevokeResponse,
} from './types';
import {
  XOAuthConfigSchema,
  XOAuthTokensSchema,
  XOAuthCodeVerifierSchema,
  XOAuthTokenResponseSchema,
  XOAuthRevokeResponseSchema,
} from './schemas';

/**
 * SDK for handling X (formerly Twitter) OAuth 2.0 authentication flows
 */
export class XOAuthSdk {
  private static readonly AUTHORIZE_URL = 'https://x.com/i/oauth2/authorize';
  private static readonly TOKEN_URL = 'https://api.x.com/2/oauth2/token';
  private static readonly REVOKE_URL = 'https://api.x.com/2/oauth2/revoke';
  private static readonly USER_INFO_URL = 'https://api.x.com/2/users/me';

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  /**
   * Creates a new instance of XOAuthSdk
   * @param config - Configuration object containing client credentials and redirect URI
   * @throws {Error} If the configuration is invalid
   */
  constructor(config: XOAuthConfig) {
    const validatedConfig = XOAuthConfigSchema.parse(config);
    this.clientId = validatedConfig.clientId;
    this.clientSecret = validatedConfig.clientSecret;
    this.redirectUri = validatedConfig.redirectUri;
  }

  /**
   * Makes an HTTP request and validates the response against a schema
   * @private
   * @param url - The URL to make the request to
   * @param options - Request options
   * @param responseSchema - Zod schema to validate the response against
   * @returns The validated response data
   * @throws {Error} If the request fails or the response is invalid
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    responseSchema: z.ZodType<T>,
  ): Promise<T> {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseSchema.parse(data);
  }

  /**
   * Generates a random state value for OAuth flow
   * @returns An object containing the generated state value
   * @example
   * const { codeVerifier } = sdk.generateState();
   */
  public generateState(): XOAuthCodeVerifier {
    const verifier = crypto
      .getRandomValues(new Uint8Array(32))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    return XOAuthCodeVerifierSchema.parse({ codeVerifier: verifier });
  }

  /**
   * Generates a code challenge from a code verifier using SHA-256
   * @param codeVerifier - The code verifier to generate the challenge from
   * @returns The generated code challenge
   * @example
   * const challenge = await sdk.generateCodeChallenge(verifier);
   */
  public async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * Generates the authorization URL for the OAuth flow
   * @param scopes - Array of OAuth scopes to request
   * @param state - State parameter for CSRF protection
   * @param codeChallenge - The code challenge generated from the verifier
   * @returns The complete authorization URL
   * @example
   * const url = sdk.getAuthUrl(['tweet.read', 'users.read'], state, challenge);
   */
  public getAuthUrl(
    scopes: string[],
    state: string,
    codeChallenge: string,
  ): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    return `${XOAuthSdk.AUTHORIZE_URL}?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for access and refresh tokens
   * @param code - The authorization code received from the callback
   * @param codeVerifier - The code verifier used to generate the challenge
   * @returns An object containing the access and refresh tokens
   * @throws {Error} If the exchange fails
   * @example
   * const tokens = await sdk.exchangeCodeForTokens(code, verifier);
   */
  public async exchangeCodeForTokens(
    code: string,
    codeVerifier: string,
  ): Promise<XOAuthTokens> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier,
    });

    const response = await this.makeRequest<XOAuthTokenResponse>(
      XOAuthSdk.TOKEN_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
        body: params.toString(),
      },
      XOAuthTokenResponseSchema,
    );

    return XOAuthTokensSchema.parse(response);
  }

  /**
   * Refreshes an access token using a refresh token
   * @param refreshToken - The refresh token to use
   * @returns An object containing the new access and refresh tokens
   * @throws {Error} If the refresh fails
   * @example
   * const newTokens = await sdk.refreshAccessToken(refreshToken);
   */
  public async refreshAccessToken(refreshToken: string): Promise<XOAuthTokens> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const response = await this.makeRequest<XOAuthTokenResponse>(
      XOAuthSdk.TOKEN_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
        body: params.toString(),
      },
      XOAuthTokenResponseSchema,
    );

    return XOAuthTokensSchema.parse(response);
  }

  /**
   * Revokes an access or refresh token
   * @param token - The token to revoke
   * @param tokenTypeHint - Optional hint about the token type
   * @returns The revocation response
   * @throws {Error} If the revocation fails
   * @example
   * await sdk.revokeToken(accessToken, 'access_token');
   */
  public async revokeToken(
    token: string,
    tokenTypeHint?: 'access_token' | 'refresh_token',
  ): Promise<XOAuthRevokeResponse> {
    const params = new URLSearchParams({
      token,
      ...(tokenTypeHint && { token_type_hint: tokenTypeHint }),
    });

    return this.makeRequest<XOAuthRevokeResponse>(
      XOAuthSdk.REVOKE_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
        },
        body: params.toString(),
      },
      XOAuthRevokeResponseSchema,
    );
  }

  /**
   * Validates an access token by making a request to the user info endpoint
   * @param accessToken - The access token to validate
   * @returns True if the token is valid, false otherwise
   * @example
   * const isValid = await sdk.validateAccessToken(accessToken);
   */
  public async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(XOAuthSdk.USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gets client credentials token for application-only authentication
   * @param apiKey - The API key
   * @param apiSecretKey - The API secret key
   * @returns An object containing the access token
   * @throws {Error} If the request fails
   * @example
   * const tokens = await sdk.getClientCredentials(apiKey, apiSecretKey);
   */
  public async getClientCredentials(
    apiKey: string,
    apiSecretKey: string,
  ): Promise<XOAuthTokens> {
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
    });

    const response = await this.makeRequest<XOAuthTokenResponse>(
      XOAuthSdk.TOKEN_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecretKey}`).toString('base64')}`,
        },
        body: params.toString(),
      },
      XOAuthTokenResponseSchema,
    );

    return XOAuthTokensSchema.parse(response);
  }
}

/**
 * Creates a new instance of XOAuthSdk
 * @param config - Configuration object containing client credentials and redirect URI
 * @returns A new instance of XOAuthSdk
 * @example
 * const sdk = createXOAuth({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret',
 *   redirectUri: 'https://your-app.com/callback'
 * });
 */
export function createXOAuth(config: XOAuthConfig): XOAuthSdk {
  return new XOAuthSdk(config);
}
