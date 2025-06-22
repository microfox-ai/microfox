import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';
import { z } from 'zod';
import {
  GmailSDKConfig,
  Label,
  ListLabelsResponse,
  Message,
  ListMessagesResponse,
  Thread,
  ListThreadsResponse,
} from './types';
import {
  GmailSDKConfigSchema,
  LabelSchema,
  ListLabelsResponseSchema,
  MessageSchema,
  ListMessagesResponseSchema,
  ThreadSchema,
  ListThreadsResponseSchema,
} from './schemas';

export class GmailSDK {
  private oauth: GoogleOAuthSdk;
  private baseUrl = 'https://gmail.googleapis.com/gmail/v1';
  private userId: string;
  private accessToken: string;
  private refreshToken: string;

  constructor(config: GmailSDKConfig) {
    const validatedConfig = GmailSDKConfigSchema.parse(config);
    this.oauth = new GoogleOAuthSdk({
      clientId: validatedConfig.clientId,
      clientSecret: validatedConfig.clientSecret,
      redirectUri: '',
      scopes: validatedConfig?.scopes ?? [
        'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
        'https://www.googleapis.com/auth/gmail.addons.current.message.action',
        'https://www.googleapis.com/auth/gmail.labels'
      ],
    });
    this.accessToken = validatedConfig.accessToken || '';
    this.refreshToken = validatedConfig.refreshToken || '';
    this.userId = validatedConfig.userId || 'me';
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    schema: z.ZodType<T>,
    body?: unknown,
  ): Promise<T> {
    const accessToken = await this.getValidAccessToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `Gmail API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return schema.parse(data);
  }

  private async getValidAccessToken(): Promise<string> {
    try {
      const result = await this.oauth.validateAccessToken(this.accessToken);
      if (result.isValid) {
        return this.accessToken;
      }
      const { accessToken } = await this.oauth.refreshAccessToken(
        this.refreshToken,
      );
      return accessToken;
    } catch (error) {
      throw new Error('Failed to get a valid access token');
    }
  }

  async listLabels(): Promise<ListLabelsResponse> {
    return this.request<ListLabelsResponse>(
      `/users/${this.userId}/labels`,
      'GET',
      ListLabelsResponseSchema,
    );
  }

  async createLabel(label: Omit<Label, 'id'>): Promise<Label> {
    return this.request<Label>(
      `/users/${this.userId}/labels`,
      'POST',
      LabelSchema,
      label,
    );
  }

  async getLabel(id: string): Promise<Label> {
    return this.request<Label>(
      `/users/${this.userId}/labels/${id}`,
      'GET',
      LabelSchema,
    );
  }

  async updateLabel(id: string, label: Partial<Label>): Promise<Label> {
    return this.request<Label>(
      `/users/${this.userId}/labels/${id}`,
      'PUT',
      LabelSchema,
      label,
    );
  }

  async deleteLabel(id: string): Promise<void> {
    await this.request<void>(
      `/users/${this.userId}/labels/${id}`,
      'DELETE',
      z.void(),
    );
  }

  async listMessages(
    params: {
      q?: string;
      pageToken?: string;
      maxResults?: number;
    } = {},
  ): Promise<ListMessagesResponse> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<ListMessagesResponse>(
      `/users/${this.userId}/messages?${queryParams}`,
      'GET',
      ListMessagesResponseSchema,
    );
  }

  async getMessage(id: string): Promise<Message> {
    return this.request<Message>(
      `/users/${this.userId}/messages/${id}`,
      'GET',
      MessageSchema,
    );
  }

  async sendMessage(message: Message): Promise<Message> {
    return this.request<Message>(
      `/users/${this.userId}/messages/send`,
      'POST',
      MessageSchema,
      message,
    );
  }

  async listThreads(
    params: {
      q?: string;
      pageToken?: string;
      maxResults?: number;
    } = {},
  ): Promise<ListThreadsResponse> {
    const queryParams = new URLSearchParams(
      params as Record<string, string>,
    ).toString();
    return this.request<ListThreadsResponse>(
      `/users/${this.userId}/threads?${queryParams}`,
      'GET',
      ListThreadsResponseSchema,
    );
  }

  async getThread(id: string): Promise<Thread> {
    return this.request<Thread>(
      `/users/${this.userId}/threads/${id}`,
      'GET',
      ThreadSchema,
    );
  }
}

export function createGmailSDK(config: GmailSDKConfig): GmailSDK {
  return new GmailSDK(config);
}
