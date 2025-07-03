## Function: `deleteMessage`

Deletes a message in a channel.

**Purpose:**
Removes a specific message from a channel.

**Parameters:**

- `channelId`: string - The ID of the channel containing the message.
- `messageId`: string - The ID of the message to delete.

**Return Value:**
A `Promise` that resolves when the message is deleted.

**Examples:**

```typescript
await discordSdk.deleteMessage('1234567890', '9876543210');
```
