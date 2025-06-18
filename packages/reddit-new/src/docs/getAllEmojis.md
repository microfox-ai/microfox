## Function: `getAllEmojis`

Part of the `emoji` section. Retrieves all custom emojis for a subreddit.

The response is a nested object where the top-level keys are usernames of the emoji creators, and the values are objects containing the emojis created by that user.

**Parameters:**

- `params`: object
  - `subreddit`: string - The subreddit name.

**Return Value:**

- `Promise<AllEmojisResponse>`: A promise that resolves to an object containing all custom emojis for the subreddit.

**AllEmojisResponse Type:**

```typescript
export interface AllEmojisResponse {
  [creatorUsername: string]: {
    [emojiName: string]: Emoji;
  };
}
```

**Emoji Type:**

```typescript
export interface Emoji {
  url: string; // The URL of the emoji image.
  created_by: string; // The username of the creator.
  mod_flair_only: boolean; // Whether the emoji is for mod flair only.
  name: string; // The name of the emoji.
  post_flair_allowed: boolean; // Whether the emoji can be used in post flair.
  user_flair_allowed: boolean; // Whether the emoji can be used in user flair.
  [key: string]: any;
}
```

**Usage Example:**

```typescript
// Example: Get all custom emojis for a subreddit
const subreddit = 'my-subreddit';
const allEmojis = await redditSdk.api.emoji.getAllEmojis({
  subreddit: subreddit,
});

for (const creator in allEmojis) {
  console.log(`Emojis by ${creator}:`);
  for (const emojiName in allEmojis[creator]) {
    console.log(`- ${emojiName}: ${allEmojis[creator][emojiName].url}`);
  }
}
``` 