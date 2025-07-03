import { describe, it, expect, beforeAll } from 'vitest';
import { createRedditSDK } from '../redditSdk';
import * as dotenv from 'dotenv';
import { randomBytes } from 'crypto';

dotenv.config();

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_ACCESS_TOKEN,
  REDDIT_REFRESH_TOKEN,
  TEST_FRIEND_USERNAME,
} = process.env;

const envsAreSet =
  REDDIT_CLIENT_ID &&
  REDDIT_CLIENT_SECRET &&
  REDDIT_ACCESS_TOKEN &&
  REDDIT_REFRESH_TOKEN &&
  TEST_FRIEND_USERNAME;

if (!envsAreSet) {
  console.log('Reddit credentials or test friend username not set in .env. Skipping tests.');
}

describe.skipIf(!envsAreSet)('Reddit SDK - Private Messages', () => {
  let redditSdk: ReturnType<typeof createRedditSDK>;
  const recipient = TEST_FRIEND_USERNAME!;

  beforeAll(() => {
    redditSdk = createRedditSDK({
      clientId: REDDIT_CLIENT_ID!,
      clientSecret: REDDIT_CLIENT_SECRET!,
      accessToken: REDDIT_ACCESS_TOKEN!,
      refreshToken: REDDIT_REFRESH_TOKEN!,
    });
  });

  it('should get messages from inbox', async () => {
    const response = await redditSdk.api.privateMessages.getMessages({ where: 'inbox' });
    console.log('getMessages (inbox) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });

  it('should get sent messages', async () => {
    const response = await redditSdk.api.privateMessages.getMessages({ where: 'sent' });
    console.log('getMessages (sent) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });

  it('should get unread messages', async () => {
    const response = await redditSdk.api.privateMessages.getMessages({ where: 'unread' });
    console.log('getMessages (unread) response:', JSON.stringify(response, null, 2));
    expect(response).toBeDefined();
    expect(response.kind).toBe('Listing');
  });
  
  it('should compose, manage, and delete a message', async () => {
    const subject = `Test Message: ${randomBytes(4).toString('hex')}`;
    const text = 'This is a test message from the Microfox Reddit SDK test suite.';
    
    // Compose
    console.log(`Composing message to ${recipient}`);
    const composeResponse = await redditSdk.api.privateMessages.composeMessage({
      to: recipient,
      subject,
      text,
    });
    console.log('composeMessage response:', JSON.stringify(composeResponse, null, 2));
    // The success of this is validated by finding the message in the next step.

    // Find the message in the sentbox to get its ID
    console.log('Fetching sent messages to find the new message...');
    // Give Reddit a moment to process the message
    await new Promise(resolve => setTimeout(resolve, 2000));
    const sentMessages = await redditSdk.api.privateMessages.getMessages({ where: 'sent', limit: 5 });
    const newMessage = sentMessages.data.children.find((msg: any) => msg.data.subject === subject);
    expect(newMessage).toBeDefined();
    const messageId = newMessage.data.name; // this is the fullname
    console.log(`Found message with ID: ${messageId}`);

    // Manage the message
    console.log('Marking message as read...');
    const readResponse = await redditSdk.api.privateMessages.readMessage({ id: messageId });
    expect(readResponse).toEqual({});
    
    console.log('Marking message as unread...');
    const unreadResponse = await redditSdk.api.privateMessages.unreadMessage({ id: messageId });
    expect(unreadResponse).toEqual({});
    
    console.log('Collapsing message...');
    const collapseResponse = await redditSdk.api.privateMessages.collapseMessage({ id: messageId });
    expect(collapseResponse).toEqual({});
    
    console.log('Uncollapsing message...');
    const uncollapseResponse = await redditSdk.api.privateMessages.uncollapseMessage({ id: messageId });
    expect(uncollapseResponse).toEqual({});

    // Delete
    console.log('Deleting message...');
    const deleteResponse = await redditSdk.api.privateMessages.deleteMessage({ id: messageId });
    expect(deleteResponse).toEqual({});

  }, 30000);

  it('should mark all messages as read', async () => {
    console.log('Marking all messages as read...');
    const response = await redditSdk.api.privateMessages.readAllMessages({});
    // This endpoint returns 202 Accepted, which our SDK handles as a successful empty response
    expect(response).toBe('');
  });
}); 