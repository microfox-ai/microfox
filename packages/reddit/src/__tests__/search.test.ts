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

describe.skipIf(!envsAreSet)('Reddit SDK - Search', () => {
  let redditSdk: ReturnType<typeof createRedditSDK>;

  beforeAll(() => {
    redditSdk = createRedditSDK({
      clientId: REDDIT_CLIENT_ID!,
      clientSecret: REDDIT_CLIENT_SECRET!,
      accessToken: REDDIT_ACCESS_TOKEN!,
      refreshToken: REDDIT_REFRESH_TOKEN!,
    });
  });

  it('should perform a search', async () => {
    const response = await redditSdk.api.listings.search({ q: 'vitest', limit: 5 });
    console.log('search response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });

  it('should perform a search within a subreddit', async () => {
    const response = await redditSdk.api.listings.searchInSubreddit({ subreddit: 'typescript', q: 'testing', limit: 5 });
    console.log('subreddit search response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });
}); 