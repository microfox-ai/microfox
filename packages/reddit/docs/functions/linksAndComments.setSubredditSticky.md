## Function: `setSubredditSticky`

Part of the `linksAndComments` section. Stickies or unstickies a post in a subreddit. Requires moderator privileges.

**Parameters:**

- `params`: object
  - An object containing the necessary details.
  - `id`: string - The fullname of the post to sticky.
  - `state`: boolean - `true` to sticky the post, `false` to unsticky it.
  - `slot`: number (optional) - The sticky slot to use (1 or 2).

**Return Value:**

- `Promise<void>`: A promise that resolves when the post's sticky state has been updated.

**Usage Example:**

```typescript
// Example: Sticky a post to the top slot
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.setSubredditSticky({
  id: postFullname,
  state: true,
  slot: 1,
});

console.log(`Post ${postFullname} has been stickied.`);
``` 