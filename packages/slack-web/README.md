# @microfox/slack-web

This package provides a lightweight, proxy interface to the official Slack Web API, offering a curated set of the most commonly used functions for building Slack integrations. It is designed to be simple, efficient, and easy to integrate into your projects.

## Installation

```bash
npm install @microfox/slack-web
```

## Usage

To use this package, import the `WebClient` and initialize it with your Slack API token.

```typescript
import { WebClient } from '@microfox/slack-web';

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);

// Example: Post a message to a channel
(async () => {
  const conversationId = 'C12345678';
  const res = await web.chat.postMessage({ channel: conversationId, text: 'Hello there' });
  console.log('Message sent: ', res.ts);
})();
```

For more details on the available functions and their usage, please refer to the documentation in the `docs` directory and the official [Slack API documentation](https://api.slack.com/). 