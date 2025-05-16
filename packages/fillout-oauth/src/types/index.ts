import { z } from 'zod';

export interface FilloutOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  state?: string;
}

export interface AuthorizationResponse {
  code: string;
  state: string;
}

export interface TokenResponse {
  access_token: string;
  base_url: string;
}

export class FilloutOAuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'FilloutOAuthError';
  }
}

export type { z };
