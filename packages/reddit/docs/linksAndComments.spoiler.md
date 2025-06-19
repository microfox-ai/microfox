## Function: `spoiler`

Part of the `linksAndComments` section. Marks a post as a spoiler.

**Parameters:**

- `params`: object
  - An object containing the fullname of the post to mark.
  - `id`: string - The fullname of the post.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully marked as a spoiler.

**Usage Example:**

```typescript
// Example: Mark a post as a spoiler
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.spoiler({
  id: postFullname,
});

console.log(`Post ${postFullname} has been marked as a spoiler.`);
``` 