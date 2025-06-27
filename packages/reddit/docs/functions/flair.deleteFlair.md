## Function: `deleteFlair`

Part of the `flair` section. Deletes a user's flair in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the username.
  - `subreddit`: string - The name of the subreddit.
  - `name`: string - The username of the user whose flair is to be deleted.

**Return Value:**

- `Promise<void>`: A promise that resolves when the user's flair has been successfully deleted.

**Usage Example:**

```typescript
// Example: Delete a user's flair
const subreddit = 'my-subreddit';
const username = 'some-user';

await redditSdk.api.flair.deleteFlair({
  subreddit: subreddit,
  name: username,
});

console.log(`Flair for user u/${username} has been deleted in r/${subreddit}.`);
``` 