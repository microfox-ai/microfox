## Function: `listNamespaces`

Lists all available namespaces in the vector index.

**Purpose:**
Retrieves a list of all namespaces that have been created in the index.

**Parameters:**

- None

**Return Value:**

- `Promise<any>`: A promise that resolves to a list of namespaces.

**Examples:**

```typescript
// Example 1: List all namespaces
const namespaces = await ragSDK.listNamespaces();
console.log('Available namespaces:', namespaces);
// Output: ['articles', 'products', 'documentation', 'user-data']

// Example 2: Check if namespace exists
const namespaces = await ragSDK.listNamespaces();
const hasProductDocs = namespaces.includes('product-docs');
if (!hasProductDocs) {
  console.log('Product documentation namespace not found');
}

// Example 3: Count namespaces
const namespaces = await ragSDK.listNamespaces();
console.log(`Total namespaces: ${namespaces.length}`);

// Example 4: Filter namespaces by pattern
const namespaces = await ragSDK.listNamespaces();
const userNamespaces = namespaces.filter((ns) => ns.startsWith('user-'));
console.log('User namespaces:', userNamespaces);

// Example 5: Validate namespace before operations
const namespaces = await ragSDK.listNamespaces();
const targetNamespace = 'articles';
if (!namespaces.includes(targetNamespace)) {
  console.log(`Namespace '${targetNamespace}' does not exist`);
} else {
  // Perform operations on the namespace
  const results = await ragSDK.queryDocsFromRAG(
    {
      data: 'Search query',
      topK: 5,
    },
    targetNamespace
  );
}
```
