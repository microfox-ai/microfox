## Function: `setCustomEmojiSize`

Part of the `emoji` section. Sets the size of a custom emoji.

**Parameters:**

- `params`: object
  - An object containing the new dimensions for the emoji.
  - `width`: number (optional) - The new width of the emoji (1-40px).
  - `height`: number (optional) - The new height of the emoji (1-40px).

**Return Value:**

- `Promise<void>`: A promise that resolves when the emoji size has been successfully set.

**Usage Example:**

```typescript
// Example: Set the size of a custom emoji
const subreddit = 'my-subreddit';

await redditSdk.api.emoji.setCustomEmojiSize({
  subreddit: subreddit,
  width: 32,
  height: 32,
});

console.log(`Custom emoji size has been set in r/${subreddit}.`);
``` 