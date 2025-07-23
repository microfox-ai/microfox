# messageChannel

Sends a message to a Slack channel.

## Arguments

| Name | Type | Description |
| --- | --- | --- |
| `channelId` | `string` | The ID of the channel to send the message to. |
| `text` | `string` | The text of the message. |
| `username` | `string` (optional) | The username for the message. Defaults to the one set in environment variables if not provided. |
| `icon_url` | `string` (optional) | The icon URL for the message. Defaults to the one set in environment variables if not provided. |

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function sendMessage() {
  try {
    const response = await client.messageChannel({
      channelId: 'C1234567890', // Replace with your channel ID
      text: 'Hello, world!',
      username: 'CustomBot',
      icon_url: 'http://example.com/icon.png',
    });
    console.log('Message sent:', response);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

sendMessage();
```

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property  | Type    | Description                                           |
| --------- | ------- | ----------------------------------------------------- |
| `ok`      | Boolean | `true` if the request was successful.                 |
| `channel` | String  | The ID of the channel where the message was posted.   |
| `ts`      | String  | The timestamp of the message.                         |
| `message` | Object  | An object containing the details of the sent message. | 