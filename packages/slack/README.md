# @microfox/slack

This package provides a lightweight, proxy interface to the official Slack Web API, offering a curated set of the most commonly used functions for building Slack integrations. It is designed to be simple, efficient, and easy to integrate into your projects.

## Installation

```bash
npm install @microfox/slack
```

## Usage

To use this package, import the `MicrofoxSlackClient` and initialize it with your Slack API token.

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const token = process.env.SLACK_ACCESS_TOKEN;
const slackClient = new MicrofoxSlackClient(token);

// Example: Send a message to a channel
(async () => {
  const channelId = 'C12345678';
  const res = await slackClient.messageChannel({ channelId: channelId, text: 'Hello there' });
  console.log('Message sent: ', res.ts);
})();
```
