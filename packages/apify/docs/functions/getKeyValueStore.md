## Function: `getKeyValueStore`

Retrieves the details of a specific key-value store by its ID.

**Purpose:**
This function allows you to fetch the metadata of a single key-value store, such as its name and creation date.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store to retrieve.

**Return Value:**
- `Promise<KeyValueStore>`: A promise that resolves to the `KeyValueStore` object.
- `KeyValueStore` (object):
  - `id` (string): Unique identifier of the key-value store.
  - `name` (string, optional): Name of the key-value store.
  - `createdAt` (string): ISO 8601 date string of when the store was created.
  - `modifiedAt` (string): ISO 8601 date string of when the store was last modified.

**Examples:**

```typescript
// Example 1: Get a specific key-value store by its ID
const storeId = '<store_id>';
const store = await apify.getKeyValueStore(storeId);
console.log(store);
```