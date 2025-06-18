## Function: `unsave`

Part of the `linksAndComments` section. Unsaves a previously saved post or comment.

**Parameters:**

- `params`: object
  - An object containing the fullname of the thing to unsave.
  - `id`: string - The fullname of the post or comment.

**Return Value:**

- `Promise<void>`: A promise that resolves when the thing has been successfully unsaved.

**Usage Example:**

```typescript
// Example: Unsave a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.unsave({
  id: postFullname,
});

console.log(`Post ${postFullname} has been unsaved.`);
``` 