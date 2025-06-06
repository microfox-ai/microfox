import { z } from 'zod';
import { GoogleOAuthSdk, GoogleScope } from '@microfox/google-oauth';

// YouTube API base URL
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// YouTube SDK options schema using Zod for runtime validation
export const YouTubeSDKOptionsSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  clientId: z.string().optional(),
  clientSecret: z.string().optional(),
  scopes: z.array(z.string()).optional(),
});

export type YouTubeSDKOptions = z.infer<typeof YouTubeSDKOptionsSchema>;

// Channel resource schema for validation
export const YouTubeChannelSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  customUrl: z.string().optional(),
  thumbnails: z
    .record(
      z.string(),
      z.object({
        url: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    )
    .optional(),
  statistics: z
    .object({
      viewCount: z.string().optional(),
      subscriberCount: z.string().optional(),
      videoCount: z.string().optional(),
    })
    .optional(),
});

export type YouTubeChannel = z.infer<typeof YouTubeChannelSchema>;

// Video resource schema for validation
export const YouTubeVideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  thumbnails: z
    .record(
      z.string(),
      z.object({
        url: z.string(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    )
    .optional(),
  channelId: z.string(),
  channelTitle: z.string().optional(),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  duration: z.string().optional(),
  statistics: z
    .object({
      viewCount: z.string().optional(),
      likeCount: z.string().optional(),
      commentCount: z.string().optional(),
    })
    .optional(),
});

export type YouTubeVideo = z.infer<typeof YouTubeVideoSchema>;

// Custom error class for YouTube SDK authentication issues
export class YouTubeAuthError extends Error {
  tokenStatus: {
    isValid: boolean;
    expiresAt?: number;
    scopes?: string[];
    email?: string;
    error?: string;
  };

  constructor(
    message: string,
    tokenStatus: {
      isValid: boolean;
      expiresAt?: number;
      scopes?: string[];
      email?: string;
      error?: string;
    },
  ) {
    super(message);
    this.name = 'YouTubeAuthError';
    this.tokenStatus = tokenStatus;
  }
}

// Define schema for upload video options
export const UploadVideoOptionsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  privacyStatus: z.enum(['public', 'unlisted', 'private']).default('private'),
  videoFile: z.any(), // This accepts File, Blob or ArrayBuffer
});

export type UploadVideoOptions = z.infer<typeof UploadVideoOptionsSchema>;

/**
 * Creates a YouTube SDK instance with token validation and refresh capabilities
 */
