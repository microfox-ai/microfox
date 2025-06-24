import { useState, useEffect, useCallback } from 'react';
import { createRedditSDK, RedditSDK } from '@microfox/reddit';
import {
  createRedditOAuth,
  RedditOAuthSdk,
  RedditOAuthConfig,
} from '@microfox/reddit-oauth';
import SdkTester, { SdkCategory } from '../components/SdkTester';

// Define function categories for better organization
const functionCategories: SdkCategory = {
  Authentication: [
    {
      name: 'validateAccessToken',
      description: 'Validate the current access token',
      params: {},
    },
    {
      name: 'refreshAccessToken',
      description: 'Refresh the access token using a refresh token',
      params: { refreshToken: '' },
      isObjectParam: false,
    },
  ],
  User: [
    {
      name: 'getMe',
      description: 'Get the identity of the authenticated user',
      params: {},
    },
    {
      name: 'getUser',
      description: 'Get information about a specific user',
      params: { username: '' },
      isObjectParam: false,
    },
    {
      name: 'getUserPreferences',
      description: 'Get user preferences',
      params: {},
    },
    {
      name: 'updateUserPreferences',
      description: 'Update user preferences',
      params: { prefs: {} },
      isObjectParam: false,
    },
    {
      name: 'getUserKarma',
      description: 'Get the karma of the authenticated user',
      params: {},
    },
    {
      name: 'getUserTrophies',
      description: 'Get user trophies',
      params: {},
    },
    {
      name: 'getUserContent',
      description: 'Get content posted by a user',
      params: {
        username: '',
        section: 'overview',
        after: '',
        before: '',
        count: 0,
        limit: 25,
      },
    },
  ],
  Subreddit: [
    {
      name: 'getSubredditInfo',
      description: 'Get information about a subreddit',
      params: { subreddit: '' },
      isObjectParam: false,
    },
    {
      name: 'searchSubreddit',
      description: 'Search within a subreddit',
      params: {
        subreddit: '',
        query: '',
        sort: 'relevance',
        t: 'all',
        after: '',
        before: '',
        count: 0,
        limit: 25,
      },
    },
  ],
  Search: [
    {
      name: 'search',
      description: 'Search across all of Reddit',
      params: {
        query: '',
        sort: 'relevance',
        t: 'all',
        after: '',
        before: '',
        count: 0,
        limit: 25,
      },
    },
  ],
  Posts: [
    {
      name: 'submitPost',
      description: 'Submit a new post to a subreddit',
      params: {
        subreddit: '',
        title: '',
        content: { text: '' },
      },
    },
    {
      name: 'getPost',
      description: 'Get information about a specific post',
      params: { id: '' },
      isObjectParam: false,
    },
    {
      name: 'vote',
      description: 'Vote on a post or comment',
      params: { id: '', direction: 1 },
      isObjectParam: false,
    },
    {
      name: 'deletePost',
      description: 'Delete a post',
      params: { id: '' },
      isObjectParam: false,
    },
    {
      name: 'editUserText',
      description: 'Edit a post or comment',
      params: { id: '', text: '' },
      isObjectParam: false,
    },
    {
      name: 'hidePost',
      description: 'Hide a post',
      params: { id: '' },
      isObjectParam: false,
    },
    {
      name: 'unhidePost',
      description: 'Unhide a post',
      params: { id: '' },
      isObjectParam: false,
    },
  ],
  Comments: [
    {
      name: 'submitComment',
      description: 'Submit a new comment',
      params: { parentId: '', text: '' },
      isObjectParam: false,
    },
    {
      name: 'getMoreComments',
      description: 'Get more comments for a post',
      params: { linkId: '', children: [] },
      isObjectParam: false,
    },
  ],
  Saved: [
    {
      name: 'saveItem',
      description: 'Save a post or comment',
      params: { id: '', category: '' },
    },
    {
      name: 'unsaveItem',
      description: 'Unsave a post or comment',
      params: { id: '' },
    },
  ],
  Other: [
    {
      name: 'reportItem',
      description: 'Report a post or comment',
      params: { id: '', reason: '' },
      isObjectParam: false,
    },
    {
      name: 'getInfo',
      description: 'Get information about multiple items',
      params: { ids: [] },
      isObjectParam: false,
    },
    {
      name: 'exampleMultiParamFunction',
      description: 'Example function with multiple non-object parameters',
      params: { param1: '', param2: 0, param3: true },
      isObjectParam: false,
    },
  ],
};

export default function UniversalTemplate() {
  const [redditSdk, setRedditSdk] = useState<RedditSDK | null>(null);
  const [redditOAuth, setRedditOAuth] = useState<RedditOAuthSdk | null>(null);

  useEffect(() => {
    // Initialize OAuth SDK on mount
    const oauthConfig: RedditOAuthConfig = {
      clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID || '',
      clientSecret: process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET || '',
      redirectUri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI || '',
      scopes: process.env.NEXT_PUBLIC_REDDIT_SCOPE?.split(',') || [],
    };

    const oauthSdk = createRedditOAuth(oauthConfig);
    setRedditOAuth(oauthSdk);
  }, []);

  const handleInitiateOAuth = useCallback(() => {
    const authUrl = redditOAuth?.getAuthUrl();
    if (authUrl) {
      window.location.href = authUrl;
    }
  }, [redditOAuth]);

  const handleAuthenticated = useCallback(
    (accessToken: string, refreshToken: string) => {
      // Initialize RedditSDK when tokens are available
      const oauthConfig: RedditOAuthConfig = {
        clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID || '',
        clientSecret: process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET || '',
        redirectUri: process.env.NEXT_PUBLIC_REDDIT_REDIRECT_URI || '',
        scopes: process.env.NEXT_PUBLIC_REDDIT_SCOPE?.split(',') || [],
      };

      const sdk = createRedditSDK({
        clientId: oauthConfig.clientId,
        clientSecret: oauthConfig.clientSecret,
        scopes: oauthConfig.scopes,
        accessToken,
        refreshToken,
      });
      setRedditSdk(sdk);
    },
    [],
  );

  return (
    <SdkTester
      mainSdk={redditSdk}
      functionCategories={functionCategories}
      sdkName="Reddit"
      onInitiateOAuth={handleInitiateOAuth}
      onAuthenticated={handleAuthenticated}
    />
  );
}
