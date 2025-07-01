## Function: `deleteCollection`

Part of the `collections` section. Deletes a collection.

**Parameters:**

- `params`: object
  - An object containing the collection ID.
  - `collection_id`: string - The UUID of the collection to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the collection has been successfully deleted.

**Usage Example:**

```typescript
// Example: Delete a collection
const collectionId = 'some-uuid-string';
await redditSdk.api.collections.deleteCollection({
  collection_id: collectionId,
});
console.log(`Collection ${collectionId} has been deleted.`);
``` 