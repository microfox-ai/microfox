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

describe.skipIf(!envsAreSet)('Reddit SDK - Account', () => {
  let redditSdk: ReturnType<typeof createRedditSDK>;

  beforeAll(() => {
    redditSdk = createRedditSDK({
      clientId: REDDIT_CLIENT_ID!,
      clientSecret: REDDIT_CLIENT_SECRET!,
      accessToken: REDDIT_ACCESS_TOKEN!,
      refreshToken: REDDIT_REFRESH_TOKEN!,
    });
  });

  it('should get my account information', async () => {
    const response = await redditSdk.api.account.getMe({});
    console.log('getMe response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.id).toBeDefined();
  });

  it('should get my karma', async () => {
    const response = await redditSdk.api.account.getMyKarma({});
    console.log('getMyKarma response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('KarmaList');
  });

  it('should get my friends', async () => {
    const response = await redditSdk.api.account.getMyFriends({});
    console.log('getMyFriends response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('UserList');
  });
}); 