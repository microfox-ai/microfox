## Function: `setRecord`

Creates a new record or updates an existing record in a key-value store.

**Purpose:**
This function is used to save or modify data in a key-value store. If a record with the specified key already exists, its value will be overwritten. Otherwise, a new record will be created.

**Parameters:**
- `storeId` (string): The unique identifier of the key-value store.
- `key` (string): The key of the record to set.
- `value` (unknown): The value to be stored. It can be any JSON-serializable data (object, array, string, number, etc.).

**Return Value:**
- `Promise<void>`: A promise that resolves when the record has been successfully set.

**Examples:**

```typescript
// Example 1: Set a simple string value
const storeId = '<store_id>';
await apify.setRecord(storeId, 'message', 'Hello, World!');

// Example 2: Set a complex object value
const config = {
  url: 'https://example.com',
  retries: 3,
  headless: true
};
await apify.setRecord(storeId, 'INPUT', config);
```