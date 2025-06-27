## Function: `fetchMessages`

Fetches recent messages from a channel.

**Purpose:**
Retrieves a specified number of messages from a channel's history.

**Parameters:**

- `channelId`: string - The ID of the channel to fetch messages from.
- `limit`: number (optional) - The maximum number of messages to fetch (default is 10).

**Return Value:**
A `Promise` that resolves to an array of message objects.

**Examples:**

```typescript
// Example 1: Fetch the last 10 messages
const messages = await discordSdk.fetchMessages('1234567890');

// Example 2: Fetch the last 25 messages
const messages = await discordSdk.fetchMessages('1234567890', 25);
```
