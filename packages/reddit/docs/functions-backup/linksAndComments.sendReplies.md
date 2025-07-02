## Function: `sendReplies`

Part of the `linksAndComments` section. Enables or disables inbox replies for a post or comment.

**Parameters:**

- `params`: object
  - An object containing the necessary details.
  - `id`: string - The fullname of the post or comment.
  - `state`: boolean - `true` to enable replies, `false` to disable them.

**Return Value:**

- `Promise<void>`: A promise that resolves when the reply setting has been updated.

**Usage Example:**

```typescript
// Example: Disable inbox replies for a post
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.sendReplies({
  id: postFullname,
  state: false,
});

console.log(`Inbox replies for ${postFullname} have been disabled.`);
``` 