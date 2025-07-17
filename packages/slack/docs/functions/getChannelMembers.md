# getChannelMembers

The `getChannelMembers` method lists all users in a specific channel.

## Usage

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient(process.env.SLACK_BOT_TOKEN);

(async () => {
  try {
    const users = await client.getChannelMembers('C12345678');
    console.log(users);
  } catch (error) {
    console.error(error);
  }
})();
```

## Arguments

-   `channelId` (string): The ID of the channel to get the members of.

## Response

This method returns an array of user IDs. 