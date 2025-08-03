import { z } from 'zod';
import {
  InstagramOAuthSdk,
  InstagramScope,
} from '@microfox/instagram-oauth';

// Zod schemas for input validation
const InstagramMediaTypeSchema = z
  .enum(['IMAGE', 'VIDEO', 'REELS', 'STORIES', 'CAROUSEL'])
  .describe('Type of media to be published');
const InstagramUploadTypeSchema = z
  .enum(['resumable'])
  .describe('Type of upload (currently only resumable is supported)');
const InstagramMediaSchema = z
  .object({
    image_url: z
      .string()
      .url()
      .optional()
      .describe('URL of the image to be published'),
    video_url: z
      .string()
      .url()
      .optional()
      .describe('URL of the video to be published'),
    media_type: InstagramMediaTypeSchema,
    caption: z.string().optional().describe('Caption for the media'),
    location_id: z.string().optional().describe('ID of the location to tag'),
    user_tags: z
      .array(
        z.object({
          username: z.string(),
          x: z.number(),
          y: z.number(),
        }),
      )
      .optional()
      .describe('Array of user tags'),
    is_carousel_item: z
      .boolean()
      .optional()
      .describe('Whether this media is part of a carousel'),
    children: z
      .array(z.string())
      .optional()
      .describe('Array of media IDs for carousel posts'),
  })
  .describe('Schema for creating media on Instagram');

const InstagramCommentSchema = z
  .object({
    message: z.string().describe('Text content of the comment'),
  })
  .describe('Schema for creating or replying to comments');

const InstagramPrivateReplySchema = z
  .object({
    recipient: z.object({
      comment_id: z.string().describe('ID of the comment to reply to'),
    }),
    message: z.object({
      text: z.string().describe('Text content of the private reply'),
    }),
  })
  .describe('Schema for sending private replies');

const InstagramInsightsSchema = z
  .object({
    metric: z.array(z.string()).describe('Array of metric names to retrieve'),
    period: z
      .enum(['day', 'week', 'days_28', 'lifetime'])
      .describe('Time period for the metrics'),
  })
  .describe('Schema for retrieving Instagram insights');

const InstagramOEmbedSchema = z
  .object({
    url: z.string().url().describe('URL of the Instagram post to embed'),
    maxwidth: z
      .number()
      .optional()
      .describe('Maximum width of the embedded content'),
    fields: z
      .array(z.string())
      .optional()
      .describe('Specific fields to include in the response'),
    omit_script: z
      .boolean()
      .optional()
      .describe('Whether to omit the script tag in the response'),
  })
  .describe('Schema for retrieving oEmbed data for an Instagram post');

class InstagramSDK {
  private accessToken: string;
  private refreshToken: string;
  private clientId: string;
  private clientSecret: string;
  private instagramAuth: InstagramOAuthSdk;

  constructor(config: {
    accessToken: string;
    refreshToken: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }) {
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;

    this.instagramAuth = new InstagramOAuthSdk({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      scopes: [
        InstagramScope.INSTAGRAM_BUSINESS_CONTENT_PUBLISH,
        InstagramScope.INSTAGRAM_BUSINESS_MANAGE_MESSAGES,
        InstagramScope.INSTAGRAM_BUSINESS_MANAGE_COMMENTS,
      ],
    });
  }

  private async ensureValidToken(): Promise<void> {
    try {
      // Attempt to refresh the token
      const refreshedToken = await this.instagramAuth.refreshToken(
        this.accessToken,
      );
      this.accessToken = refreshedToken.accessToken;
    } catch (error) {
      throw new Error(
        'Failed to refresh access token. Please re-authenticate.',
      );
    }
  }