export const createYouTubeSDKWithTokens = async (
  options: YouTubeSDKOptions,
) => {
  // Validate options with Zod
  const parsedOptions = YouTubeSDKOptionsSchema.parse(options);

  // Default Google OAuth scopes for YouTube if not provided
  const DEFAULT_YOUTUBE_SCOPES = [
    GoogleScope.YOUTUBE_READONLY
  ];

  // Create Google OAuth SDK instance
  const googleOAuthSdk = new GoogleOAuthSdk({
    clientId: parsedOptions.clientId || '',
    clientSecret: parsedOptions.clientSecret || '',
    redirectUri: '', // Not needed for token validation/refresh
    scopes: parsedOptions.scopes || DEFAULT_YOUTUBE_SCOPES,
  });

  // Validate the access token
  const tokenStatus = await googleOAuthSdk.validateAccessToken(
    parsedOptions.accessToken,
  );

  if (!tokenStatus.isValid) {
    throw new YouTubeAuthError(
      tokenStatus.error || 'Token validation failed',
      tokenStatus,
    );
  }

  // If we have a refresh token and the access token is expired, try to refresh it
  if (
    parsedOptions.refreshToken &&
    tokenStatus.expiresAt &&
    Date.now() >= tokenStatus.expiresAt
  ) {
    try {
      const refreshedTokens = await googleOAuthSdk.refreshAccessToken(
        parsedOptions.refreshToken,
      );
      parsedOptions.accessToken = refreshedTokens.accessToken;
    } catch (error) {
      throw new YouTubeAuthError(
        error instanceof Error ? error.message : 'Failed to refresh token',
        tokenStatus,
      );
    }
  }

  // We now have a valid token, so we can create the YouTube SDK
  const accessToken = parsedOptions.accessToken;

  // Helper to make authorized requests to the YouTube API
  const makeRequest = async (
    endpoint: string,
    method: string = 'GET',
    body?: any,
    contentType: string = 'application/json',
    params: Record<string, string> = {},
  ) => {
    // Build URL with query parameters
    const url = new URL(`${YOUTUBE_API_BASE_URL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Set up request options
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    // Add body if provided
    if (body) {
      if (body instanceof FormData) {
        // If body is FormData, don't set Content-Type, browser will set it with boundary
        options.body = body;
      } else {
        options.headers = {
          ...options.headers,
          'Content-Type': contentType,
        };
        options.body =
          contentType === 'application/json' ? JSON.stringify(body) : body;
      }
    }

    // Make the request
    const response = await fetch(url.toString(), options);

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message ||
          `API request failed: ${response.statusText}`,
      );
    }

    // Return JSON response
    return await response.json();
  };

  // Return the YouTube SDK object with methods
  return {
    /**
     * Returns token status information
     */
    getTokenStatus: () => tokenStatus,

    /**
     * Gets the authenticated user's channel information
     */
    getMyChannel: async (options?: { part?: string; fields?: string }) => {
      const {
        part = 'snippet,contentDetails,statistics',
        fields = 'items(id,snippet(title,description,customUrl,thumbnails),statistics)',
      } = options || {};

      const params: Record<string, string> = {
        part,
        mine: 'true',
        fields,
      };

      const response = await makeRequest(
        '/channels',
        'GET',
        undefined,
        'application/json',
        params,
      );

      // Extract and validate the first channel in the response
      if (response.items && response.items.length > 0) {
        const channelData = {
          id: response.items[0].id,
          title: response.items[0].snippet.title,
          description: response.items[0].snippet.description,
          customUrl: response.items[0].snippet.customUrl,
          thumbnails: response.items[0].snippet.thumbnails,
          statistics: response.items[0].statistics,
        };

        return YouTubeChannelSchema.parse(channelData);
      }

      throw new Error('No channel found for the authenticated user');
    },

    /**
     * Gets a specific channel by ID
     */
    getChannel: async (
      channelId: string,
      options?: {
        part?: string;
        fields?: string;
      },
    ) => {
      const {
        part = 'snippet,contentDetails,statistics',
        fields = 'items(id,snippet(title,description,customUrl,thumbnails),statistics)',
      } = options || {};

      const params: Record<string, string> = {
        part,
        id: channelId,
        fields,
      };

      const response = await makeRequest(
        '/channels',
        'GET',
        undefined,
        'application/json',
        params,
      );

      // Extract and validate the first channel in the response
      if (response.items && response.items.length > 0) {
        const channelData = {
          id: response.items[0].id,
          title: response.items[0].snippet.title,
          description: response.items[0].snippet.description,
          customUrl: response.items[0].snippet.customUrl,
          thumbnails: response.items[0].snippet.thumbnails,
          statistics: response.items[0].statistics,
        };

        return YouTubeChannelSchema.parse(channelData);
      }

      throw new Error(`Channel not found with ID: ${channelId}`);
    },

    /**
     * Lists videos for a specific channel
     */
    listChannelVideos: async (
      channelId: string,
      options?: {
        part?: string;
        maxResults?: number;
        pageToken?: string;
        order?: string;
        publishedAfter?: string;
        publishedBefore?: string;
        fields?: string;
      },
    ) => {
      const {
        part = 'contentDetails,fileDetails,id,liveStreamingDetails,localizations,paidProductPlacementDetails,player,processingDetails,recordingDetails,snippet,statistics,status,suggestions,topicDetails',
        maxResults = 50,
        pageToken,
        order = 'date',
        publishedAfter,
        publishedBefore,
        fields = 'kind,etag,nextPageToken,pageInfo,pageInfo.totalResults,pageInfo.resultsPerPage,items',
      } = options || {};

      const params: Record<string, string> = {
        part,
        channelId,
        maxResults: maxResults.toString(),
        order,
        fields,
      };

      if (pageToken) params.pageToken = pageToken;
      if (publishedAfter) params.publishedAfter = publishedAfter;
      if (publishedBefore) params.publishedBefore = publishedBefore;

      return makeRequest(
        '/search',
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Gets detailed information about a specific video
     */
    getVideo: async (
      videoId: string,
      options?: {
        part?: string;
        fields?: string;
      },
    ) => {
      const {
        part = 'contentDetails,fileDetails,id,liveStreamingDetails,localizations,paidProductPlacementDetails,player,processingDetails,recordingDetails,snippet,statistics,status,suggestions,topicDetails',
        fields = 'items',
      } = options || {};

      const params: Record<string, string> = {
        part,
        id: videoId,
        fields,
      };

      const response = await makeRequest(
        '/videos',
        'GET',
        undefined,
        'application/json',
        params,
      );

      // Extract and validate the first video in the response
      if (response.items && response.items.length > 0) {
        const videoData = {
          id: response.items[0].id,
          title: response.items[0].snippet.title,
          description: response.items[0].snippet.description,
          thumbnails: response.items[0].snippet.thumbnails,
          channelId: response.items[0].snippet.channelId,
          channelTitle: response.items[0].snippet.channelTitle,
          publishedAt: response.items[0].snippet.publishedAt,
          tags: response.items[0].snippet.tags,
          duration: response.items[0].contentDetails.duration,
          statistics: response.items[0].statistics,
        };

        return YouTubeVideoSchema.parse(videoData);
      }

      throw new Error(`Video not found with ID: ${videoId}`);
    },

    /**
     * Gets detailed information about multiple videos
     */
    getVideos: async (
      videoIds: string[],
      options?: {
        part?: string;
        fields?: string;
      },
    ) => {
      const {
        part = 'contentDetails,fileDetails,id,liveStreamingDetails,localizations,paidProductPlacementDetails,player,processingDetails,recordingDetails,snippet,statistics,status,suggestions,topicDetails',
        fields = 'kind,etag,nextPageToken,pageInfo,pageInfo.totalResults,pageInfo.resultsPerPage,items',
      } = options || {};

      const params: Record<string, string> = {
        part,
        id: videoIds.join(','),
        fields,
      };

      return makeRequest(
        '/videos',
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Searches for videos, channels, or playlists
     */
    search: async (
      query: string,
      options?: {
        part?: string;
        maxResults?: number;
        pageToken?: string;
        type?: string;
        order?: string;
        fields?: string;
        regionCode?: string;
        publishedAfter?: string;
        publishedBefore?: string;
      },
    ) => {
      const {
        part = 'snippet',
        maxResults = 25,
        pageToken,
        type = 'video',
        order = 'relevance',
        fields = 'nextPageToken,pageInfo,items(id,snippet)',
        regionCode,
        publishedAfter,
        publishedBefore,
      } = options || {};

      const params: Record<string, string> = {
        part,
        q: query,
        maxResults: maxResults.toString(),
        type,
        order,
        fields,
      };

      if (pageToken) params.pageToken = pageToken;
      if (regionCode) params.regionCode = regionCode;
      if (publishedAfter) params.publishedAfter = publishedAfter;
      if (publishedBefore) params.publishedBefore = publishedBefore;

      return makeRequest(
        '/search',
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Adds a comment to a video
     */
    addComment: async (videoId: string, text: string) => {
      const body = {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text,
            },
          },
        },
      };

      return makeRequest('/commentThreads', 'POST', body, 'application/json', {
        part: 'snippet',
      });
    },

    /**
     * Lists comments for a video
     */
    listComments: async (
      videoId: string,
      options?: {
        maxResults?: number;
        pageToken?: string;
        textFormat?: string;
        order?: string;
        fields?: string;
      },
    ) => {
      const {
        maxResults = 20,
        pageToken,
        textFormat = 'plainText',
        order = 'time',
        fields = 'nextPageToken,pageInfo,items',
      } = options || {};

      const params: Record<string, string> = {
        part: 'snippet',
        videoId,
        maxResults: maxResults.toString(),
        textFormat,
        order,
        fields,
      };

      if (pageToken) params.pageToken = pageToken;

      return makeRequest(
        '/commentThreads',
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Lists videos in a playlist
     */
    listPlaylistItems: async (
      playlistId: string,
      options?: {
        part?: string;
        maxResults?: number;
        pageToken?: string;
        fields?: string;
      },
    ) => {
      const {
        part = 'snippet,contentDetails',
        maxResults = 50,
        pageToken,
        fields = 'nextPageToken,pageInfo,items',
      } = options || {};

      const params: Record<string, string> = {
        part,
        playlistId,
        maxResults: maxResults.toString(),
        fields,
      };

      if (pageToken) params.pageToken = pageToken;

      return makeRequest(
        '/playlistItems',
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Uploads a video to YouTube (simplified version)
     * For larger uploads, a more complex implementation with resumable uploads would be needed
     */
    uploadVideo: async (options: UploadVideoOptions) => {
      const parsedOptions = UploadVideoOptionsSchema.parse(options);

      // Create the metadata part for the multipart upload
      const metadata = {
        snippet: {
          title: parsedOptions.title,
          description: parsedOptions.description || '',
          tags: parsedOptions.tags || [],
          categoryId: parsedOptions.categoryId || '22', // 22 is "People & Blogs"
        },
        status: {
          privacyStatus: parsedOptions.privacyStatus,
          embeddable: true,
          license: 'youtube',
        },
      };

      // Prepare the multipart request
      const boundary = '-------' + Math.random().toString(36).substring(2);

      // Create the multipart body
      const requestBody = await createMultipartBody(
        boundary,
        metadata,
        parsedOptions.videoFile,
      );

      // Set up the request options with appropriate headers
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': requestBody.size.toString(),
          'X-Upload-Content-Length': requestBody.size.toString(),
        },
        body: requestBody,
      };

      // Make the upload request to the videos.insert endpoint
      const response = await fetch(
        `${YOUTUBE_API_BASE_URL}/videos?part=snippet,status,id&uploadType=multipart`,
        requestOptions,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error uploading video: ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    },

    /**
     * Gets the user's playlists
     */
    getMyPlaylists: async (options?: {
      part?: string;
      maxResults?: number;
      pageToken?: string;
      fields?: string;
    }) => {
      const {
        part = 'snippet,contentDetails',
        maxResults = 50,
        pageToken,
        fields = 'nextPageToken,pageInfo,items',
      } = options || {};

      const params: Record<string, string> = {
        part,
        mine: 'true',
        maxResults: maxResults.toString(),
        fields,
      };

      if (pageToken) params.pageToken = pageToken;

      return makeRequest(
        '/playlists',
        'GET',
        undefined,
        'application/json',
        params,
      );
    },

    /**
     * Gets user info for the authenticated user
     */
    getUserInfo: async () => {
      return makeRequest('/channels', 'GET', undefined, 'application/json', {
        part: 'snippet',
        mine: 'true',
        fields: 'items(snippet(title,thumbnails))',
      });
    },
  };
};

/**
 * Creates a YouTube SDK instance from access token and optional refresh token
 */
export const createYouTubeSDK = (
  accessToken: string,
  refreshToken?: string,
  clientId?: string,
  clientSecret?: string,
  scopes?: string[],
) => {
  return createYouTubeSDKWithTokens({
    accessToken,
    refreshToken,
    clientId,
    clientSecret,
    scopes,
  });
};

export default createYouTubeSDK;

/**
 * Creates a multipart request body for video upload
 * @param boundary The boundary string for separating parts
 * @param metadata The video metadata
 * @param file The video file as Blob, File, or ArrayBuffer
 * @returns A Blob containing the multipart request body
 */
async function createMultipartBody(
  boundary: string,
  metadata: any,
  file: any,
): Promise<Blob> {
  const metadataPart =
    `--${boundary}\r\n` +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    '\r\n';

  const fileContentType = file.type || 'video/mp4';

  const filePart =
    `--${boundary}\r\n` + `Content-Type: ${fileContentType}\r\n\r\n`;

  const filePartBlob = new Blob([filePart], { type: 'text/plain' });
  const metadataPartBlob = new Blob([metadataPart], { type: 'text/plain' });
  const fileBlob = file instanceof Blob ? file : new Blob([file]);
  const endBoundaryBlob = new Blob([`\r\n--${boundary}--`], {
    type: 'text/plain',
  });

  return new Blob([metadataPartBlob, fileBlob, endBoundaryBlob], {
    type: `multipart/related; boundary=${boundary}`,
  });
}
