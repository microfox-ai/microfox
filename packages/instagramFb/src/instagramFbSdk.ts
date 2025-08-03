import { z } from 'zod';
import { InstagramFbOAuthSdk, InstagramFbScope } from '@microfox/instagramFb-oauth';

// Define Zod schemas for various data structures
const CommentSchema = z.object({
  id: z.string().describe('The ID of the comment'),
  text: z.string().describe('The text content of the comment'),
  timestamp: z
    .string()
    .describe('The timestamp of the comment in ISO-8601 format'),
  from: z.object({
    id: z.string().describe('The ID of the user who made the comment'),
    username: z
      .string()
      .describe('The username of the user who made the comment'),
  }),
  media: z.object({
    id: z.string().describe('The ID of the media the comment is on'),
  }),
});

const InsightMetricSchema = z.object({
  name: z.string().describe('The name of the metric'),
  period: z
    .string()
    .describe('The period of the metric (e.g., "day", "lifetime")'),
  values: z.array(
    z.object({
      value: z.number().describe('The value of the metric'),
      end_time: z
        .string()
        .describe('The end time of the metric period in ISO-8601 format'),
    }),
  ),
  title: z.string().describe('The title of the metric'),
  description: z.string().describe('The description of the metric'),
  id: z.string().describe('The ID of the metric'),
});

const OEmbedResponseSchema = z.object({
  version: z.string().describe('The oEmbed version'),
  author_name: z.string().describe('The name of the author'),
  provider_name: z.string().describe('The name of the provider'),
  provider_url: z.string().describe('The URL of the provider'),
  type: z.string().describe('The type of the embed'),
  width: z.number().describe('The width of the embed'),
  html: z.string().describe('The HTML for the embed'),
});

const MediaTypeEnum = z.enum([
  'IMAGE',
  'VIDEO',
  'REELS',
  'STORIES',
  'CAROUSEL',
]);
const StatusCodeEnum = z.enum([
  'PUBLISHED',
  'IN_PROGRESS',
  'FINISHED',
  'ERROR',
  'EXPIRED',
]);

// Define the main SDK class
export class InstagramFbSdk {
  private oauth: InstagramFbOAuthSdk;
  private accessToken: string;
  private apiVersion: string;

