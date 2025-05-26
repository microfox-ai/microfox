import { GoogleOAuthSdk as ImportedGoogleOAuthSdk } from '@microfox/google-oauth';
import { z } from 'zod';
import {
  AboutResponse,
  AccessProposalResponse,
  AccessProposalsListResponse,
  AppResponse,
  AppsListResponse,
  GoogleDriveSDKOptions,
  ResolveAccessProposalRequest,
} from './types';

interface GoogleOAuthSdk extends ImportedGoogleOAuthSdk {
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  validateAccessToken(token: string): Promise<boolean>;
  refreshAccessToken(): Promise<{ accessToken: string; refreshToken?: string; idToken?: string; expiresIn: number; }>;
}

export class GoogleDriveSdk {
  private oauth: GoogleOAuthSdk;
  private baseUrl = 'https://www.googleapis.com/drive/v3';

  constructor(options: GoogleDriveSDKOptions) {
    this.oauth = new ImportedGoogleOAuthSdk({
      clientId: options.clientId,
      clientSecret: options.clientSecret,
      redirectUri: options.redirectUri,
      scopes: options.scopes,
    }) as GoogleOAuthSdk;

    if (options.accessToken) {
      this.oauth.setAccessToken(options.accessToken);
    }

    if (options.refreshToken) {
      this.oauth.setRefreshToken(options.refreshToken);
    }
  }

  private async request<T>(
    method: string,
    path: string,
    params: Record<string, string> = {},
    body?: unknown
  ): Promise<T> {
    const accessToken = await this.getValidAccessToken();
    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as T;
  }

  private async getValidAccessToken(): Promise<string> {
    const accessToken = this.oauth.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const isValid = await this.oauth.validateAccessToken(accessToken);
    if (!isValid) {
      const refreshToken = this.oauth.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const { accessToken: newAccessToken } = await this.oauth.refreshAccessToken();
      this.oauth.setAccessToken(newAccessToken);
      return newAccessToken;
    }

    return accessToken;
  }

  async getAbout(fields: string): Promise<AboutResponse> {
    return this.request<AboutResponse>('GET', '/about', { fields });
  }

  async getAccessProposal(fileId: string, proposalId: string): Promise<AccessProposalResponse> {
    return this.request<AccessProposalResponse>('GET', `/files/${fileId}/accessproposals/${proposalId}`);
  }

  async listAccessProposals(
    fileId: string,
    pageToken?: string,
    pageSize?: number
  ): Promise<AccessProposalsListResponse> {
    const params: Record<string, string> = {};
    if (pageToken) params.pageToken = pageToken;
    if (pageSize) params.pageSize = pageSize.toString();

    return this.request<AccessProposalsListResponse>('GET', `/files/${fileId}/accessproposals`, params);
  }

  async resolveAccessProposal(
    fileId: string,
    proposalId: string,
    request: ResolveAccessProposalRequest
  ): Promise<void> {
    await this.request<void>(
      'POST',
      `/files/${fileId}/accessproposals/${proposalId}:resolve`,
      {},
      request
    );
  }

  async getApp(appId: string): Promise<AppResponse> {
    return this.request<AppResponse>('GET', `/apps/${appId}`);
  }

  async listApps(): Promise<AppsListResponse> {
    return this.request<AppsListResponse>('GET', '/apps');
  }

  // Add other methods for remaining endpoints here...
}

export function createGoogleDriveSDK(options: GoogleDriveSDKOptions): GoogleDriveSdk {
  return new GoogleDriveSdk(options);
}