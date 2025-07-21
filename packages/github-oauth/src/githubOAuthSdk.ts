import { z } from 'zod';
import {
  GitHubOAuthConfig,
  GitHubTokenResponse,
  GitHubOAuthResponse,
  GitHubUser,
  GitHubEmail,
  GitHubIdentityInfo,
  PKCEParams,
} from './types';
import {
  githubOAuthConfigSchema,
  githubTokenResponseSchema,
  githubUserSchema,
  githubEmailSchema,
  githubErrorResponseSchema,
} from './schemas';

export class GitHubOAuthSdk {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes: string[];
  private state?: string;
  private allowSignup?: boolean;
  private login?: string;

  /**
   * Creates a new GitHubOAuthSdk instance
   * @param config The configuration object for GitHub OAuth
   */
  constructor(config: GitHubOAuthConfig) {
    const validatedConfig = githubOAuthConfigSchema.parse(config);
    this.clientId = validatedConfig.clientId;
    this.clientSecret = validatedConfig.clientSecret;
    this.redirectUri = validatedConfig.redirectUri;
    this.scopes = validatedConfig.scopes;
    this.state = validatedConfig.state;
    this.allowSignup = validatedConfig.allowSignup;
    this.login = validatedConfig.login;
  }

  /**
   * Generates a cryptographically secure random string for PKCE
   * @param length The length of the code verifier (43-128 characters)
   * @returns A URL-safe base64 encoded string
   */
  private generateCodeVerifier(length: number = 128): string {
    const array = new Uint8Array(Math.ceil(length * 3 / 4));
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...Array.from(array)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .substring(0, length);
  }

  /**
   * Generates a code challenge from a code verifier using SHA256
   * @param codeVerifier The code verifier string
   * @returns A promise that resolves to the base64url-encoded SHA256 hash
   */
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(digest);
    return btoa(String.fromCharCode(...Array.from(hashArray)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  /**
   * Generates PKCE parameters for enhanced security
   * @returns A promise that resolves to PKCE parameters
   */
  public async generatePKCEParams(): Promise<PKCEParams> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    return {
      codeVerifier,
      codeChallenge,
      codeChallengeMethod: 'S256',
    };
  }

  /**
   * Generates the authorization URL for GitHub OAuth
   * @param options Optional parameters for the authorization URL
   * @returns The complete authorization URL
   */
  public getAuthUrl(options?: {
    state?: string;
    usePKCE?: boolean;
    codeChallenge?: string;
  }): string {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    });

    // Add scopes if provided
    if (this.scopes.length > 0) {
      params.append('scope', this.scopes.join(' '));
    }

    // Add state parameter
    const stateParam = options?.state || this.state;
    if (stateParam) {
      params.append('state', stateParam);
    }

    // Add allow_signup parameter
    if (this.allowSignup !== undefined) {
      params.append('allow_signup', this.allowSignup.toString());
    }

    // Add login suggestion
    if (this.login) {
      params.append('login', this.login);
    }

    // Add PKCE parameters if requested
    if (options?.usePKCE && options.codeChallenge) {
      params.append('code_challenge', options.codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Exchanges an authorization code for access tokens
   * @param code The authorization code received from GitHub's OAuth callback
   * @param codeVerifier Optional PKCE code verifier for enhanced security
   * @returns A promise that resolves to the token response
   * @throws Error if the token exchange fails
   */
  public async exchangeCodeForTokens(
    code: string,
    codeVerifier?: string,
  ): Promise<GitHubTokenResponse> {
    const url = 'https://github.com/login/oauth/access_token';
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
    });

    // Add PKCE code verifier if provided
    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check for OAuth error response
    if (data.error) {
      const errorResponse = githubErrorResponseSchema.parse(data);
      throw new Error(`OAuth error: ${errorResponse.error}${errorResponse.error_description ? ` - ${errorResponse.error_description}` : ''}`);
    }

    return githubTokenResponseSchema.parse(data);
  }

  /**
   * Fetches the authenticated user's profile information
   * @param accessToken The access token
   * @returns A promise that resolves to the user information
   * @throws Error if the request fails
   */
  public async getUserProfile(accessToken: string): Promise<GitHubUser> {
    const url = 'https://api.github.com/user';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Microfox-GitHub-OAuth-SDK',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return githubUserSchema.parse(data);
  }

  /**
   * Fetches the authenticated user's email addresses
   * @param accessToken The access token
   * @returns A promise that resolves to the user's email addresses
   * @throws Error if the request fails
   */
  public async getUserEmails(accessToken: string): Promise<GitHubEmail[]> {
    const url = 'https://api.github.com/user/emails';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Microfox-GitHub-OAuth-SDK',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user emails: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return z.array(githubEmailSchema).parse(data);
  }

  /**
   * Fetches complete user identity information including profile and emails
   * @param accessToken The access token
   * @returns A promise that resolves to complete identity information
   * @throws Error if the request fails
   */
  public async getUserIdentity(accessToken: string): Promise<GitHubIdentityInfo> {
    const [user, emails] = await Promise.all([
      this.getUserProfile(accessToken),
      this.getUserEmails(accessToken).catch(() => undefined), // Emails might not be accessible depending on scopes
    ]);

    return {
      user,
      emails,
    };
  }

  /**
   * Validates an access token by making a request to the GitHub API
   * @param accessToken The access token to validate
   * @returns A promise that resolves to the user information if valid
   * @throws Error if the token is invalid or the request fails
   */
  public async validateAccessToken(accessToken: string): Promise<GitHubUser> {
    return this.getUserProfile(accessToken);
  }

  /**
   * Revokes an access token
   * @param accessToken The access token to revoke
   * @returns A promise that resolves when the token is successfully revoked
   * @throws Error if the revocation fails
   */
  public async revokeToken(accessToken: string): Promise<void> {
    const url = `https://api.github.com/applications/${this.clientId}/token`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Microfox-GitHub-OAuth-SDK',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to revoke token: ${response.status} ${response.statusText}`);
    }

    // GitHub returns 204 No Content on successful revocation
  }

  /**
   * Gets a complete OAuth response including tokens and user information
   * @param code The authorization code
   * @param codeVerifier Optional PKCE code verifier
   * @param includeUserInfo Whether to include user profile and email information
   * @returns A promise that resolves to the complete OAuth response
   */
  public async getCompleteOAuthResponse(
    code: string,
    codeVerifier?: string,
    includeUserInfo: boolean = true,
  ): Promise<GitHubOAuthResponse> {
    const tokenResponse = await this.exchangeCodeForTokens(code, codeVerifier);
    
    if (!includeUserInfo) {
      return tokenResponse;
    }

    try {
      const identityInfo = await this.getUserIdentity(tokenResponse.access_token);
      return {
        ...tokenResponse,
        user: identityInfo.user,
        emails: identityInfo.emails,
      };
    } catch (error) {
      console.warn('Failed to fetch user info, returning token response only:', error);
      return tokenResponse;
    }
  }
}
