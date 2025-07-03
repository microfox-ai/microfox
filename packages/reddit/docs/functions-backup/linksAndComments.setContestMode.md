## Function: `setContestMode`

Part of the `linksAndComments` section. Sets or unsets contest mode for a given post's comments. When enabled, comment scores are hidden and their order is randomized.

**Parameters:**

- `params`: object
  - An object containing the necessary details.
  - `id`: string - The fullname of the post.
  - `state`: boolean - `true` to enable contest mode, `false` to disable it.

**Return Value:**

- `Promise<void>`: A promise that resolves when contest mode has been successfully set.

**Usage Example:**

```typescript
// Example: Enable contest mode for a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.setContestMode({
  id: postFullname,
  state: true,
});

console.log(`Contest mode for ${postFullname} has been enabled.`);
``` 