  constructor(config: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    accessToken: string;
    apiVersion?: string;
  }) {
    this.oauth = new InstagramFbOAuthSdk({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      scopes: [
        InstagramFbScope.INSTAGRAM_BASIC,
        InstagramFbScope.INSTAGRAM_CONTENT_PUBLISH,
        InstagramFbScope.INSTAGRAM_MANAGE_COMMENTS,
        InstagramFbScope.INSTAGRAM_MANAGE_INSIGHTS,
        InstagramFbScope.PAGES_SHOW_LIST,
        InstagramFbScope.PAGES_READ_ENGAGEMENT,
      ],
    });
    this.accessToken = config.accessToken;
    this.apiVersion = config.apiVersion || 'v22.0';
  }

  private async request(
    endpoint: string,
    method: string,
    params?: Record<string, any>,
    body?: Record<string, any>,
  ) {
    const url = new URL(
      `https://graph.facebook.com/${this.apiVersion}${endpoint}`,
    );
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${errorData.error.message}`);
    }

    return response.json();
  }

  async validateAccessToken() {
    try {
      await this.oauth.validateAccessToken(this.accessToken);
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  async createMediaContainer(
    igId: string,
    params: {
      image_url?: string;
      video_url?: string;
      media_type: z.infer<typeof MediaTypeEnum>;
      is_carousel_item?: boolean;
      upload_type?: 'resumable';
    },
  ) {
    const response = await this.request(`/${igId}/media`, 'POST', params);
    return z
      .object({
        id: z.string().describe('The ID of the created media container'),
      })
      .parse(response);
  }

  async publishMedia(igId: string, creationId: string) {
    const response = await this.request(
      `/${igId}/media_publish`,
      'POST',
      {},
      { creation_id: creationId },
    );
    return z
      .object({ id: z.string().describe('The ID of the published media') })
      .parse(response);
  }

  async checkMediaStatus(igContainerId: string) {
    const response = await this.request(`/${igContainerId}`, 'GET', {
      fields: 'status_code',
    });
    return z.object({ status_code: StatusCodeEnum }).parse(response);
  }

  async getContentPublishingLimit(igId: string) {
    return this.request(`/${igId}/content_publishing_limit`, 'GET');
  }

  async uploadVideo(
    igMediaContainerId: string,
    videoFile: Blob,
    offset: number,
    fileSize: number,
  ) {
    const url = `https://rupload.facebook.com/ig-api-upload/${this.apiVersion}/${igMediaContainerId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        offset: offset.toString(),
        file_size: fileSize.toString(),
      },
      body: videoFile,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Video upload failed: ${errorData.error.message}`);
    }

    return response.json();
  }

  async getComments(igMediaId: string) {
    const response = await this.request(`/${igMediaId}/comments`, 'GET');
    return z.array(CommentSchema).parse(response.data);
  }

  async replyToComment(igCommentId: string, message: string) {
    const response = await this.request(
      `/${igCommentId}/replies`,
      'POST',
      {},
      { message },
    );
    return z
      .object({ id: z.string().describe('The ID of the reply comment') })
      .parse(response);
  }

  async hideComment(igCommentId: string, hidden: boolean) {
    return this.request(`/${igCommentId}`, 'POST', {}, { hidden });
  }

  async enableDisableComments(igMediaId: string, commentsEnabled: boolean) {
    return this.request(
      `/${igMediaId}`,
      'POST',
      {},
      { comments_enabled: commentsEnabled },
    );
  }

  async deleteComment(igCommentId: string) {
    return this.request(`/${igCommentId}`, 'DELETE');
  }

  async sendPrivateReply(
    appUsersIgId: string,
    commentId: string,
    message: string,
  ) {
    const response = await this.request(
      `/${appUsersIgId}/messages`,
      'POST',
      {},
      {
        recipient: { comment_id: commentId },
        message: { text: message },
      },
    );
    return z
      .object({
        recipient_id: z
          .string()
          .describe('The Instagram-scoped ID of the recipient'),
        message_id: z.string().describe('The ID of the sent message'),
      })
      .parse(response);
  }

  async getMediaInsights(
    instagramMediaId: string,
    metric: string,
    period: string,
  ) {
    const response = await this.request(
      `/${instagramMediaId}/insights`,
      'GET',
      { metric, period },
    );
    return z.array(InsightMetricSchema).parse(response.data);
  }

  async getAccountInsights(
    instagramAccountId: string,
    metric: string,
    period: string,
  ) {
    const response = await this.request(
      `/${instagramAccountId}/insights`,
      'GET',
      { metric, period },
    );
    return z.array(InsightMetricSchema).parse(response.data);
  }

  async getOEmbed(
    url: string,
    maxwidth?: number,
    fields?: string[],
    omitScript?: boolean,
  ) {
    const params: Record<string, any> = { url };
    if (maxwidth) params.maxwidth = maxwidth;
    if (fields) params.fields = fields.join(',');
    if (omitScript) params.omit_script = '1';

    const response = await this.request('/instagram_oembed', 'GET', params);
    return OEmbedResponseSchema.parse(response);
  }
}

// Export types
export type Comment = z.infer<typeof CommentSchema>;
export type InsightMetric = z.infer<typeof InsightMetricSchema>;
export type OEmbedResponse = z.infer<typeof OEmbedResponseSchema>;
export type MediaType = z.infer<typeof MediaTypeEnum>;
export type StatusCode = z.infer<typeof StatusCodeEnum>;

// Function to create the SDK instance
export function createInstagramFbSdk(config: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken: string;
  apiVersion?: string;
}) {
  return new InstagramFbSdk(config);
}
