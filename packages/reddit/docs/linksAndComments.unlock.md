## Function: `unlock`

Part of the `linksAndComments` section. Unlocks a previously locked post, allowing new comments to be submitted.

**Parameters:**

- `params`: object
  - An object containing the fullname of the post to unlock.
  - `id`: string - The fullname of the post.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully unlocked.

**Usage Example:**

```typescript
// Example: Unlock a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.unlock({
  id: postFullname,
});

console.log(`Post ${postFullname} has been unlocked.`);
``` 