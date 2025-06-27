## Function: `updateCollectionDescription`

Part of the `collections` section. Updates the description of a collection.

**Parameters:**

- `params`: object
  - An object containing the collection ID and the new description.
  - `collection_id`: string - The UUID of the collection.
  - `description`: string - The new description for the collection (max 500 characters).

**Return Value:**

- `Promise<void>`: A promise that resolves when the description has been successfully updated.

**Usage Example:**

```typescript
// Example: Update a collection's description
const collectionId = 'some-uuid-string';
const newDescription = 'An updated description for my collection.';

await redditSdk.api.collections.updateCollectionDescription({
  collection_id: collectionId,
  description: newDescription,
});

console.log(`Collection ${collectionId} description updated.`);
``` 