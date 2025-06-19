## Function: `updateCollectionTitle`

Part of the `collections` section. Updates the title of a collection.

**Parameters:**

- `params`: object
  - An object containing the collection ID and the new title.
  - `collection_id`: string - The UUID of the collection.
  - `title`: string - The new title for the collection (max 300 characters).

**Return Value:**

- `Promise<void>`: A promise that resolves when the title has been successfully updated.

**Usage Example:**

```typescript
// Example: Update a collection's title
const collectionId = 'some-uuid-string';
const newTitle = 'My Super Awesome Collection';

await redditSdk.api.collections.updateCollectionTitle({
  collection_id: collectionId,
  title: newTitle,
});

console.log(`Collection ${collectionId} title updated to "${newTitle}".`);
``` 