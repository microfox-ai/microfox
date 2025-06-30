## Function: `addOrUpdateEmoji`

Part of the `emoji` section. Adds or updates a custom emoji in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the emoji details.
  - `name`: string - The name for the emoji (max 24 characters, alphanumeric with dashes/underscores).
  - `s3_key`: string - The S3 key of the uploaded image, obtained from `getEmojiUploadLease`.
  - `mod_flair_only`: boolean (optional) - If true, this emoji may only be used in mod-exclusive user flair.
  - `post_flair_allowed`: boolean (optional) - If true, this emoji may be used in post flair.
  - `user_flair_allowed`: boolean (optional) - If true, this emoji may be used in user flair.

**Return Value:**

- `Promise<void>`: A promise that resolves when the emoji has been successfully added or updated.

**Usage Example:**

```typescript
// Example: Add a new custom emoji
const emojiName = 'cool-emoji';
const s3Key = 'path/to/image/on/s3';

await redditSdk.api.emoji.addOrUpdateEmoji({
  name: emojiName,
  s3_key: s3Key,
  post_flair_allowed: true,
  user_flair_allowed: true,
});

console.log(`Emoji "${emojiName}" has been added or updated.`);
``` 