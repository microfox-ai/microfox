## Function: `listKeyValueStoreRecords`

Retrieves a list of keys from a specific key-value store. This is useful for iterating over the records in a store without fetching their values.

**Purpose:**
This function allows you to get a list of all keys in a key-value store, with pagination options. This is more efficient than fetching all records if you only need the keys.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store.
- `params` (object, optional): An object containing query parameters for pagination.
  - `exclusiveStartKey` (string, optional): The key to start the listing from (exclusive). Used for pagination.
  - `limit` (number, optional): The maximum number of keys to return.

**Return Value:**
- `Promise<Record[]>`: A promise that resolves to an array of `Record` objects, which may not contain the `value` field.
- `Record` (object):
  - `key` (string): Key of the record.
  - `value` (unknown): Value of the record.
  - `contentType` (string, optional): Content type of the record.

**Examples:**

```typescript
// Example 1: List all keys in a store
const storeId = '<store_id>';
const keys = await apify.listKeyValueStoreRecords(storeId);
console.log(keys.map(record => record.key));

// Example 2: Paginate through keys
const firstPage = await apify.listKeyValueStoreRecords(storeId, { limit: 10 });
if (firstPage.length > 0) {
  const lastKey = firstPage[firstPage.length - 1].key;
  const secondPage = await apify.listKeyValueStoreRecords(storeId, { limit: 10, exclusiveStartKey: lastKey });
  console.log(secondPage);
}
```