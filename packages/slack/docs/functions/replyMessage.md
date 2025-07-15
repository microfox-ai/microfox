# replyMessage

The `replyMessage` method replies to a message in a thread.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.replyMessage({
      channelId: 'C12345678',
      thread_ts: '1234567890.123456',
      text: 'This is a reply in a thread.',
    });
    console.log('Reply sent: ', result.ts);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `channelId` (string, required): The ID of the channel where the message is.
-   `thread_ts` (string, required): The timestamp of the message to reply to, which establishes the thread.
-   `text` (string, required): The text of the reply.

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