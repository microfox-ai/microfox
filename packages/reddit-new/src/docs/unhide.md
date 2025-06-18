## Function: `unhide`

Part of the `linksAndComments` section. Unhides a previously hidden post.

**Parameters:**

- `params`: object
  - An object containing the fullname of the post to unhide.
  - `id`: string - The fullname of the post.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully unhidden.

**Usage Example:**

```typescript
// Example: Unhide a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.unhide({
  id: postFullname,
});

console.log(`Post ${postFullname} has been unhidden.`);
``` 