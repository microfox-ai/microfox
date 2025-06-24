export interface RedditOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  scopes: string[];
}

export interface RedditTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

export interface RedditAuthorizationResponse {
  code: string;
  state: string;
}

export interface RedditRefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface RedditErrorResponse {
  error: string;
  error_description?: string;
}
