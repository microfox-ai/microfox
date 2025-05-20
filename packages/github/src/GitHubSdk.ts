import { FilloutOAuthSdk } from '@microfox/fillout-oauth';
import { z } from 'zod';
import {
ConnectGitHubRepositoryParams,
DisconnectGitHubRepositoryParams,
GetConnectedRepositoriesParams,
IntegrationDetails,
GitHubSDKOptions,
} from './types';
import {
connectGitHubRepositorySchema,
disconnectGitHubRepositorySchema,
getConnectedRepositoriesSchema,
} from './schemas';

export class GitHubSDK {
private oauthSdk: FilloutOAuthSdk;
private accessToken: string | null = null;
private baseUrl = 'https://api.github.com';

constructor(private options: GitHubSDKOptions) {
  this.oauthSdk = new FilloutOAuthSdk({
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    redirectUri: options.redirectUri,
  });
}

private async ensureAccessToken(): Promise<void> {
  if (!this.accessToken) {
    throw new Error('Access token not set. Please authenticate first.');
  }

  const isValid = await this.validateAccessToken(this.accessToken);
  if (!isValid) {
    throw new Error('Invalid access token. Please re-authenticate.');
  }
}

async getAuthorizationUrl(): Promise<string> {
  return this.oauthSdk.getAuthorizationUrl(this.options.scopes.join(' '));
}

async getAccessToken(code: string): Promise<string> {
  const tokenResponse = await this.oauthSdk.getAccessToken({ code });
  this.accessToken = tokenResponse.access_token;
  return this.accessToken;
}

async validateAccessToken(token: string): Promise<boolean> {
  try {
    await this.oauthSdk.validateAccessToken(token);
    return true;
  } catch (error) {
    return false;
  }
}

async connectGitHubRepository(params: ConnectGitHubRepositoryParams): Promise<IntegrationDetails> {
  await this.ensureAccessToken();
  const validatedParams = connectGitHubRepositorySchema.parse(params);

  const response = await fetch(`${this.baseUrl}/gitbook/integrations/github/connect`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(validatedParams),
  });

  if (!response.ok) {
    throw new Error(`Failed to connect GitHub repository: ${response.statusText}`);
  }

  return response.json();
}

async disconnectGitHubRepository(params: DisconnectGitHubRepositoryParams): Promise<void> {
  await this.ensureAccessToken();
  const validatedParams = disconnectGitHubRepositorySchema.parse(params);

  const response = await fetch(`${this.baseUrl}/gitbook/integrations/github/disconnect`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
    },
    body: JSON.stringify(validatedParams),
  });

  if (!response.ok) {
    throw new Error(`Failed to disconnect GitHub repository: ${response.statusText}`);
  }
}

async getConnectedRepositories(params: GetConnectedRepositoriesParams): Promise<IntegrationDetails[]> {
  await this.ensureAccessToken();
  const validatedParams = getConnectedRepositoriesSchema.parse(params);

  const response = await fetch(`${this.baseUrl}/gitbook/integrations/github/connections?${new URLSearchParams(validatedParams as Record<string, string>)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${this.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get connected repositories: ${response.statusText}`);
  }

  return response.json();
}
}

export function createGitHubSDK(options: GitHubSDKOptions): GitHubSDK {
return new GitHubSDK(options);
}