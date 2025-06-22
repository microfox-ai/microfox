## Function: `createKeyValueStore`

Creates a new, empty key-value store with an optional name.

**Purpose:**
This function is used to programmatically create a new key-value store where you can later store records.

**Parameters:**
- `store` (object): An object representing the key-value store to be created. The `id` property is omitted.
  - `name` (string, optional): A name for the new key-value store.
  - ... other fields from the `KeyValueStore` type that can be set on creation.

**Return Value:**
- `Promise<KeyValueStore>`: A promise that resolves to the newly created `KeyValueStore` object.
- `KeyValueStore` (object):
  - `id` (string): Unique identifier of the key-value store.
  - `name` (string, optional): Name of the key-value store.
  - `createdAt` (string): ISO 8601 date string of when the store was created.
  - `modifiedAt` (string): ISO 8601 date string of when the store was last modified.

**Examples:**

```typescript
// Example 1: Create a new named key-value store
const newStore = await apify.createKeyValueStore({ name: 'my-input-store' });
console.log(newStore);

// Example 2: Create a new unnamed key-value store
const unnamedStore = await apify.createKeyValueStore({});
console.log(unnamedStore);
```