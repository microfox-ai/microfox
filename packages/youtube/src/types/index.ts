import { z } from 'zod';

export interface YouTubeSDKOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken: string;
  refreshToken: string;
}

export interface ListActivitiesParams {
  part: string[];
  channelId?: string;
  mine?: boolean;
  maxResults?: number;
  pageToken?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  regionCode?: string;
}

export interface ListCaptionsParams {
  part: string[];
  videoId: string;
  id?: string[];
  onBehalfOfContentOwner?: string;
}

export interface ListChannelSectionsParams {
  part: string[];
  channelId?: string;
  hl?: string;
  id?: string[];
  mine?: boolean;
  onBehalfOfContentOwner?: string;
}

export interface ListChannelsParams {
  part: string[];
  categoryId?: string;
  forUsername?: string;
  hl?: string;
  id?: string[];
  managedByMe?: boolean;
  maxResults?: number;
  mine?: boolean;
  mySubscribers?: boolean;
  onBehalfOfContentOwner?: string;
  pageToken?: string;
}

export interface UpdateChannelParams {
  part: string[];
  onBehalfOfContentOwner?: string;
}

export interface Activity {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelTitle: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    channelId: string;
    type: string;
  };
  contentDetails: {
    upload?: {
      videoId: string;
    };
    like?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
    };
    favorite?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
    };
    comment?: {
      resourceId: {
        kind: string;
        videoId: string;
        channelId: string;
      };
    };
    subscription?: {
      resourceId: {
        kind: string;
        channelId: string;
      };
    };
    playlistItem?: {
      resourceId: {
        kind: string;
        videoId: string;
      };
      playlistId: string;
      playlistItemId: string;
    };
    recommendation?: {
      resourceId: {
        kind: string;
        videoId: string;
        channelId: string;
      };
      reason: string;
    };
  };
}

export interface Caption {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    videoId: string;
    lastUpdated: string;
    trackKind: string;
    language: string;
    name: string;
    audioTrackType: string;
    isCC: boolean;
    isLarge: boolean;
    isEasyReader: boolean;
    isDraft: boolean;
    isAutoSynced: boolean;
    status: string;
  };
}

export interface ChannelSection {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    type: string;
    style: string;
    channelId: string;
    title?: string;
    position: number;
  };
  contentDetails: {
    playlists?: string[];
    channels?: string[];
  };
}

export interface Channel {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      };
    };
    defaultLanguage?: string;
    localized: {
      title: string;
      description: string;
    };
    country?: string;
  };
  contentDetails: {
    relatedPlaylists: {
      likes: string;
      favorites: string;
      uploads: string;
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export interface ActivityListResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Activity[];
}

export interface CaptionListResponse {
  kind: string;
  etag: string;
  items: Caption[];
}

export interface ChannelSectionListResponse {
  kind: string;
  etag: string;
  items: ChannelSection[];
}

export interface ChannelListResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Channel[];
}
