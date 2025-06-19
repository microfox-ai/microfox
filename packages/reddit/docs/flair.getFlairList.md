## Function: `getFlairList`

Part of the `flair` section. Retrieves a list of user flairs in the subreddit. Supports pagination.

**Parameters:**

- `params`: object (optional)
  - An object containing pagination and filter parameters.
  - `subreddit`: string - The name of the subreddit.
  - `after`: string (optional) - The fullname of an item to list after.
  - `before`: string (optional) - The fullname of an item to list before.
  - `count`: number (optional) - The number of items already seen in the listing.
  - `limit`: number (optional) - The maximum number of items to return (1-1000, default: 25).
  - `name`: string (optional) - A specific user's name to show flair for.
  - `show`: 'all' (optional) - Only 'all' is supported.
  - `sr_detail`: boolean (optional) - Expand subreddits.

**Return Value:**

- `Promise<any>`: A promise that resolves to the flair list. The response is a listing of flair information, but the exact structure is not strictly defined and may vary. It typically includes `users`, `next`, and `prev` properties.

**Usage Example:**

```typescript
// Example: Get the first 10 user flairs in a subreddit
const subreddit = 'my-subreddit';

const flairList = await redditSdk.api.flair.getFlairList({
  subreddit: subreddit,
  limit: 10,
});

console.log('Flair list:', flairList.users);
console.log('Next page token:', flairList.next);
``` 