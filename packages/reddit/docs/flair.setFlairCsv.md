## Function: `setFlairCsv`

Part of the `flair` section. Bulk assigns user flair from a CSV string.

**Parameters:**

- `params`: object
  - An object containing the flair CSV data.
  - `subreddit`: string - The name of the subreddit.
  - `flair_csv`: string - Up to 100 lines of `user,flairtext,cssclass`.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair CSV has been processed.

**Usage Example:**

```typescript
// Example: Bulk assign user flair
const subreddit = 'my-subreddit';
const flairData = `user1,Flair Text 1,css-class-1\nuser2,Flair Text 2,css-class-2`;

await redditSdk.api.flair.setFlairCsv({
  subreddit: subreddit,
  flair_csv: flairData,
});

console.log(`Flair CSV has been processed for r/${subreddit}.`);
``` 