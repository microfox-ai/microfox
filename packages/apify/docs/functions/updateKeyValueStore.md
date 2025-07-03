## Function: `updateKeyValueStore`

Updates an existing key-value store. Currently, only the name of the store can be modified.

**Purpose:**
This function is used to rename a key-value store.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store to update.
- `store` (object): An object containing the fields to update.
  - `name` (string, optional): The new name for the key-value store.

**Return Value:**
- `Promise<KeyValueStore>`: A promise that resolves to the updated `KeyValueStore` object.
- `KeyValueStore` (object):
  - `id` (string): Unique identifier of the key-value store.
  - `name` (string, optional): The updated name of the key-value store.
  - `createdAt` (string): ISO 8601 date string of when the store was created.
  - `modifiedAt` (string): ISO 8601 date string of when the store was last modified.

**Examples:**

```typescript
// Example 1: Rename a key-value store
const storeId = '<store_id>';
const updatedStore = await apify.updateKeyValueStore(storeId, { name: 'new-store-name' });
console.log(updatedStore);
```