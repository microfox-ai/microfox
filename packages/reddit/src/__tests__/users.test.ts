import { describe, it, expect, beforeAll } from 'vitest';
import { createRedditSDK } from '../redditSdk';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_ACCESS_TOKEN,
  REDDIT_REFRESH_TOKEN,
  TEST_REDDIT_USERNAME,
  TEST_FRIEND_USERNAME,
} = process.env;

const envsAreSet =
  REDDIT_CLIENT_ID &&
  REDDIT_CLIENT_SECRET &&
  REDDIT_ACCESS_TOKEN &&
  REDDIT_REFRESH_TOKEN &&
  TEST_REDDIT_USERNAME &&
  TEST_FRIEND_USERNAME;

if (!envsAreSet) {
  console.log('Reddit credentials, test username, or test friend username not set in .env. Skipping tests.');
}

describe.skipIf(!envsAreSet)('Reddit SDK - Users', () => {
  let redditSdk: ReturnType<typeof createRedditSDK>;
  const testUsername = TEST_REDDIT_USERNAME!;
  const friendUsername = TEST_FRIEND_USERNAME!;

  beforeAll(() => {
    redditSdk = createRedditSDK({
      clientId: REDDIT_CLIENT_ID!,
      clientSecret: REDDIT_CLIENT_SECRET!,
      accessToken: REDDIT_ACCESS_TOKEN!,
      refreshToken: REDDIT_REFRESH_TOKEN!,
    });
  });

  // it('should check if a username is available', async () => {
  //   const isAvailable = await redditSdk.api.users.usernameAvailable({ user: 'Doge_Coin_1000' });
  //   console.log('usernameAvailable response:', JSON.stringify(isAvailable, null, 2));
  //   expect(isAvailable).toBe(true);
  // });

  // it('should get user about information', async () => {
  //   const userAbout = await redditSdk.api.users.getUserAbout({ username: testUsername });
  //   console.log('getUserAbout response:', JSON.stringify(userAbout, null, 2));
  //   expect(userAbout).toBeDefined();
  //   expect(userAbout.kind).toBe('t2');
  //   expect(userAbout.data.name).toBe(testUsername);
  // });

  // it('should get user submitted posts', async () => {
  //   const submitted = await redditSdk.api.users.getUserProfileWhere({ username: testUsername, where: 'submitted' });
  //   console.log('getUserProfileWhere (submitted) response:', JSON.stringify(submitted, null, 2));
  //   expect(submitted).toBeDefined();
  //   expect(submitted.kind).toBe('Listing');
  // });

  // it('should fail to get user upvoted posts (private)', async () => {
  //   // await expect(redditSdk.api.users.getUserProfileWhere({ username: testUsername, where: 'upvoted' })).rejects.toThrow();
  //   const response = await redditSdk.api.users.getUserProfileWhere({ username: testUsername, where: 'upvoted' });
  //   console.log('getUserProfileWhere (upvoted) response:', JSON.stringify(response, null, 2));
  //   expect(response).toBeDefined();
  //   expect(response.kind).toBe('Listing');
  // });

  // it('should get new users', async () => {
  //   const response = await redditSdk.api.users.getUsersWhere({ where: 'new', limit: 5 });
  //   console.log('getUsersWhere (new) response:', JSON.stringify(response, null, 2));
  //   expect(response).toBeDefined();
  //   expect(response.kind).toBe('Listing');
  // });

  // it('should get popular users', async () => {
  //   const response = await redditSdk.api.users.getUsersWhere({ where: 'popular', limit: 5 });
  //   console.log('getUsersWhere (popular) response:', JSON.stringify(response, null, 2));
  //   expect(response).toBeDefined();
  //   expect(response.kind).toBe('Listing');
  // });

  // it('should search for users', async () => {
  //   const response = await redditSdk.api.users.searchUsers({ q: 'test', limit: 5 });
  //   console.log('searchUsers response:', JSON.stringify(response, null, 2));
  //   expect(response).toBeDefined();
  //   expect(response.kind).toBe('Listing');
  // });

  it('should add and remove a friend', async () => {
    // Add friend
    console.log(`Adding friend: ${friendUsername}`);
    const addResponse = await redditSdk.api.account.addFriend({ username: friendUsername, note: 'test' });
    console.log('addFriend response:', JSON.stringify(addResponse, null, 2));
    expect(addResponse).toBeDefined();
    expect(addResponse.name).toBe(friendUsername);

    // Verify friend is in list
    let friendsList = await redditSdk.api.account.getMyFriends({});
    let friendNames = friendsList.data.children.map((friend: any) => friend.name);
    expect(friendNames).toContain(friendUsername);

    // Remove friend
    console.log(`Removing friend: ${friendUsername}`);
    const removeResponse = await redditSdk.api.account.removeFriend({ username: friendUsername });
    expect(removeResponse).toBe(''); // Expect an empty string for a 204 response

    // Verify friend is not in list
    friendsList = await redditSdk.api.account.getMyFriends({});
    friendNames = friendsList.data.children.map((friend: any) => friend.name);
    expect(friendNames).not.toContain(friendUsername);
  }, 50000);
});