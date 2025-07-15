# reactMessage

The `reactMessage` method adds a reaction to a message.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.reactMessage({
      channelId: 'C12345678',
      timestamp: '1234567890.123456',
      reaction: 'thumbsup',
    });
    if (result.ok) {
      console.log('Reaction added!');
    }
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `channelId` (string, required): The ID of the channel where the message is.
-   `timestamp` (string, required): The timestamp of the message to react to.
-   `reaction` (string, required): The name of the emoji to use for the reaction (e.g., "thumbsup").

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| `ok`     | Boolean | `true` if the request was successful. |