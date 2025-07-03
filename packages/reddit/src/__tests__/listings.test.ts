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

describe.skipIf(!envsAreSet)('Reddit SDK - Listings', () => {
  let redditSdk: ReturnType<typeof createRedditSDK>;

  beforeAll(() => {
    redditSdk = createRedditSDK({
      clientId: REDDIT_CLIENT_ID!,
      clientSecret: REDDIT_CLIENT_SECRET!,
      accessToken: REDDIT_ACCESS_TOKEN!,
      refreshToken: REDDIT_REFRESH_TOKEN!,
    });
  });

  it('should get the best posts', async () => {
    const response = await redditSdk.api.listings.getAllBest({ limit: 5 });
    console.log('getAllBest response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });

  it('should get hot posts from a subreddit', async () => {
    const response = await redditSdk.api.listings.getHotFromSubreddit({ subreddit: 'pics', limit: 5 });
    console.log('getHotFromSubreddit response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });

  it('should get new posts', async () => {
    const response = await redditSdk.api.listings.getAllNew({ limit: 5 });
    console.log('getAllNew response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });

  it('should get rising posts from a subreddit', async () => {
    const response = await redditSdk.api.listings.getRisingFromSubreddit({ subreddit: 'gifs', limit: 5 });
    console.log('getRisingFromSubreddit response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });

  it('should get top posts', async () => {
    const response = await redditSdk.api.listings.getAllSorted({ sort: 'top', limit: 5 });
    console.log('getAllSorted (top) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });

  it('should get controversial posts from a subreddit', async () => {
    const response = await redditSdk.api.listings.getSortedFromSubreddit({ subreddit: 'aww', sort: 'controversial', limit: 5 });
    console.log('getSorted (controversial) from subreddit response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
    expect(response.data.children.length).toBe(5);
  });
});
