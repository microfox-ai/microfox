import { z } from 'zod';
import { createRedditOAuth } from '@microfox/reddit-oauth';
import {
  RedditSDKConfig,
  User,
  Post,
  Comment,
  Subreddit,
  SearchResult,
  VoteDirection,
  ListingParams,
} from './types';
import {
  redditSDKConfigSchema,
  userSchema,
  postSchema,
  commentSchema,
  subredditSchema,
  searchResultSchema,
  voteDirectionSchema,
  listingParamsSchema,
} from './schemas';
import * as accountSchemas from './schemas/account';
import * as accountTypes from './types/account';
import * as announcementSchemas from './schemas/announcements';
import * as announcementTypes from './types/announcements';
import * as collectionSchemas from './schemas/collections';
import * as collectionTypes from './types/collections';
import * as emojiSchemas from './schemas/emoji';
import * as emojiTypes from './types/emoji';
import * as flairSchemas from './schemas/flair';
import * as flairTypes from './types/flair';
import * as linksAndCommentsSchemas from './schemas/linksAndComments';
import * as linksAndCommentsTypes from './types/linksAndComments';
import * as listingsSchemas from './schemas/listings';
import * as listingsTypes from './types/listings';
import * as liveThreadsSchemas from './schemas/liveThreads';
import * as liveThreadsTypes from './types/liveThreads';
import * as privateMessagesSchemas from './schemas/privateMessages';
import * as privateMessagesTypes from './types/privateMessages';
import * as miscSchemas from './schemas/misc';
import * as miscTypes from './types/misc';
import * as moderationSchemas from './schemas/moderation';
import * as moderationTypes from './types/moderation';
import * as newModmailSchemas from './schemas/newModmail';
import * as newModmailTypes from './types/newModmail';
import { Endpoints } from './routes';

type EndpointMethods = {
  [key in keyof typeof Endpoints]: {
    [key2 in keyof typeof Endpoints[key]]: (
      params?: any,
    ) => Promise<any>;
  };
};

export class RedditSDK {
  private oauth: ReturnType<typeof createRedditOAuth>;
  private accessToken: string;
  private baseUrl = 'https://oauth.reddit.com';

  constructor(config: RedditSDKConfig) {
    const validatedConfig = redditSDKConfigSchema.parse(config);
    this.oauth = createRedditOAuth({
      clientId: validatedConfig.clientId,
      clientSecret: validatedConfig.clientSecret,
      redirectUri: validatedConfig.redirectUri,
      scopes: validatedConfig.scopes,
    });
    this.accessToken = validatedConfig.accessToken;
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `Reddit API error: ${response.status} ${response.statusText}`,
      );
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
        const json = await response.json();
        return json as T;
    }

    return response.text() as unknown as T;
  }

  public api: EndpointMethods = new Proxy({} as EndpointMethods, {
    get: (target: any, prop: string) => {
      if (!target[prop]) {
        target[prop] = new Proxy({}, {
          get: (subTarget: any, subProp: string) => {
            if (!subTarget[subProp]) {
              const endpointInfo = (Endpoints as any)[prop]?.[subProp];
              if (!endpointInfo) {
                throw new Error(`Endpoint ${prop}.${subProp} does not exist.`);
              }

              subTarget[subProp] = async (params: any = {}) => {
                let url = endpointInfo.url;
                const queryParams: Record<string, string> = {};
                const bodyParams: Record<string, any> = {};

                // Replace path parameters
                for (const key in params) {
                  if (url.includes(`{${key}}`)) {
                    url = url.replace(`{${key}}`, String(params[key]));
                    delete params[key];
                  }
                }
                
                // Remove any remaining optional path segments
                url = url.replace(/{\/?[^}]+}/g, '');

                let method = endpointInfo.method;
                if (Array.isArray(method)) {
                  const providedMethod = (params.method || method[0]).toUpperCase();
                  if (!method.includes(providedMethod)) {
                    throw new Error(`Invalid method ${providedMethod} for endpoint ${prop}.${subProp}. Available methods are ${method.join(', ')}`);
                  }
                  method = providedMethod;
                  delete params.method;
                }
                
                // Separate query and body params
                if (method === 'GET' || method === 'DELETE') {
                    Object.assign(queryParams, params);
                } else {
                    Object.assign(bodyParams, params);
                }

                if (endpointInfo.params) {
                  Object.assign(method === 'GET' || method === 'DELETE' ? queryParams : bodyParams, endpointInfo.params);
                }

                let finalUrl = url;
                if (Object.keys(queryParams).length > 0) {
                    const search = new URLSearchParams(queryParams).toString();
                    if(search) {
                        finalUrl += `?${search}`;
                    }
                }
                
                const body = Object.keys(bodyParams).length > 0 ? bodyParams : undefined;

                const result = await this.request(finalUrl, method, body);

                if (endpointInfo.responseSchema) {
                    return endpointInfo.responseSchema.parse(result);
                }

                return result;
              };
            }
            return subTarget[subProp];
          },
        });
      }
      return target[prop];
    },
  });
}

export function createRedditSDK(config: RedditSDKConfig): RedditSDK {
  return new RedditSDK(config);
}