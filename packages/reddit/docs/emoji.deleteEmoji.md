## Function: `deleteEmoji`

Part of the `emoji` section. Deletes a custom emoji from a subreddit.

**Parameters:**

- `params`: object
  - An object containing the emoji name.
  - `emoji_name`: string - The name of the emoji to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the emoji has been successfully deleted.

**Usage Example:**

```typescript
// Example: Delete a custom emoji
const emojiName = 'emoji-to-delete';
const subreddit = 'my-subreddit'; // The subreddit is part of the URL path

await redditSdk.api.emoji.deleteEmoji({
  subreddit: subreddit,
  emoji_name: emojiName,
});

console.log(`Emoji "${emojiName}" has been deleted from r/${subreddit}.`);
``` 