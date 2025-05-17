import { z } from 'zod';

export interface FilloutOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface TokenResponse {
  access_token: string;
  base_url: string;
}

export interface AccessTokenInfo {
  valid: boolean;
  userId: string;
  organizationId: string;
}

export type { z };
