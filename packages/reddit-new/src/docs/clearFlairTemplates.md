## Function: `clearFlairTemplates`

Part of the `flair` section. Clears all flair templates of a specific type in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the flair type.
  - `subreddit`: string - The name of the subreddit.
  - `flair_type`: 'USER_FLAIR' | 'LINK_FLAIR' - The type of flair templates to clear.

**Return Value:**

- `Promise<void>`: A promise that resolves when the flair templates have been successfully cleared.

**Usage Example:**

```typescript
// Example: Clear all user flair templates in a subreddit
const subreddit = 'my-subreddit';

await redditSdk.api.flair.clearFlairTemplates({
  subreddit: subreddit,
  flair_type: 'USER_FLAIR',
});

console.log(`All user flair templates have been cleared in r/${subreddit}.`);
``` 