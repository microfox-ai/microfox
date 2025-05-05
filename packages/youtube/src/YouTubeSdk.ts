import { GoogleOAuthSdk } from '@microfox/google-oauth';
import { z } from 'zod';
import {
YouTubeSDKOptions,
ListActivitiesParams,
ListCaptionsParams,
ListChannelSectionsParams,
ListChannelsParams,
UpdateChannelParams,
Activity,
Caption,
ChannelSection,
Channel,
ActivityListResponse,
CaptionListResponse,
ChannelSectionListResponse,
ChannelListResponse,
} from './types';
import {
YouTubeSDKOptionsSchema,
ListActivitiesParamsSchema,
ListCaptionsParamsSchema,
ListChannelSectionsParamsSchema,
ListChannelsParamsSchema,
UpdateChannelParamsSchema,
} from './schemas';

export class YouTubeSDK {
private readonly baseUrl = 'https://www.googleapis.com/youtube/v3';
private readonly oauth: GoogleOAuthSdk;
private accessToken: string;
private refreshToken: string;

constructor(options: YouTubeSDKOptions) {
  const validatedOptions = YouTubeSDKOptionsSchema.parse(options);
  this.oauth = new GoogleOAuthSdk({
    clientId: validatedOptions.clientId,
    clientSecret: validatedOptions.clientSecret,
    redirectUri: validatedOptions.redirectUri,
    scopes: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtubepartner',
    ],
  });
  this.accessToken = validatedOptions.accessToken;
  this.refreshToken = validatedOptions.refreshToken;
}

private async request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  params?: Record<string, any>,
  body?: any
): Promise<T> {
  const url = new URL(`${this.baseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v));
      } else if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${this.accessToken}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async validateAccessToken(): Promise<void> {
  try {
    const result = await this.oauth.validateAccessToken(this.accessToken);
    if (!result.isValid) {
      throw new Error('Invalid access token');
    }
  } catch (error) {
    throw new Error(`Failed to validate access token: ${(error as Error).message}`);
  }
}

async refreshAccessToken(): Promise<void> {
  try {
    const result = await this.oauth.refreshAccessToken(this.refreshToken);
    this.accessToken = result.accessToken;
  } catch (error) {
    throw new Error(`Failed to refresh access token: ${(error as Error).message}`);
  }
}

async listActivities(params: ListActivitiesParams): Promise<ActivityListResponse> {
  const validatedParams = ListActivitiesParamsSchema.parse(params);
  return this.request<ActivityListResponse>('/activities', 'GET', validatedParams);
}

async listCaptions(params: ListCaptionsParams): Promise<CaptionListResponse> {
  const validatedParams = ListCaptionsParamsSchema.parse(params);
  return this.request<CaptionListResponse>('/captions', 'GET', validatedParams);
}

async deleteCaption(id: string, onBehalfOfContentOwner?: string): Promise<void> {
  const params = { id, onBehalfOfContentOwner };
  await this.request('/captions', 'DELETE', params);
}

async downloadCaption(
  id: string,
  tfmt?: string,
  tlang?: string,
  onBehalfOfContentOwner?: string
): Promise<string> {
  const params = { id, tfmt, tlang, onBehalfOfContentOwner };
  const response = await this.request<string>(`/captions/${id}`, 'GET', params);
  return response;
}

async insertCaption(
  part: string[],
  requestBody: Caption,
  onBehalfOfContentOwner?: string,
  sync?: boolean
): Promise<Caption> {
  const params = { part: part.join(','), onBehalfOfContentOwner, sync };
  return this.request<Caption>('/captions', 'POST', params, requestBody);
}

async updateCaption(
  part: string[],
  requestBody: Caption,
  onBehalfOfContentOwner?: string,
  sync?: boolean
): Promise<Caption> {
  const params = { part: part.join(','), onBehalfOfContentOwner, sync };
  return this.request<Caption>('/captions', 'PUT', params, requestBody);
}

async uploadChannelBanner(
  imageData: Blob,
  onBehalfOfContentOwner?: string
): Promise<{ url: string }> {
  const params = { onBehalfOfContentOwner };
  const formData = new FormData();
  formData.append('image', imageData);
  const response = await fetch(`${this.baseUrl}/channelBanners/insert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.accessToken}`,
    },
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async deleteChannelSection(id: string, onBehalfOfContentOwner?: string): Promise<void> {
  const params = { id, onBehalfOfContentOwner };
  await this.request('/channelSections', 'DELETE', params);
}

async insertChannelSection(
  part: string[],
  requestBody: ChannelSection,
  onBehalfOfContentOwner?: string
): Promise<ChannelSection> {
  const params = { part: part.join(','), onBehalfOfContentOwner };
  return this.request<ChannelSection>('/channelSections', 'POST', params, requestBody);
}

async listChannelSections(params: ListChannelSectionsParams): Promise<ChannelSectionListResponse> {
  const validatedParams = ListChannelSectionsParamsSchema.parse(params);
  return this.request<ChannelSectionListResponse>('/channelSections', 'GET', validatedParams);
}

async updateChannelSection(
  part: string[],
  requestBody: ChannelSection,
  onBehalfOfContentOwner?: string
): Promise<ChannelSection> {
  const params = { part: part.join(','), onBehalfOfContentOwner };
  return this.request<ChannelSection>('/channelSections', 'PUT', params, requestBody);
}

async listChannels(params: ListChannelsParams): Promise<ChannelListResponse> {
  const validatedParams = ListChannelsParamsSchema.parse(params);
  return this.request<ChannelListResponse>('/channels', 'GET', validatedParams);
}

async updateChannel(params: UpdateChannelParams, requestBody: Channel): Promise<Channel> {
  const validatedParams = UpdateChannelParamsSchema.parse(params);
  return this.request<Channel>('/channels', 'PUT', validatedParams, requestBody);
}

// Add more methods for other endpoints here...
}

export function createYouTubeSDK(options: YouTubeSDKOptions): YouTubeSDK {
return new YouTubeSDK(options);
}