  private async makeRequest(
    endpoint: string,
    method: string,
    body?: any,
  ): Promise<any> {
    await this.ensureValidToken();

    const url = `https://graph.instagram.com${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Instagram API error: ${errorData.error.message}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred');
    }
  }

  async createMediaContainer(
    accountId: string,
    mediaData: z.infer<typeof InstagramMediaSchema>,
  ): Promise<string> {
    const validatedData = InstagramMediaSchema.parse(mediaData);
    const response = await this.makeRequest(
      `/${accountId}/media`,
      'POST',
      validatedData,
    );
    return response.id;
  }

  async getMediaContainerStatus(containerId: string): Promise<string> {
    const response = await this.makeRequest(
      `/${containerId}?fields=status_code`,
      'GET',
    );
    return response.status_code;
  }

  async publishMedia(accountId: string, containerId: string): Promise<string> {
    const response = await this.makeRequest(
      `/${accountId}/media_publish`,
      'POST',
      { creation_id: containerId },
    );
    return response.id;
  }

  async getContentPublishingLimit(accountId: string): Promise<any> {
    return await this.makeRequest(
      `/${accountId}/content_publishing_limit`,
      'GET',
    );
  }

  async uploadVideo(
    containerId: string,
    videoFile: File,
    offset: number,
  ): Promise<any> {
    await this.ensureValidToken();

    const url = `https://rupload.facebook.com/ig-api-upload/${containerId}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      offset: offset.toString(),
      file_size: videoFile.size.toString(),
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: videoFile,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Video upload error: ${errorData.error.message}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Video upload failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during video upload');
    }
  }

  async getComments(mediaId: string): Promise<any> {
    return await this.makeRequest(`/${mediaId}/comments`, 'GET');
  }

  async replyToComment(
    commentId: string,
    replyData: z.infer<typeof InstagramCommentSchema>,
  ): Promise<string> {
    const validatedData = InstagramCommentSchema.parse(replyData);
    const response = await this.makeRequest(
      `/${commentId}/replies`,
      'POST',
      validatedData,
    );
    return response.id;
  }

  async hideComment(commentId: string, hide: boolean): Promise<void> {
    await this.makeRequest(`/${commentId}`, 'POST', { hidden: hide });
  }

  async toggleComments(mediaId: string, enable: boolean): Promise<void> {
    await this.makeRequest(`/${mediaId}`, 'POST', { comments_enabled: enable });
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.makeRequest(`/${commentId}`, 'DELETE');
  }

  async sendPrivateReply(
    userId: string,
    replyData: z.infer<typeof InstagramPrivateReplySchema>,
  ): Promise<any> {
    const validatedData = InstagramPrivateReplySchema.parse(replyData);
    return await this.makeRequest(`/${userId}/messages`, 'POST', validatedData);
  }

  async getMediaInsights(
    mediaId: string,
    insightsData: z.infer<typeof InstagramInsightsSchema>,
  ): Promise<any> {
    const validatedData = InstagramInsightsSchema.parse(insightsData);
    const queryParams = new URLSearchParams({
      metric: validatedData.metric.join(','),
      period: validatedData.period,
    }).toString();
    return await this.makeRequest(`/${mediaId}/insights?${queryParams}`, 'GET');
  }

  async getAccountInsights(
    accountId: string,
    insightsData: z.infer<typeof InstagramInsightsSchema>,
  ): Promise<any> {
    const validatedData = InstagramInsightsSchema.parse(insightsData);
    const queryParams = new URLSearchParams({
      metric: validatedData.metric.join(','),
      period: validatedData.period,
    }).toString();
    return await this.makeRequest(
      `/${accountId}/insights?${queryParams}`,
      'GET',
    );
  }

  async getOEmbedData(
    oembedData: z.infer<typeof InstagramOEmbedSchema>,
  ): Promise<any> {
    const validatedData = InstagramOEmbedSchema.parse(oembedData);
    const queryParams = new URLSearchParams({
      url: validatedData.url,
      access_token: this.accessToken,
      ...(validatedData.maxwidth && {
        maxwidth: validatedData.maxwidth.toString(),
      }),
      ...(validatedData.fields && { fields: validatedData.fields.join(',') }),
      ...(validatedData.omit_script !== undefined && {
        omit_script: validatedData.omit_script.toString(),
      }),
    }).toString();
    return await this.makeRequest(`/instagram_oembed?${queryParams}`, 'GET');
  }
}

export function createInstagramSDK(config: {
  accessToken: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}): InstagramSDK {
  return new InstagramSDK(config);
}

export {
  InstagramMediaTypeSchema,
  InstagramUploadTypeSchema,
  InstagramMediaSchema,
  InstagramCommentSchema,
  InstagramPrivateReplySchema,
  InstagramInsightsSchema,
  InstagramOEmbedSchema,
};
