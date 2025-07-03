## Function: `markNsfw`

Part of the `linksAndComments` section. Marks a post as Not-Safe-For-Work (NSFW).

**Parameters:**

- `params`: object
  - An object containing the fullname of the post to mark.
  - `id`: string - The fullname of the post.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully marked as NSFW.

**Usage Example:**

```typescript
// Example: Mark a post as NSFW
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.markNsfw({
  id: postFullname,
});

console.log(`Post ${postFullname} has been marked as NSFW.`);
``` 