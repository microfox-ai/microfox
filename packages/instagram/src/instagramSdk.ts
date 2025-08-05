import { z } from 'zod';
import dotenv from 'dotenv';
import {
  InstagramOAuthSdk,
  InstagramScope,
} from '@microfox/instagram-oauth';

// Load environment variables
dotenv.config();

// Zod schemas for input validation
const InstagramMediaTypeSchema = z
  .enum(['IMAGE', 'REELS', 'STORIES', 'CAROUSEL'])
  .describe('Type of media to be published (VIDEO is deprecated, use REELS for all video uploads)');
const InstagramUploadTypeSchema = z
  .enum(['resumable'])
  .describe('Type of upload (currently only resumable is supported)');
const InstagramCarouselSchema = z.object({
  media_type: z.literal('CAROUSEL'),
  caption: z.string().optional(),
  children: z.array(z.string()),
});

const InstagramMediaSchema = z.object({
  image_url: z.string().url().optional(),
  video_url: z.string().url().optional(),
  media_type: z.enum(['IMAGE', 'REELS', 'STORIES']), // Removed 'VIDEO' as it's deprecated
  caption: z.string().optional(),
  location_id: z.string().optional(),
  user_tags: z.array(z.object({
    username: z.string(),
    x: z.number(),
    y: z.number(),
  })).optional(),
  is_carousel_item: z.boolean().optional(),
  share_to_feed: z.boolean().optional(), // Add share_to_feed for reels
  thumb_offset: z.number().optional(), // Add thumb_offset for custom video thumbnails
}).refine((data) => {
  // For carousel items, we don't need image_url or video_url validation
  if (data.is_carousel_item) {
    return true;
  }
  // For regular media, either image_url or video_url must be provided
  return data.image_url || data.video_url;
}, {
  message: "Either image_url or video_url must be provided",
  path: [],
});

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
  private baseUrl = 'https://graph.instagram.com';
  private clientId: string;
  private clientSecret: string;
  private instagramAuth: InstagramOAuthSdk;

  constructor(config: {
    accessToken: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }) {
    this.accessToken = config.accessToken;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;

    this.instagramAuth = new InstagramOAuthSdk({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectUri,
      scopes: [
        InstagramScope.INSTAGRAM_BUSINESS_BASIC,
        InstagramScope.INSTAGRAM_BUSINESS_CONTENT_PUBLISH,
        InstagramScope.INSTAGRAM_BUSINESS_MANAGE_MESSAGES,
        InstagramScope.INSTAGRAM_BUSINESS_MANAGE_COMMENTS,
      ],
    });
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Access token is required');
    }
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
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    data?: any,
  ): Promise<any> {
    await this.ensureValidToken();

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken}`,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (data && method === 'POST') {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      if (!response.ok) {
        // Enhanced error handling for Instagram API errors
        let errorMessage = `Instagram API error: ${response.status} ${response.statusText}`;

        if (responseData.error) {
          const error = responseData.error;
          errorMessage = `Instagram API error: ${error.message || 'Unknown error'}`;

          // Add error code if available
          if (error.code) {
            errorMessage += ` (Code: ${error.code})`;
          }

          // Add error subcode if available
          if (error.error_subcode) {
            errorMessage += ` (Subcode: ${error.error_subcode})`;
          }

          // Add error user message if available
          if (error.error_user_msg) {
            errorMessage += ` - ${error.error_user_msg}`;
          }

          // Add error user title if available
          if (error.error_user_title) {
            errorMessage += ` - ${error.error_user_title}`;
          }

          // Add full error details for debugging
          console.error('🔍 Full Instagram API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            error: error,
            endpoint: endpoint,
            method: method,
            data: data
          });
        }

        throw new Error(errorMessage);
      }

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        // If it's already our formatted error, re-throw it
        if (error.message.includes('Instagram API error:')) {
          throw error;
        }
        // Otherwise, format it as an Instagram API error
        throw new Error(`Instagram API error: ${error.message}`);
      }
      throw new Error('An unknown error occurred while making the request');
    }
  }

  async createMediaContainer(
    accountId: string,
    mediaData: z.infer<typeof InstagramMediaSchema> | z.infer<typeof InstagramCarouselSchema>,
  ): Promise<string> {
    let validatedData;

    // Check if this is a carousel creation
    if (mediaData.media_type === 'CAROUSEL') {
      validatedData = InstagramCarouselSchema.parse(mediaData);
    } else {
      validatedData = InstagramMediaSchema.parse(mediaData);
    }

    try {
      const response = await this.makeRequest(
        `/${accountId}/media`,
        'POST',
        validatedData,
      );
      return response.id;
    } catch (error) {
      // Enhanced error handling for media creation
      if (error instanceof Error) {
        const errorMessage = error.message;

        // Add specific guidance for common video upload issues
        if (mediaData.media_type === 'REELS') {
          console.error('🎬 Video Upload Error Analysis:', {
            mediaType: mediaData.media_type,
            videoUrl: (mediaData as any).video_url,
            error: errorMessage,
            suggestions: [
              'Check if video URL is accessible and returns valid MP4',
              'Ensure video aspect ratio is correct (9:16 for reels)',
              'Verify video file size is within Instagram limits',
              'Check if video format is supported (MP4 recommended)',
              'Ensure video duration is within acceptable range',
              'Consider adding share_to_feed=true to also appear in feed',
              'Use thumb_offset to set custom video thumbnail'
            ]
          });
        }

        // Add specific guidance for image upload issues
        if (mediaData.media_type === 'IMAGE' || mediaData.media_type === 'STORIES') {
          console.error('🖼️ Image Upload Error Analysis:', {
            mediaType: mediaData.media_type,
            imageUrl: (mediaData as any).image_url,
            error: errorMessage,
            suggestions: [
              'Check if image URL is accessible and returns valid image',
              'Ensure image aspect ratio is correct',
              'Verify image file size is within Instagram limits',
              'Check if image format is supported (JPG, PNG recommended)'
            ]
          });
        }
      }

      throw error;
    }
  }

  async getMediaContainerStatus(containerId: string): Promise<string> {
    const response = await this.makeRequest(
      `/${containerId}?fields=status_code`,
      'GET',
    );
    return response.status_code;
  }

  async triggerMediaPublish(accountId: string, containerId: string): Promise<string> {
    const response = await this.makeRequest(
      `/${accountId}/media_publish`,
      'POST',
      { creation_id: containerId },
    );
    return response.id;
  }

  /**
   * Publishes media with automatic status checking and waiting
   * @param accountId The Instagram account ID
   * @param mediaData The media data to publish
   * @param options Optional configuration for the publishing process
   * @returns Promise that resolves to the published media ID
   */
  async publishMedia(
    accountId: string,
    mediaData: z.infer<typeof InstagramMediaSchema>,
    options?: {
      maxWaitTime?: number; // Maximum time to wait in milliseconds
      checkInterval?: number; // Interval between status checks in milliseconds
      maxAttempts?: number; // Maximum number of status check attempts
    }
  ): Promise<string> {
    const {
      maxWaitTime = 120000, // 2 minutes default
      checkInterval = 2000, // 2 seconds default
      maxAttempts = 60, // 60 attempts default
    } = options || {};

    console.log('🚀 Starting media publishing workflow...');
    console.log('📋 Media data:', JSON.stringify(mediaData, null, 2));

    // Step 1: Create media container
    console.log('📦 Creating media container...');
    const containerId = await this.createMediaContainer(accountId, mediaData);
    console.log('✅ Media container created:', containerId);

    // Step 2: Wait for media to be ready
    console.log('⏳ Waiting for media to be ready...');
    let status = 'IN_PROGRESS';
    let attempts = 0;
    const startTime = Date.now();

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      // Check if we've exceeded the maximum wait time
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error(`Media processing timeout after ${maxWaitTime / 1000} seconds`);
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));

      try {
        status = await this.getMediaContainerStatus(containerId);
        console.log(`📊 Status check ${attempts + 1}/${maxAttempts}: ${status}`);

        if (status === 'ERROR') {
          throw new Error('Media processing failed with ERROR status');
        }
      } catch (error) {
        console.log('⚠️ Status check error:', error);
        break;
      }

      attempts++;
    }

    if (status !== 'FINISHED') {
      throw new Error(`Media processing failed. Final status: ${status}`);
    }

    console.log('✅ Media processing completed successfully');

    // Step 3: Publish the media
    console.log('📤 Publishing media...');
    const publishedMediaId = await this.triggerMediaPublish(accountId, containerId);
    console.log('🎉 Media published successfully:', publishedMediaId);

    return publishedMediaId;
  }

  /**
   * Publishes a carousel post with multiple media items
   * @param accountId The Instagram account ID
   * @param carouselItems Array of media data for carousel items
   * @param caption The caption for the carousel post
   * @param options Optional configuration for the publishing process
   * @returns Promise that resolves to the published carousel ID
   */
  async publishCarousel(
    accountId: string,
    carouselItems: z.infer<typeof InstagramMediaSchema>[],
    caption: string,
    options?: {
      maxWaitTime?: number;
      checkInterval?: number;
      maxAttempts?: number;
    }
  ): Promise<string> {
    console.log('🎠 Starting carousel publishing workflow...');
    console.log(`📋 Creating carousel with ${carouselItems.length} items`);

    const {
      maxWaitTime = 180000, // 3 minutes default for carousels
      checkInterval = 3000, // 3 seconds default for carousels
      maxAttempts = 60,
    } = options || {};

    // Step 1: Create individual media containers for each item
    const itemContainerIds: string[] = [];

    for (let i = 0; i < carouselItems.length; i++) {
      const itemData = {
        ...carouselItems[i],
        is_carousel_item: true,
      };

      console.log(`📦 Creating carousel item ${i + 1}/${carouselItems.length}...`);
      const itemContainerId = await this.createMediaContainer(accountId, itemData);
      itemContainerIds.push(itemContainerId);
      console.log(`✅ Carousel item ${i + 1} container created:`, itemContainerId);
    }

    // Step 2: Create the carousel post
    const carouselData = {
      media_type: 'CAROUSEL' as const,
      caption,
      children: itemContainerIds,
    };

    console.log('🎠 Creating carousel post...');
    const carouselContainerId = await this.createMediaContainer(accountId, carouselData);
    console.log('✅ Carousel container created:', carouselContainerId);

    // Step 3: Wait for carousel to be ready
    console.log('⏳ Waiting for carousel to be ready...');
    let status = 'IN_PROGRESS';
    let attempts = 0;
    const startTime = Date.now();

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      if (Date.now() - startTime > maxWaitTime) {
        throw new Error(`Carousel processing timeout after ${maxWaitTime / 1000} seconds`);
      }

      await new Promise(resolve => setTimeout(resolve, checkInterval));

      try {
        status = await this.getMediaContainerStatus(carouselContainerId);
        console.log(`📊 Carousel status check ${attempts + 1}/${maxAttempts}: ${status}`);

        if (status === 'ERROR') {
          throw new Error('Carousel processing failed with ERROR status');
        }
      } catch (error) {
        console.log('⚠️ Carousel status check error:', error);
        break;
      }

      attempts++;
    }

    if (status !== 'FINISHED') {
      throw new Error(`Carousel processing failed. Final status: ${status}`);
    }

    console.log('✅ Carousel processing completed successfully');

    // Step 4: Publish the carousel
    console.log('📤 Publishing carousel...');
    const publishedCarouselId = await this.triggerMediaPublish(accountId, carouselContainerId);
    console.log('🎉 Carousel published successfully:', publishedCarouselId);

    return publishedCarouselId;
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
    mediaId: string,
    replyData: z.infer<typeof InstagramCommentSchema>,
  ): Promise<string> {
    const validatedData = InstagramCommentSchema.parse(replyData);
    const response = await this.makeRequest(
      `/${mediaId}/comments`, // Changed from /replies to /comments
      'POST',
      validatedData,
    );
    return response.id;
  }

  async replyToSpecificComment(
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
    await this.makeRequest(`/${commentId}`, 'POST', { hide: hide });
  }

  async toggleComments(mediaId: string, enable: boolean): Promise<void> {
    await this.makeRequest(`/${mediaId}`, 'POST', { comment_enabled: enable });
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

  /**
   * Gets user information including account ID and username
   * @returns Promise that resolves to user information
   */
  async getUserInfo(): Promise<{
    id: string;
    username: string;
    account_type?: string;
    media_count?: number;
    name?: string;
    profile_picture_url?: string;
    follows_count?: number;
    followers_count?: number;
    biography?: string;
    website?: string;
  }> {
    const response = await this.makeRequest('/me?fields=id,username,account_type,media_count,name,profile_picture_url,follows_count,followers_count,biography,website', 'GET');
    return {
      id: response.id,
      username: response.username,
      account_type: response.account_type,
      media_count: response.media_count,
      name: response.name,
      profile_picture_url: response.profile_picture_url,
      follows_count: response.follows_count,
      followers_count: response.followers_count,
      biography: response.biography,
      website: response.website,
    };
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
}

export function createInstagramSDK(config: {
  accessToken: string;
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
