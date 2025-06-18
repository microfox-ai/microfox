## Function: `lock`

Part of the `linksAndComments` section. Locks a post or comment, preventing new comments from being submitted.

**Parameters:**

- `params`: object
  - An object containing the fullname of the thing to lock.
  - `id`: string - The fullname of the post or comment.

**Return Value:**

- `Promise<void>`: A promise that resolves when the thing has been successfully locked.

**Usage Example:**

```typescript
// Example: Lock a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.lock({
  id: postFullname,
});

console.log(`Post ${postFullname} has been locked.`);
``` 