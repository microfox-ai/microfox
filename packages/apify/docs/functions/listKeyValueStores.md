## Function: `listKeyValueStores`

Retrieves a paginated list of key-value stores available to the user.

**Purpose:**
This function allows you to browse and manage your key-value stores on the Apify platform. Key-value stores are used for storing simple data, such as actor inputs or outputs.

**Parameters:**
- `params` (object, optional): An object containing query parameters for filtering and pagination.
  - `offset` (number, optional): The number of stores to skip. Default: `0`.
  - `limit` (number, optional): The maximum number of stores to return. Default: `1000`.
  - `desc` (boolean, optional): If `true`, sorts stores in descending order. Default: `false`.
  - `unnamed` (boolean, optional): If `true`, only returns unnamed stores.

**Return Value:**
- `Promise<Pagination<KeyValueStore>>`: A promise that resolves to a pagination object containing a list of key-value stores.
- `Pagination<KeyValueStore>` (object):
  - `total` (number): Total number of stores available.
  - `offset` (number): The starting offset of the returned stores.
  - `limit` (number): The maximum number of stores per page.
  - `count` (number): The number of stores returned in the current page.
  - `items` (array<KeyValueStore>): An array of `KeyValueStore` objects.
- `KeyValueStore` (object):
  - `id` (string): Unique identifier of the key-value store.
  - `name` (string, optional): Name of the key-value store.
  - `createdAt` (string): ISO 8601 date string of when the store was created.
  - `modifiedAt` (string): ISO 8601 date string of when the store was last modified.

**Examples:**

```typescript
// Example 1: List the 5 most recently modified key-value stores
const recentStores = await apify.listKeyValueStores({ limit: 5, desc: true });
console.log(recentStores.items);

// Example 2: List all key-value stores
const allStores = await apify.listKeyValueStores();
console.log(allStores);
```