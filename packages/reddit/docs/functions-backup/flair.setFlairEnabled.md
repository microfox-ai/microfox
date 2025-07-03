## Function: `setFlairEnabled`

Part of the `flair` section. Enables or disables flair in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the flair enabled status.
  - `subreddit`: string - The name of the subreddit.
  - `flair_enabled`: boolean - `true` to enable flair, `false` to disable.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair setting has been updated.

**Usage Example:**

```typescript
// Example: Enable flair in a subreddit
const subreddit = 'my-subreddit';

await redditSdk.api.flair.setFlairEnabled({
  subreddit: subreddit,
  flair_enabled: true,
});

console.log(`Flair has been enabled in r/${subreddit}.`);
``` 