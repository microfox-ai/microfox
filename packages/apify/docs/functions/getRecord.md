## Function: `getRecord`

Retrieves a single record (key-value pair) from a key-value store.

**Purpose:**
This function is used to fetch the value associated with a specific key in a given key-value store.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store.
- `key` (string): The key of the record to retrieve.

**Return Value:**
- `Promise<Record>`: A promise that resolves to the `Record` object.
- `Record` (object):
  - `key` (string): Key of the record.
  - `value` (unknown): The value of the record. The type is `unknown` as it can be any JSON-serializable data.
  - `contentType` (string, optional): The content type of the record's value.

**Examples:**

```typescript
// Example 1: Get a record by its key
const storeId = '<store_id>';
const key = 'INPUT';
const record = await apify.getRecord(storeId, key);
console.log(record.value);
```