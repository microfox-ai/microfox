## Function: `query`

Direct access to the Upstash Vector query method.

**Purpose:**
Performs vector similarity search with full control over query parameters.

**Parameters:**

- `args`: any
  - Query arguments as defined by Upstash Vector API.
- `options?`: { namespace?: string } (optional)
  - Optional configuration including namespace.

**Return Value:**

- `Promise<any>`: A promise that resolves to the search results.

**Examples:**

```typescript
// Example 1: Basic vector query
const results = await ragSDK.query({
  vector: [0.1, 0.2, 0.3, ...], // Vector representation of query
  topK: 5,
  includeMetadata: true,
});

// Example 2: Query with namespace
const results = await ragSDK.query({
  vector: [0.1, 0.2, 0.3, ...],
  topK: 3,
  includeMetadata: true,
}, { namespace: 'product-docs' });

// Example 3: Query with filter
const results = await ragSDK.query({
  vector: [0.1, 0.2, 0.3, ...],
  topK: 10,
  filter: 'category = "technology" AND author = "John Doe"',
  includeMetadata: true,
});

// Example 4: Query with custom metadata type
interface ArticleMetadata {
  title: string;
  author: string;
  publishDate: string;
  tags: string[];
}

const results = await ragSDK.query<ArticleMetadata>({
  vector: [0.1, 0.2, 0.3, ...],
  topK: 5,
  filter: 'tags CONTAINS "ai"',
  includeMetadata: true,
});
```
