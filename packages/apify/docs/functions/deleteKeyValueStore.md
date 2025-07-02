## Function: `deleteKeyValueStore`

Deletes a specific key-value store and all of its records.

**Purpose:**
This function permanently removes a key-value store and all the data stored within it. This action is irreversible.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the key-value store has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete a key-value store by its ID
const storeId = '<store_id_to_delete>';
await apify.deleteKeyValueStore(storeId);
console.log('Key-value store deleted successfully.');
```