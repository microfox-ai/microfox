## Function: `sendMessage`

Sends a message to a specified channel or user.

**Purpose:**
This function allows you to send messages to either a specific channel using `channelId` or directly to a user using `userId`. You can send text messages, embed images/links using `fileUrl` or rich embeds using the `embed` object.

**Parameters:**

- `data`: object<MessageSchema>
  - `content`: string (optional) - The text content of the message.
  - `userId`: string (optional) - The ID of the user to send a direct message to. If provided, `channelId` is ignored and a new DM channel is created.
  - `channelId`: string (optional) - The ID of the channel to send the message to. Required if `userId` is not provided.
  - `fileUrl`: string (optional) - A URL to an image or file to embed in the message. If provided, it will be displayed as an embed.
  - `embed`: object (optional) - A rich embed object to include in the message.
    - `title`: string (optional) - The title of the embed.
    - `description`: string (optional) - The description of the embed.
    - `color`: number (optional) - The color of the embed (decimal).
    - `image`: string (optional) - A URL to an image to display in the embed.

**Return Value:**
A `Promise` that resolves to the sent message object.

**Examples:**

```typescript
// Example 1: Send a simple text message to a channel
await discordSdk.sendMessage({
  channelId: '1234567890',
  content: 'Hello, world!',
});

// Example 2: Send a direct message to a user
await discordSdk.sendMessage({
  userId: '9876543210',
  content: 'This is a DM!',
});

// Example 3: Send a message with an embedded image
await discordSdk.sendMessage({
  channelId: '1234567890',
  fileUrl: 'https://example.com/image.png',
});

// Example 4: Send a message with a rich embed
await discordSdk.sendMessage({
  channelId: '1234567890',
  embed: {
    title: 'Embed Title',
    description: 'This is a rich embed.',
    color: 16711680,
    image: 'https://example.com/image.png',
  },
});
```
