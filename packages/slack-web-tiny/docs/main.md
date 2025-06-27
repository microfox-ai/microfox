# Slack Web Tiny SDK

A lightweight, type-safe SDK for interacting with the Slack Web API.

## Installation

```bash
npm install @microfox/slack-web-tiny
```

## Usage

```typescript
import { createSlackSDK } from '@microfox/slack-web-tiny';

// Initialize the SDK with your Slack bot token
const slackSDK = createSlackSDK({
  botToken: process.env.SLACK_BOT_TOKEN ?? 'xoxb-your-bot-token',
  authType: 'header',
  baseUrl: 'https://slack.com/api',
});
```

## API Reference

### `createSlackSDK(config: SlackSDKConfig)`

Creates a new instance of the Slack SDK.

#### Config Options

- `botToken` (string, required): Your Slack bot user OAuth token
- `authType` ('header' | 'query', optional): Authentication method (defaults to 'header')
- `baseUrl` (string, optional): Override the default Slack API URL (defaults to 'https://slack.com/api')

## Error Handling

The SDK uses Zod for runtime type validation and will throw errors if:

- The message payload doesn't match the expected schema
- The API response doesn't match the expected schema
- The API request fails

Example:

```typescript
try {
  const response = await slackSDK.sendMessage({
    channel: 'C1234567890', // Channel ID
    text: 'Hello world',
  });
  console.log('Message sent:', response);
} catch (error) {
  console.error('Failed to send message:', error);
}
```
