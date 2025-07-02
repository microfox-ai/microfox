## Function: `deleteRecord`

Deletes a record from a key-value store by its key.

**Purpose:**
This function permanently removes a specific key-value pair from a store.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store.
- `key` (string): The key of the record to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the record has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete a record by its key
const storeId = '<store_id>';
const keyToDelete = 'temporary-data';
await apify.deleteRecord(storeId, keyToDelete);
console.log(`Record with key '${keyToDelete}' deleted successfully.`);
```