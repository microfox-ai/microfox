## Function: `upsert`

Direct access to the Upstash Vector upsert method.

**Purpose:**
Inserts or updates vectors in the index with full control over the operation.

**Parameters:**

- `args`: any
  - Upsert arguments as defined by Upstash Vector API.
- `options?`: { namespace?: string } (optional)
  - Optional configuration including namespace.

**Return Value:**

- `Promise<any>`: A promise that resolves to the upsert operation result.

**Examples:**

```typescript
// Example 1: Basic vector upsert
const result = await ragSDK.upsert([
  {
    id: 'doc-1',
    vector: [0.1, 0.2, 0.3, ...],
    metadata: { title: 'Document 1', category: 'tech' },
  },
  {
    id: 'doc-2',
    vector: [0.4, 0.5, 0.6, ...],
    metadata: { title: 'Document 2', category: 'science' },
  },
]);

// Example 2: Upsert with namespace
const result = await ragSDK.upsert([
  {
    id: 'product-1',
    vector: [0.1, 0.2, 0.3, ...],
    metadata: { name: 'Product A', price: 99.99 },
  },
], { namespace: 'products' });

// Example 3: Upsert with custom metadata type
interface ArticleMetadata {
  title: string;
  author: string;
  publishDate: string;
  tags: string[];
}

const result = await ragSDK.upsert<ArticleMetadata>([
  {
    id: 'article-1',
    vector: [0.1, 0.2, 0.3, ...],
    metadata: {
      title: 'Getting Started with RAG',
      author: 'John Doe',
      publishDate: '2024-01-15',
      tags: ['rag', 'ai', 'tutorial'],
    },
  },
]);

// Example 4: Upsert with sparse vectors
const result = await ragSDK.upsert([
  {
    id: 'sparse-doc-1',
    sparseVector: {
      indices: [1, 5, 10, 15],
      values: [0.1, 0.3, 0.2, 0.4],
    },
    metadata: { title: 'Sparse Document', type: 'sparse' },
  },
]);
```
