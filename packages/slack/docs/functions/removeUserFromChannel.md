# removeUserFromChannel

The `removeUserFromChannel` method removes a user from a channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const result = await client.removeUserFromChannel({
      channelId: 'C12345678',
      userId: 'U12345678',
    });
    if (result.ok) {
      console.log('User removed from channel.');
    }
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

This method accepts an object with the following properties:

-   `channelId` (string, required): The ID of the channel to remove the user from.
-   `userId` (string, required): The ID of the user to remove.

## Response

This method returns an object containing the result of the API call.

### Response Schema

| Property | Type    | Description                           |
| -------- | ------- | ------------------------------------- |
| `ok`     | Boolean | `true` if the request was successful. | 