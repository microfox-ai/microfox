## Function: `setSuggestedSort`

Part of the `linksAndComments` section. Sets the suggested sort for the comments on a post.

**Parameters:**

- `params`: object
  - An object containing the necessary details.
  - `id`: string - The fullname of the post.
  - `sort`: string - The suggested sort method. Can be one of: `confidence`, `top`, `new`, `controversial`, `old`, `random`, `qa`, `live`, or an empty string to clear the suggestion.

**Return Value:**

- `Promise<void>`: A promise that resolves when the suggested sort has been set.

**Usage Example:**

```typescript
// Example: Set the suggested sort to 'new'
const postFullname = 't3_postid';

await redditSdk.api.linksAndComments.setSuggestedSort({
  id: postFullname,
  sort: 'new',
});

console.log(`Suggested sort for ${postFullname} has been set to 'new'.`);
``` 