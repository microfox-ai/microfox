# MicrofoxSlackClient

The `MicrofoxSlackClient` is a custom client designed to simplify common automation tasks by providing a set of minimal, easy-to-use functions that wrap the official `@slack/web-api`.

## Initialization

To create a new `MicrofoxSlackClient` instance, you need to provide a Slack API token.

```typescript
import { MicrofoxSlackClient } from '@microfox/slack-web';

// You can get this token from your Slack app settings
const token = process.env.SLACK_BOT_TOKEN;

const client = new MicrofoxSlackClient(token);
```

## Advanced Initialization

You can also provide a `WebClientOptions` object to configure the underlying `WebClient` with more advanced settings, such as custom retry logic, TLS configuration, or logging.

```typescript
import { MicrofoxSlackClient } from '@microfox/slack-web';
import { LogLevel } from '@slack/web-api';

const token = process.env.SLACK_BOT_TOKEN;

const client = new MicrofoxSlackClient(token, {
  logLevel: LogLevel.DEBUG
});
```

## Usage

Once you have a `MicrofoxSlackClient` instance, you can use it to call any of its custom methods.

```typescript
(async () => {
  try {
    // Example: List all channels
    const channels = await client.listChannels();
    console.log(channels);
  } catch (error) {
    console.error(error);
  }
})();
``` 