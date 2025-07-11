## Function: `delete`

Deletes items from the vector index.

**Purpose:**
Removes specific vectors or entire namespaces from the index.

**Parameters:**

- `args`: any
  - Delete arguments as defined by Upstash Vector API.
- `options?`: { namespace?: string } (optional)
  - Optional configuration including namespace.

**Return Value:**

- `Promise<any>`: A promise that resolves to the delete operation result.

**Examples:**

```typescript
// Example 1: Delete specific vectors by ID
const result = await ragSDK.delete({
  ids: ['doc-1', 'doc-2', 'doc-3'],
});

// Example 2: Delete vectors in a namespace
const result = await ragSDK.delete(
  {
    ids: ['product-1', 'product-2'],
  },
  { namespace: 'products' }
);

// Example 3: Delete all vectors in a namespace
const result = await ragSDK.deleteNamespace('old-documents');

// Example 4: Delete with filter
const result = await ragSDK.delete({
  filter: 'category = "deprecated"',
});

// Example 5: Delete vectors by metadata filter in namespace
const result = await ragSDK.delete(
  {
    filter: 'author = "John Doe"',
  },
  { namespace: 'articles' }
);
```
