import { z } from 'zod';

export const YouTubeSDKOptionsSchema = z.object({
  clientId: z.string().min(1).describe('The OAuth 2.0 client ID'),
  clientSecret: z.string().min(1).describe('The OAuth 2.0 client secret'),
  redirectUri: z.string().url().describe('The OAuth 2.0 redirect URI'),
  accessToken: z.string().min(1).describe('The OAuth 2.0 access token'),
  refreshToken: z.string().min(1).describe('The OAuth 2.0 refresh token'),
});

export const ListActivitiesParamsSchema = z.object({
  part: z.array(z.string()).min(1).describe('The part parameter specifies a comma-separated list of one or more activity resource properties that the API response will include.'),
  channelId: z.string().optional().describe('The channelId parameter specifies a unique YouTube channel ID.'),
  mine: z.boolean().optional().describe('This parameter can only be used in a properly authorized request. Set this parameter\'s value to true to retrieve a feed of the authenticated user\'s activities.'),
  maxResults: z.number().int().min(0).max(50).optional().describe('The maxResults parameter specifies the maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. The default value is 5.'),
  pageToken: z.string().optional().describe('The pageToken parameter identifies a specific page in the result set that should be returned.'),
  publishedAfter: z.string().optional().describe('The publishedAfter parameter specifies the earliest date and time that an activity could have occurred for that activity to be included in the API response.'),
  publishedBefore: z.string().optional().describe('The publishedBefore parameter specifies the date and time before which an activity must have occurred for that activity to be included in the API response.'),
  regionCode: z.string().optional().describe('The regionCode parameter instructs the API to return results for the specified country.'),
});

export const ListCaptionsParamsSchema = z.object({
  part: z.array(z.string()).min(1).describe('The part parameter specifies a comma-separated list of one or more caption resource properties that the API response will include.'),
  videoId: z.string().describe('The videoId parameter specifies the YouTube video ID of the video for which the API should return caption tracks.'),
  id: z.array(z.string()).optional().describe('The id parameter specifies a comma-separated list of IDs that identify the caption resources that should be retrieved.'),
  onBehalfOfContentOwner: z.string().optional().describe('This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.'),
});

export const ListChannelSectionsParamsSchema = z.object({
  part: z.array(z.string()).min(1).describe('The part parameter specifies a comma-separated list of one or more channelSection resource properties that the API response will include.'),
  channelId: z.string().optional().describe('The channelId parameter specifies a YouTube channel ID.'),
  hl: z.string().optional().describe('The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports.'),
  id: z.array(z.string()).optional().describe('The id parameter specifies a comma-separated list of the YouTube channelSection ID(s) for the resource(s) that are being retrieved.'),
  mine: z.boolean().optional().describe('This parameter can only be used in a properly authorized request. Set this parameter\'s value to true to retrieve a feed of the authenticated user\'s channelSections.'),
  onBehalfOfContentOwner: z.string().optional().describe('This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.'),
});

export const ListChannelsParamsSchema = z.object({
  part: z.array(z.string()).min(1).describe('The part parameter specifies a comma-separated list of one or more channel resource properties that the API response will include.'),
  categoryId: z.string().optional().describe('The categoryId parameter specifies a YouTube guide category, thereby requesting YouTube channels associated with that category.'),
  forUsername: z.string().optional().describe('The forUsername parameter specifies a YouTube username, thereby requesting the channel associated with that username.'),
  hl: z.string().optional().describe('The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports.'),
  id: z.array(z.string()).optional().describe('The id parameter specifies a comma-separated list of the YouTube channel ID(s) for the resource(s) that are being retrieved.'),
  managedByMe: z.boolean().optional().describe('This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.'),
  maxResults: z.number().int().min(0).max(50).optional().describe('The maxResults parameter specifies the maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. The default value is 5.'),
  mine: z.boolean().optional().describe('This parameter can only be used in a properly authorized request. Set this parameter\'s value to true to instruct the API to only return channels owned by the authenticated user.'),
  mySubscribers: z.boolean().optional().describe('This parameter can only be used in a properly authorized request. Set this parameter\'s value to true to retrieve a list of channels that subscribed to the authenticated user\'s channel.'),
  onBehalfOfContentOwner: z.string().optional().describe('This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.'),
  pageToken: z.string().optional().describe('The pageToken parameter identifies a specific page in the result set that should be returned.'),
});

export const UpdateChannelParamsSchema = z.object({
  part: z.array(z.string()).min(1).describe('The part parameter serves two purposes in this operation. It identifies the properties that the write operation will set as well as the properties that the API response will include.'),
  onBehalfOfContentOwner: z.string().optional().describe('This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.'),
});
