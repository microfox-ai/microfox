## Function: `addPostToCollection`

Part of the `collections` section. Adds a post to a collection.

**Parameters:**

- `params`: object
  - An object containing the collection and post identifiers.
  - `collection_id`: string - The UUID of the collection.
  - `link_fullname`: string - The fullname of the post to add.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully added to the collection.

**Usage Example:**

```typescript
// Example: Add a post to a collection
const collectionId = 'some-uuid-string';
const postFullname = 't3_postid';

await redditSdk.api.collections.addPostToCollection({
  collection_id: collectionId,
  link_fullname: postFullname,
});

console.log(`Post ${postFullname} added to collection ${collectionId}.`);
``` 