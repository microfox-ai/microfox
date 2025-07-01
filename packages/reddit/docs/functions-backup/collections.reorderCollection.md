## Function: `reorderCollection`

Part of the `collections` section. Reorders the posts within a collection.

**Parameters:**

- `params`: object
  - An object containing the collection ID and the new order of posts.
  - `collection_id`: string - The UUID of the collection.
  - `link_ids`: string - A comma-separated list of post fullnames in the desired order.

**Return Value:**

- `Promise<void>`: A promise that resolves when the collection has been successfully reordered.

**Usage Example:**

```typescript
// Example: Reorder posts in a collection
const collectionId = 'some-uuid-string';
const orderedPostIds = 't3_postid3,t3_postid1,t3_postid2';

await redditSdk.api.collections.reorderCollection({
  collection_id: collectionId,
  link_ids: orderedPostIds,
});

console.log(`Collection ${collectionId} has been reordered.`);
``` 