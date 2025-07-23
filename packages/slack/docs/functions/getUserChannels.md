# getUserChannels

Fetches a list of conversations a user is a member of.

## Arguments

| Name | Type | Description |
| --- | --- | --- |
| `userId` | `string` | The ID of the user to fetch conversations for. |
| `cursor` | `string` (optional) | A cursor for pagination. |
| `limit` | `number` (optional) | The maximum number of conversations to return. |
| `types` | `string[]` (optional) | An array of conversation types to include (e.g., `['public_channel', 'private_channel']`). Defaults to all types. |
| `excludeArchived` | `boolean` (optional) | Whether to exclude archived conversations. Defaults to `false`. |

## Example

```typescript
import { MicrofoxSlackClient } from '@microfox/slack';

const client = new MicrofoxSlackClient('YOUR_SLACK_BOT_TOKEN');

async function fetchUserChannels() {
  try {
    const response = await client.getUserChannels({
      userId: 'U1234567890', // Replace with the user's ID
    });
    console.log('User channels:', response.channels);
  } catch (error) {
    console.error('Error fetching user channels:', error);
  }
}

fetchUserChannels();
```

## Response

Returns a `Promise` that resolves with an object containing an array of conversation objects and a `nextCursor` for pagination. 