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

// New schemas for Welcome Message Flows
const InstagramQuickReplySchema = z.object({
  content_type: z.literal('text').describe('Type of quick reply (currently only text is supported)'),
  title: z.string().describe('Text shown in the quick reply button'),
  payload: z.string().describe('Content sent via webhook when this quick reply is selected'),
});

const InstagramWelcomeMessageSchema = z.object({
  text: z.string().describe('The welcome message text'),
  quick_replies: z.array(InstagramQuickReplySchema).optional().describe('Array of quick reply options'),
});

const InstagramWelcomeMessageFlowSchema = z.object({
  eligible_platforms: z.array(z.literal('instagram')).describe('Platforms where the welcome message can be shown (only Instagram is supported)'),
  name: z.string().describe('Name of the welcome message flow'),
  welcome_message_flow: z.array(z.object({
    message: InstagramWelcomeMessageSchema,
  })).describe('Array of message objects containing the welcome message and quick replies'),
});

const InstagramWelcomeMessageFlowUpdateSchema = z.object({
  flow_id: z.string().describe('ID of the flow to update'),
  name: z.string().optional().describe('New name for the flow'),
  welcome_message: z.any().optional().describe('Updated welcome message content'),
  platforms: z.array(z.string()).optional().describe('Updated eligible platforms'),
});

// Enhanced Insights schemas
const InstagramInsightsMetricSchema = z.enum([
  'reach',
  'follower_count',
  'website_clicks',
  'profile_views',
  'online_followers',
  'accounts_engaged',
  'total_interactions',
  'likes',
  'comments',
  'shares',
  'saves',
  'replies',
  'engaged_audience_demographics',
  'reached_audience_demographics',
  'follower_demographics',
  'follows_and_unfollows',
  'profile_links_taps',
  'views',
  'threads_likes',
  'threads_replies',
  'reposts',
  'quotes',
  'threads_followers',
  'threads_follower_demographics',
  'content_views',
  'threads_views',
  'threads_clicks',
]).describe('Available Instagram insights metrics (updated to match current API)');

const InstagramEnhancedInsightsSchema = z.object({
  metric: z.array(InstagramInsightsMetricSchema).describe('Array of metric names to retrieve'),
  period: z.enum(['day', 'week', 'days_28', 'lifetime']).describe('Time period for the metrics'),
  since: z.string().optional().describe('Start date for the insights period (YYYY-MM-DD)'),
  until: z.string().optional().describe('End date for the insights period (YYYY-MM-DD)'),
}).describe('Enhanced schema for retrieving Instagram insights with date ranges');

// Mentions API schemas
const InstagramMentionReplySchema = z.object({
  media_id: z.string().optional().describe('ID of the media where the mention occurred'),
  comment_id: z.string().optional().describe('ID of the comment where the mention occurred'),
  message: z.string().describe('Reply message to the mention'),
}).refine((data) => {
  // Either media_id or comment_id must be provided
  return data.media_id || data.comment_id;
}, {
  message: "Either media_id or comment_id must be provided",
  path: [],
}).describe('Schema for replying to Instagram mentions');

const InstagramMentionFiltersSchema = z.object({
  limit: z.number().optional().describe('Number of mentions to retrieve'),
  after: z.string().optional().describe('Cursor for pagination'),
  before: z.string().optional().describe('Cursor for pagination'),
}).describe('Schema for filtering mentions');

// Conversations API schemas
const InstagramConversationFiltersSchema = z.object({
  platform: z.literal('instagram').optional().describe('Platform filter (only Instagram is supported)'),
  user_id: z.string().optional().describe('Instagram-scoped ID for specific user conversation'),
  limit: z.number().optional().describe('Number of conversations to retrieve'),
  after: z.string().optional().describe('Cursor for pagination'),
  before: z.string().optional().describe('Cursor for pagination'),
}).describe('Schema for filtering conversations');

const InstagramMessageFieldsSchema = z.object({
  fields: z.array(z.enum([
    'id',
    'created_time',
    'from',
    'to',
    'message',
    'to',
    'from',
    'message'
  ])).optional().describe('Fields to retrieve for messages'),
}).describe('Schema for message field selection');

