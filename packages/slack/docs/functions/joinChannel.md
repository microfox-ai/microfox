# joinChannel

The `joinChannel` function allows the bot to join a channel.

## Parameters

| Name      | Type   | Description                       |
| :-------- | :----- | :-------------------------------- |
| channelId | string | The ID of the channel to join.    |

## Returns

A promise that resolves with the response from the Slack API.

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function joinMarketingChannel() {
  try {
    const channelId = 'C1234567890'; // Replace with the actual channel ID for #marketing
    await client.joinChannel({ channelId });
    console.log('Successfully joined channel.');
  } catch (error) {
    console.error(error);
  }
}

joinMarketingChannel();
``` 