# messageChannel

The `messageChannel` method sends a message to a channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.messageChannel({
      channelId: 'C12345678',
      text: 'Hello world!',
    });
    console.log('Message sent: ', result.ts);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `channelId` (string, required): The ID of the channel to send the message to.
-   `text` (string, required): The text of the message.

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property  | Type   | Description                                                                                              |
| --------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `ok`      | Boolean| `true` if the request was successful.                                                                    |
| `channel` | String | The ID of the channel where the message was posted.                                                      |
| `ts`      | String | The timestamp of the message.                                                                            |
| `message` | Object | An object containing the details of the sent message.                                                     | 