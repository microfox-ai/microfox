# replyMessage

Replies to a message in a Slack thread.

## Arguments

| Name | Type | Description |
| --- | --- | --- |
| `channelId` | `string` | The ID of the channel where the message is. |
| `thread_ts` | `string` | The timestamp of the message to reply to. |
| `text` | `string` | The text of the reply. |
| `username` | `string` (optional) | The username for the message. Defaults to the one set in environment variables if not provided. |
| `icon_url` | `string` (optional) | The icon URL for the message. Defaults to the one set in environment variables if not provided. |

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function sendReply() {
  try {
    const response = await client.replyMessage({
      channelId: 'C1234567890', // Replace with your channel ID
      thread_ts: '1628784000.000100', // Replace with the parent message's timestamp
      text: 'This is a reply to the thread.',
      username: 'ReplyBot',
      icon_url: 'http://example.com/icon.png',
    });
    console.log('Reply sent:', response);
  } catch (error) {
    console.error('Error sending reply:', error);
  }
}

sendReply();
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
``` 