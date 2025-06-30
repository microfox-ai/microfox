## Function: `deleteThing`

Part of the `linksAndComments` section. Deletes a thing (e.g., a comment or post) created by the user.

**Parameters:**

- `params`: object
  - An object containing the thing's fullname.
  - `id`: string - The fullname of the thing to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the thing has been successfully deleted.

**Usage Example:**

```typescript
// Example: Delete a comment
const commentFullname = 't1_commentid';

await redditSdk.api.linksAndComments.deleteThing({
  id: commentFullname,
});

console.log(`Thing ${commentFullname} has been deleted.`);
``` 