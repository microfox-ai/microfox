export interface XOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface XOAuthTokens {
  accessToken: string;
  tokenType: string;
  expiresIn?: number;
  refreshToken?: string;
  scope?: string;
}

export interface XOAuthCodeVerifier {
  codeVerifier: string;
}

export interface XOAuthAuthorizationResponse {
  code: string;
  state: string;
}

export interface XOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

export interface XOAuthRevokeResponse {
  revoked: boolean;
}

export type XOAuthScope =
  | 'tweet.read'
  | 'tweet.write'
  | 'tweet.moderate.write'
  | 'users.email'
  | 'users.read'
  | 'follows.read'
  | 'follows.write'
  | 'offline.access'
  | 'space.read'
  | 'mute.read'
  | 'mute.write'
  | 'like.read'
  | 'like.write'
  | 'list.read'
  | 'list.write'
  | 'block.read'
  | 'block.write'
  | 'bookmark.read'
  | 'bookmark.write'
  | 'media.write';
