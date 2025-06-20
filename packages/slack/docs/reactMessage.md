# reactMessage

The `reactMessage` method adds a reaction to a message.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    await client.reactMessage('C12345678', '1234567890.123456', 'tada');
    console.log('Reaction added!');
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `channelId` (string): The ID of the channel where the message is.
-   `timestamp` (string): The timestamp of the message to react to.
-   `reaction` (string): The name of the emoji to use for the reaction (e.g., 'tada', 'thumbsup').

## Response

This method returns an object with a single `ok` property.

### Response Schema

| Property | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| `ok`     | Boolean | `true` if the request was successful. |

</rewritten_file> 