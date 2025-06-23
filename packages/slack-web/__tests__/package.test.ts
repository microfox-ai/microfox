import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { MicrofoxSlackClient, WebClient } from '../src/index';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config();

const slackBotToken = process.env.SLACK_BOT_TOKEN;
const testUserEmail = process.env.TEST_USER_EMAIL;

const envsAreSet = slackBotToken && testUserEmail;

if (!envsAreSet) {
  console.log(
    'SLACK_BOT_TOKEN and/or TEST_USER_EMAIL not set in .env. Skipping tests.'
  );
}

describe.skipIf(!envsAreSet)('MicrofoxSlackClient NPM Package', () => {
  let client: MicrofoxSlackClient;
  let testChannelId: string;
  let testUserId: string;
  let messageTs: string;
  const channelName = `npm-test-${randomBytes(4).toString('hex')}`;

  beforeAll(async () => {
    client = new MicrofoxSlackClient(slackBotToken!);

    console.log(`Creating channel: #${channelName}`);
    const createChannelResponse = await client.createChannel(channelName);
    if (!createChannelResponse?.id) {
        throw new Error('Failed to create test channel.');
    }
    testChannelId = createChannelResponse.id;
    console.log(`Channel #${channelName} created with ID: ${testChannelId}`);

    console.log(`Looking up user with email: ${testUserEmail!}`);
    const searchUserResponse = await client.searchUser(testUserEmail!);
    if (!searchUserResponse?.id) {
        throw new Error('Failed to find test user.');
    }
    testUserId = searchUserResponse.id;
    console.log(`Found user with ID: ${testUserId}`);
  }, 30000);

  afterAll(async () => {
    if (testChannelId) {
      console.log(`Leaving channel ${testChannelId}`);
      try {
        // @ts-ignore
        await client.conversations.leave({ channel: testChannelId });
        console.log(`Left channel #${channelName}. Please archive it manually.`);
      } catch (error) {
        console.error('Error leaving channel:', (error as Error).message);
      }
    }
  }, 30000);

  test('should add a user to the channel', async () => {
    console.log(`Adding user ${testUserId} to channel ${testChannelId}`);
    const response = await client.addUserToChannel(testChannelId, testUserId);
    expect(response.ok).toBe(true);
    console.log('User added to channel.');
  });
  
  test('should send a message to the channel', async () => {
    const testMessage = 'Hello from the Microfox NPM package test!';
    console.log(`Sending message to channel ${testChannelId}`);
    const response = await client.messageChannel(testChannelId, testMessage);
    expect(response.ok).toBe(true);
    expect(response.ts).toBeDefined();
    messageTs = response.ts as string;
    console.log(`Message sent with timestamp: ${messageTs}`);
  });
  
  test('should reply to the message in a thread', async () => {
    const replyText = 'This is a threaded reply!';
    console.log(`Replying to message ${messageTs}`);
    const response = await client.replyMessage(testChannelId, messageTs, replyText);
    expect(response.ok).toBe(true);
    console.log('Reply sent.');
  });

  test('should add a reaction to the message', async () => {
    const reactionName = 'thumbsup';
    console.log(`Adding reaction :${reactionName}: to message ${messageTs}`);
    const response = await client.reactMessage(testChannelId, messageTs, reactionName);
    expect(response.ok).toBe(true);
    console.log('Reaction added.');
  });
  
  test('should list users in the channel', async () => {
    console.log(`Listing users in channel ${testChannelId}`);
    const userIds = await client.listChannelUsers(testChannelId);
    expect(userIds).toBeInstanceOf(Array);
    expect(userIds).toContain(testUserId);
    console.log(`Found ${userIds?.length} user(s) in the channel.`);
  });

  test('should remove a user from the channel', async () => {
    console.log(`Removing user ${testUserId} from channel ${testChannelId}`);
    const response = await client.removeUserFromChannel(testChannelId, testUserId);
    expect(response.ok).toBe(true);
    console.log('User removed from channel.');
  });

}); 