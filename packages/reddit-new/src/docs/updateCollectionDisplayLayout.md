## Function: `updateCollectionDisplayLayout`

Part of the `collections` section. Updates the display layout of a collection.

**Parameters:**

- `params`: object
  - An object containing the collection ID and the new display layout.
  - `collection_id`: string - The UUID of the collection.
  - `display_layout`: 'TIMELINE' | 'GALLERY' - The new display layout.

**Return Value:**

- `Promise<void>`: A promise that resolves when the display layout has been successfully updated.

**Usage Example:**

```typescript
// Example: Update a collection's display layout
const collectionId = 'some-uuid-string';
const newLayout = 'TIMELINE';

await redditSdk.api.collections.updateCollectionDisplayLayout({
  collection_id: collectionId,
  display_layout: newLayout,
});

console.log(`Collection ${collectionId} display layout updated to ${newLayout}.`);
``` 