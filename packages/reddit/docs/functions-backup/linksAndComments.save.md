## Function: `save`

Part of the `linksAndComments` section. Saves a post or comment to the user's account.

**Parameters:**

- `params`: object
  - An object containing the details for saving the thing.
  - `id`: string - The fullname of the post or comment to save.
  - `category`: string (optional) - The category to save the thing under.

**Return Value:**

- `Promise<void>`: A promise that resolves when the thing has been successfully saved.

**Usage Example:**

```typescript
// Example: Save a post to the 'later' category
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.save({
  id: postFullname,
  category: 'later',
});

console.log(`Post ${postFullname} has been saved.`);
``` 