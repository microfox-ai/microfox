# removeUserFromChannel

The `removeUserFromChannel` method removes a user from a channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack-web';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    await client.removeUserFromChannel('C12345678', 'U87654321');
    console.log('User removed from channel.');
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `channelId` (string): The ID of the channel to remove the user from.
-   `userId` (string): The ID of the user to remove.

## Response

This method returns an object with a single `ok` property.

### Response Schema

| Property | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| `ok`     | Boolean | `true` if the request was successful. |

</rewritten_file> 