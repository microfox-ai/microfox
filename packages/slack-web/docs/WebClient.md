# WebClient

The `WebClient` is the main entry point for interacting with the Slack Web API. You need to instantiate it before you can call any of the API methods.

## Initialization

To create a new `WebClient` instance, you need to provide a Slack API token.

```typescript
import { WebClient } from '@microfox/slack-web';

// You can get this token from your Slack app settings
const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token);
```

## Advanced Initialization

You can also provide a `WebClientOptions` object to configure the client with more advanced settings, such as custom retry logic, TLS configuration, or logging.

```typescript
import { WebClient, LogLevel } from '@microfox/slack-web';

const token = process.env.SLACK_BOT_TOKEN;

const web = new WebClient(token, {
  logLevel: LogLevel.DEBUG
});
```

## Usage

Once you have a `WebClient` instance, you can use it to call any of the available API methods.

```typescript
(async () => {
  try {
    // Call the chat.postMessage method
    const result = await web.chat.postMessage({
      channel: '#general',
      text: 'Hello, world!'
    });

    console.log(`Successfully sent message ${result.ts}`);
  } catch (error) {
    console.error(error);
  }
})();
``` 