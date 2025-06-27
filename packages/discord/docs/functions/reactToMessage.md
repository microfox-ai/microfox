## Function: `reactToMessage`

Reacts to a message with an emoji.

**Purpose:**
Adds a reaction to a specific message.

**Parameters:**

- `channelId`: string - The ID of the channel containing the message.
- `messageId`: string - The ID of the message to react to.
- `emoji`: string - The emoji to react with (can be a Unicode emoji or a custom emoji ID).

**Return Value:**
A `Promise` that resolves when the reaction is added.

**Examples:**

```typescript
// Example 1: React with a Unicode emoji
await discordSdk.reactToMessage('1234567890', '9876543210', '👍');

// Example 2: React with a custom emoji ID
await discordSdk.reactToMessage(
  '1234567890',
  '9876543210',
  '<:custom_emoji:1234567890>',
);
```
