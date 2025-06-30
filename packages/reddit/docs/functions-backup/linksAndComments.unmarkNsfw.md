## Function: `unmarkNsfw`

Part of the `linksAndComments` section. Unmarks a post as Not-Safe-For-Work (NSFW).

**Parameters:**

- `params`: object
  - An object containing the fullname of the post to unmark.
  - `id`: string - The fullname of the post.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully unmarked as NSFW.

**Usage Example:**

```typescript
// Example: Unmark a post as NSFW
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.unmarkNsfw({
  id: postFullname,
});

console.log(`Post ${postFullname} has been unmarked as NSFW.`);
``` 