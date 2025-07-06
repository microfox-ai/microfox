## Function: `queryDocsFromRAG`

Queries the RAG system to retrieve relevant documents based on semantic similarity.

**Purpose:**
Performs semantic search to find the most relevant documents for a given query.

**Parameters:**

- `query`: object<QueryOptions>
  - An object containing the query parameters.
- `namespace?`: string (optional)
  - Optional namespace to search within specific document collections.

**Return Value:**

- `Promise<any>`: A promise that resolves to the search results from Upstash Vector.

**QueryOptions Type:**

```typescript
interface QueryOptions {
  data: string; // The query text to search for
  topK: number; // Number of top results to return
  filter?: string; // Optional filter for metadata
  includeData?: boolean; // Whether to include document data in results
  includeMetadata?: boolean; // Whether to include metadata in results
}
```

**Examples:**

```typescript
// Example 1: Basic semantic search
const results = await ragSDK.queryDocsFromRAG({
  data: 'What is artificial intelligence?',
  topK: 5,
  includeData: true,
  includeMetadata: true,
});

// Example 2: Search within a namespace
const results = await ragSDK.queryDocsFromRAG(
  {
    data: 'How to use the product?',
    topK: 3,
    includeData: true,
    includeMetadata: true,
  },
  'product-docs'
);

// Example 3: Search with metadata filter
const results = await ragSDK.queryDocsFromRAG({
  data: 'Machine learning algorithms',
  topK: 10,
  filter: 'category = "technology"',
  includeData: true,
  includeMetadata: true,
});

// Example 4: Search with complex metadata filters
const results = await ragSDK.queryDocsFromRAG({
  data: 'AI and machine learning',
  topK: 5,
  filter:
    'category = "technology" AND author = "John Doe" AND publishDate >= "2024-01-01"',
  includeData: true,
  includeMetadata: true,
});

// Example 5: Search with array filters
const results = await ragSDK.queryDocsFromRAG({
  data: 'Python programming',
  topK: 5,
  filter: 'tags CONTAINS "python" AND tags CONTAINS "tutorial"',
  includeData: true,
  includeMetadata: true,
});

// Example 6: Search with nested object filters
const results = await ragSDK.queryDocsFromRAG({
  data: 'Database systems',
  topK: 5,
  filter:
    'metadata.difficulty = "advanced" AND metadata.topic.category = "databases"',
  includeData: true,
  includeMetadata: true,
});

// Example 7: Search with custom metadata type
interface ArticleMetadata {
  title: string;
  author: string;
  publishDate: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: {
    category: string;
    subcategory: string;
  };
}

const ragSDK = new RagUpstashSdk<ArticleMetadata>({
  upstashUrl: 'https://your-index.upstash.io',
  upstashToken: 'your-token',
});

const results = await ragSDK.queryDocsFromRAG<ArticleMetadata>({
  data: 'RAG implementation guide',
  topK: 5,
  filter:
    'tags CONTAINS "rag" AND difficulty = "intermediate" AND topic.category = "ai"',
  includeData: true,
  includeMetadata: true,
});
```
