import { describe, it, expect, beforeAll } from 'vitest';
import { createRedditSDK } from '../redditSdk';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_ACCESS_TOKEN,
  REDDIT_REFRESH_TOKEN,
} = process.env;

const envsAreSet =
  REDDIT_CLIENT_ID &&
  REDDIT_CLIENT_SECRET &&
  REDDIT_ACCESS_TOKEN &&
  REDDIT_REFRESH_TOKEN;

if (!envsAreSet) {
  console.log('Reddit credentials not set in .env. Skipping tests.');
}

describe.skipIf(!envsAreSet)('Reddit SDK - Subreddits', () => {
  let redditSdk: ReturnType<typeof createRedditSDK>;

  beforeAll(() => {
    redditSdk = createRedditSDK({
      clientId: REDDIT_CLIENT_ID!,
      clientSecret: REDDIT_CLIENT_SECRET!,
      accessToken: REDDIT_ACCESS_TOKEN!,
      refreshToken: REDDIT_REFRESH_TOKEN!,
    });
  });

  it('should search for subreddits by name', async () => {
    const response = await redditSdk.api.subreddits.searchRedditNamesPost({ query: 'ask', exact: false });
    console.log('searchRedditNamesPost response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    // The response for this is a bit complex, just checking if it runs
  });
  
  it('should get post requirements for a subreddit', async () => {
    const response = await redditSdk.api.subreddits.getPostRequirements({ subreddit: 'pics' });
    console.log('getPostRequirements response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    // Response varies, checking for execution
  });

  it('should get new subreddits', async () => {
    const response = await redditSdk.api.subreddits.getSubredditsWhere({ where: 'new', limit: 5 });
    console.log('getSubredditsWhere (new) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });

  it('should get popular subreddits', async () => {
    const response = await redditSdk.api.subreddits.getSubredditsWhere({ where: 'popular', limit: 5 });
    console.log('getSubredditsWhere (popular) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });
  
  it('should search for subreddits via listing', async () => {
    const response = await redditSdk.api.subreddits.searchSubredditsListing({ q: 'programming', limit: 5 });
    console.log('searchSubredditsListing response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });

  it('should search for subreddits via API', async () => {
    const response = await redditSdk.api.subreddits.searchSubreddits({ q: 'reactjs' });
    console.log('searchSubreddits (POST) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.subreddits).toBeInstanceOf(Array);
  });

  it('should get default subreddits', async () => {
    const response = await redditSdk.api.subreddits.getSubredditsWhere({ where: 'default', limit: 5 });
    console.log('getSubredditsWhere (default) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });

  it('should get gold subreddits', async () => {
    const response = await redditSdk.api.subreddits.getSubredditsWhere({ where: 'gold', limit: 5 });
    console.log('getSubredditsWhere (gold) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  }, 15000);
}); 