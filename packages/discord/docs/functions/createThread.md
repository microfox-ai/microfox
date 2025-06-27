## Function: `createThread`

Creates a thread in a channel.

**Purpose:**
Starts a new thread within a channel, branching off from a specific message.

**Parameters:**

- `channelId`: string - The ID of the channel to create the thread in.
- `messageId`: string - The ID of the message to create the thread from.
- `name`: string - The name of the new thread.

**Return Value:**
A `Promise` that resolves to the created thread object.

**Examples:**

```typescript
const thread = await discordSdk.createThread(
  '1234567890',
  '9876543210',
  'Discussion Thread',
);
```
