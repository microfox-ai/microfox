## Function: `editMessage`

Edits an existing message in a channel. Now supports media (via embeds).

**Purpose:**
Updates the content of a previously sent message. Allows for modification of text and embedded media.

**Parameters:**

- `channelId`: string - The ID of the channel containing the message.
- `messageId`: string - The ID of the message to edit.
- `newContent`: string - The new text content for the message.
- `fileUrl`: string (optional) - A new URL to an image or file to embed in the message. If provided, it will replace the existing embed.

**Return Value:**
A `Promise` that resolves to the edited message object.

**Examples:**

```typescript
// Example 1: Edit message content
await discordSdk.editMessage(
  '1234567890',
  '9876543210',
  'Updated message text',
);

// Example 2: Edit message content and embed
await discordSdk.editMessage(
  '1234567890',
  '9876543210',
  'Updated message with image',
  'https://example.com/new_image.png',
);
```
