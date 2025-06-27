## Function: `removePostFromCollection`

Part of the `collections` section. Removes a post from a collection.

**Parameters:**

- `params`: object
  - An object containing the collection and post identifiers.
  - `collection_id`: string - The UUID of the collection.
  - `link_fullname`: string - The fullname of the post to remove.

**Return Value:**

- `Promise<void>`: A promise that resolves when the post has been successfully removed from the collection.

**Usage Example:**

```typescript
// Example: Remove a post from a collection
const collectionId = 'some-uuid-string';
const postFullname = 't3_postid';

await redditSdk.api.collections.removePostFromCollection({
  collection_id: collectionId,
  link_fullname: postFullname,
});

console.log(`Post ${postFullname} removed from collection ${collectionId}.`);
``` 