const InstagramConversationFieldsSchema = z.object({
  fields: z.array(z.enum([
    'id',
    'updated_time',
    'messages'
  ])).optional().describe('Fields to retrieve for conversations'),
}).describe('Schema for conversation field selection');

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
        InstagramScope.INSTAGRAM_BUSINESS_MANAGE_INSIGHTS,
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

  // Welcome Message Flows Methods
  /**
   * Creates a new welcome message flow for Instagram ads
   * @param flowData The welcome message flow configuration
   * @returns Promise that resolves to the created flow ID
   */
  async createWelcomeMessageFlow(
    flowData: z.infer<typeof InstagramWelcomeMessageFlowSchema>,
  ): Promise<{ flow_id: string }> {
    const validatedData = InstagramWelcomeMessageFlowSchema.parse(flowData);
    return await this.makeRequest('/me/welcome_message_flows', 'POST', validatedData);
  }

  /**
   * Gets all welcome message flows for the authenticated user
   * @param limit Optional limit on the number of flows to return
   * @returns Promise that resolves to an array of welcome message flows
   */
  async getWelcomeMessageFlows(limit?: number): Promise<any[]> {
    const queryParams = limit ? `?limit=${limit}` : '';
    return await this.makeRequest(`/me/welcome_message_flows${queryParams}`, 'GET');
  }

  /**
   * Gets a specific welcome message flow by ID
   * @param flowId The ID of the flow to retrieve
   * @returns Promise that resolves to the welcome message flow details
   */
  async getWelcomeMessageFlow(flowId: string): Promise<any> {
    return await this.makeRequest(`/me/welcome_message_flows?flow_id=${flowId}`, 'GET');
  }

  /**
   * Updates an existing welcome message flow
   * @param flowId The ID of the flow to update
   * @param updates The updates to apply to the flow
   * @returns Promise that resolves to success status
   */
  async updateWelcomeMessageFlow(
    flowId: string,
    updates: Partial<{
      name: string;
      welcome_message: any;
      platforms: string[];
    }>,
  ): Promise<{ success: boolean }> {
    const updateData = {
      flow_id: flowId,
      ...updates,
    };
    return await this.makeRequest('/me/welcome_message_flows', 'POST', updateData);
  }

  /**
   * Deletes a welcome message flow
   * @param flowId The ID of the flow to delete
   * @returns Promise that resolves to success status
   */
  async deleteWelcomeMessageFlow(flowId: string): Promise<{ success: boolean }> {
    return await this.makeRequest('/me/welcome_message_flows', 'DELETE', {
      flow_id: flowId,
    });
  }

  // Enhanced Insights Methods
  /**
   * Gets enhanced insights for media with date ranges and more metrics
   * @param mediaId The ID of the media to get insights for
   * @param insightsData Enhanced insights configuration with date ranges
   * @returns Promise that resolves to enhanced insights data
   */
  async getEnhancedMediaInsights(
    mediaId: string,
    insightsData: z.infer<typeof InstagramEnhancedInsightsSchema>,
  ): Promise<any> {
    const validatedData = InstagramEnhancedInsightsSchema.parse(insightsData);
    const queryParams = new URLSearchParams({
      metric: validatedData.metric.join(','),
      period: validatedData.period,
      ...(validatedData.since && { since: validatedData.since }),
      ...(validatedData.until && { until: validatedData.until }),
    }).toString();
    return await this.makeRequest(`/${mediaId}/insights?${queryParams}`, 'GET');
  }

  /**
   * Gets enhanced insights for account with date ranges and more metrics
   * @param accountId The ID of the account to get insights for
   * @param insightsData Enhanced insights configuration with date ranges
   * @returns Promise that resolves to enhanced insights data
   */
  async getEnhancedAccountInsights(
    accountId: string,
    insightsData: z.infer<typeof InstagramEnhancedInsightsSchema>,
  ): Promise<any> {
    const validatedData = InstagramEnhancedInsightsSchema.parse(insightsData);
    const queryParams = new URLSearchParams({
      metric: validatedData.metric.join(','),
      period: validatedData.period,
      ...(validatedData.since && { since: validatedData.since }),
      ...(validatedData.until && { until: validatedData.until }),
    }).toString();
    return await this.makeRequest(`/${accountId}/insights?${queryParams}`, 'GET');
  }

  /**
   * Gets available insights metrics for the authenticated account
   * @param accountId The ID of the account
   * @returns Promise that resolves to available metrics
   */
  async getAvailableInsightsMetrics(accountId: string): Promise<any> {
    return await this.makeRequest(`/${accountId}/insights?metric=reach&period=day`, 'GET');
  }

  // Mentions API Methods
  /**
   * Gets media objects where the Instagram Business account has been tagged or @mentioned
   * @param accountId The Instagram Business account ID
   * @param filters Optional filters for pagination and limiting results
   * @returns Promise that resolves to mentions data
   */
  async getMentions(
    accountId: string,
    filters?: z.infer<typeof InstagramMentionFiltersSchema>,
  ): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      const validatedFilters = InstagramMentionFiltersSchema.parse(filters);
      if (validatedFilters.limit) {
        queryParams.append('limit', validatedFilters.limit.toString());
      }
      if (validatedFilters.after) {
        queryParams.append('after', validatedFilters.after);
      }
      if (validatedFilters.before) {
        queryParams.append('before', validatedFilters.before);
      }
    }

    const endpoint = `/${accountId}/tags${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Replies to a mention in a comment or media caption
   * @param accountId The Instagram Business account ID
   * @param replyData The reply data including message and target (media_id or comment_id)
   * @returns Promise that resolves to the reply result
   */
  async replyToMention(
    accountId: string,
    replyData: z.infer<typeof InstagramMentionReplySchema>,
  ): Promise<any> {
    const validatedData = InstagramMentionReplySchema.parse(replyData);
    return await this.makeRequest(`/${accountId}/mentions`, 'POST', validatedData);
  }

  /**
   * Gets detailed information about a specific mention
   * @param accountId The Instagram Business account ID
   * @param mediaId The ID of the media where the mention occurred
   * @returns Promise that resolves to detailed mention information
   */
  async getMentionDetails(accountId: string, mediaId: string): Promise<any> {
    return await this.makeRequest(`/${mediaId}?fields=id,caption,media_type,media_url,permalink,timestamp,username`, 'GET');
  }

  /**
   * Gets all mentions for the authenticated account with pagination
   * @param accountId The Instagram Business account ID
   * @param options Optional parameters for pagination and filtering
   * @returns Promise that resolves to all mentions with pagination info
   */
  async getAllMentions(
    accountId: string,
    options?: {
      limit?: number;
      after?: string;
      before?: string;
    },
  ): Promise<{
    data: any[];
    paging?: {
      cursors?: {
        before?: string;
        after?: string;
      };
      next?: string;
      previous?: string;
    };
  }> {
    const filters: z.infer<typeof InstagramMentionFiltersSchema> = {};
    
    if (options?.limit) filters.limit = options.limit;
    if (options?.after) filters.after = options.after;
    if (options?.before) filters.before = options.before;

    return await this.getMentions(accountId, filters);
  }

  // Conversations API Methods
  /**
   * Gets a list of conversations for the Instagram professional account
   * @param accountId The Instagram professional account ID
   * @param filters Optional filters for platform, user_id, and pagination
   * @returns Promise that resolves to conversations data
   */
  async getConversations(
    accountId: string,
    filters?: z.infer<typeof InstagramConversationFiltersSchema>,
  ): Promise<{
    data: Array<{
      id: string;
      updated_time: string;
    }>;
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      const validatedFilters = InstagramConversationFiltersSchema.parse(filters);
      if (validatedFilters.platform) {
        queryParams.append('platform', validatedFilters.platform);
      }
      if (validatedFilters.user_id) {
        queryParams.append('user_id', validatedFilters.user_id);
      }
      if (validatedFilters.limit) {
        queryParams.append('limit', validatedFilters.limit.toString());
      }
      if (validatedFilters.after) {
        queryParams.append('after', validatedFilters.after);
      }
      if (validatedFilters.before) {
        queryParams.append('before', validatedFilters.before);
      }
    }

    const endpoint = `/${accountId}/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Gets conversations for the authenticated user (using /me endpoint)
   * @param filters Optional filters for platform, user_id, and pagination
   * @returns Promise that resolves to conversations data
   */
  async getMyConversations(
    filters?: z.infer<typeof InstagramConversationFiltersSchema>,
  ): Promise<{
    data: Array<{
      id: string;
      updated_time: string;
    }>;
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      const validatedFilters = InstagramConversationFiltersSchema.parse(filters);
      if (validatedFilters.platform) {
        queryParams.append('platform', validatedFilters.platform);
      }
      if (validatedFilters.user_id) {
        queryParams.append('user_id', validatedFilters.user_id);
      }
      if (validatedFilters.limit) {
        queryParams.append('limit', validatedFilters.limit.toString());
      }
      if (validatedFilters.after) {
        queryParams.append('after', validatedFilters.after);
      }
      if (validatedFilters.before) {
        queryParams.append('before', validatedFilters.before);
      }
    }

    const endpoint = `/me/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Gets a conversation with a specific user
   * @param accountId The Instagram professional account ID
   * @param userId The Instagram-scoped ID for the specific user
   * @returns Promise that resolves to the conversation data
   */
  async getConversationWithUser(
    accountId: string,
    userId: string,
  ): Promise<{
    data: Array<{
      id: string;
    }>;
  }> {
    const queryParams = new URLSearchParams({
      user_id: userId,
    });

    const endpoint = `/${accountId}/conversations?${queryParams.toString()}`;
    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Gets messages in a specific conversation
   * @param conversationId The conversation ID
   * @returns Promise that resolves to messages data
   */
  async getConversationMessages(conversationId: string): Promise<{
    messages: {
      data: Array<{
        id: string;
        created_time: string;
      }>;
    };
    id: string;
  }> {
    const endpoint = `/${conversationId}?fields=messages`;
    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Gets detailed information about a specific message
   * @param messageId The message ID
   * @param fields Optional array of fields to retrieve
   * @returns Promise that resolves to detailed message information
   */
  async getMessageDetails(
    messageId: string,
    fields?: z.infer<typeof InstagramMessageFieldsSchema>,
  ): Promise<{
    id: string;
    created_time: string;
    from?: {
      username: string;
      id: string;
    };
    to?: {
      data: Array<{
        username: string;
        id: string;
      }>;
    };
    message?: string;
  }> {
    let endpoint = `/${messageId}`;
    
    if (fields) {
      const validatedFields = InstagramMessageFieldsSchema.parse(fields);
      if (validatedFields.fields && validatedFields.fields.length > 0) {
        endpoint += `?fields=${validatedFields.fields.join(',')}`;
      }
    }

    return await this.makeRequest(endpoint, 'GET');
  }

  /**
   * Gets all conversations with pagination support
   * @param accountId The Instagram professional account ID
   * @param options Optional parameters for filtering and pagination
   * @returns Promise that resolves to all conversations with pagination info
   */
  async getAllConversations(
    accountId: string,
    options?: {
      platform?: 'instagram';
      user_id?: string;
      limit?: number;
      after?: string;
      before?: string;
    },
  ): Promise<{
    data: Array<{
      id: string;
      updated_time: string;
    }>;
    paging?: {
      cursors?: {
        before?: string;
        after?: string;
      };
      next?: string;
      previous?: string;
    };
  }> {
    const filters: z.infer<typeof InstagramConversationFiltersSchema> = {};
    
    if (options?.platform) filters.platform = options.platform;
    if (options?.user_id) filters.user_id = options.user_id;
    if (options?.limit) filters.limit = options.limit;
    if (options?.after) filters.after = options.after;
    if (options?.before) filters.before = options.before;

    return await this.getConversations(accountId, filters);
  }

  /**
   * Gets recent messages from a conversation (last 20 messages only)
   * @param conversationId The conversation ID
   * @param fields Optional array of fields to retrieve for each message
   * @returns Promise that resolves to recent messages with details
   */
  async getRecentMessages(
    conversationId: string,
    fields?: z.infer<typeof InstagramMessageFieldsSchema>,
  ): Promise<{
    messages: {
      data: Array<{
        id: string;
        created_time: string;
        from?: {
          username: string;
          id: string;
        };
        to?: {
          data: Array<{
            username: string;
            id: string;
          }>;
        };
        message?: string;
      }>;
    };
    id: string;
  }> {
    // First get message IDs
    const messagesData = await this.getConversationMessages(conversationId);
    
    // Then get details for each message (limited to 20 most recent)
    const messageDetails = await Promise.all(
      messagesData.messages.data.slice(0, 20).map(async (message) => {
        return await this.getMessageDetails(message.id, fields);
      })
    );

    return {
      messages: {
        data: messageDetails,
      },
      id: conversationId,
    };
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
  InstagramQuickReplySchema,
  InstagramWelcomeMessageSchema,
  InstagramWelcomeMessageFlowSchema,
  InstagramWelcomeMessageFlowUpdateSchema,
  InstagramInsightsMetricSchema,
  InstagramEnhancedInsightsSchema,
  InstagramMentionReplySchema,
  InstagramMentionFiltersSchema,
  InstagramConversationFiltersSchema,
  InstagramMessageFieldsSchema,
  InstagramConversationFieldsSchema,
};
