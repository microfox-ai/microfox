## Function: `feedDocsToRAG`

Feeds documents to the RAG system by indexing them in the Upstash Vector database.

**Purpose:**
Indexes documents with their metadata for later retrieval using semantic search.

**Parameters:**

- `docs`: Array<{ metadata: TMetadata; doc: string }>
  - An array of documents to be indexed, each containing metadata and document content.
- `namespace?`: string (optional)
  - Optional namespace to organize documents separately.

**Return Value:**

- `Promise<any>`: A promise that resolves to the vector indexing response from Upstash.

**Document Type:**

```typescript
interface DocumentInput<TMetadata> {
  metadata: TMetadata; // Custom metadata for the document
  doc: string; // Document content to be indexed
}
```

**Examples:**

```typescript
// Example 1: Basic document indexing
const vectors = await ragSDK.feedDocsToRAG([
  {
    metadata: { title: 'Introduction to AI', category: 'technology' },
    doc: 'Artificial Intelligence is a branch of computer science...',
  },
  {
    metadata: { title: 'Machine Learning Basics', category: 'technology' },
    doc: 'Machine Learning is a subset of AI that enables computers...',
  },
]);

// Example 2: Indexing with namespace
const vectors = await ragSDK.feedDocsToRAG(
  [
    {
      metadata: { title: 'Product Manual', category: 'documentation' },
      doc: 'This product manual contains detailed instructions...',
    },
  ],
  'product-docs'
);

// Example 3: Indexing multiple documents with custom metadata
interface ArticleMetadata {
  title: string;
  author: string;
  publishDate: string;
  tags: string[];
}

const ragSDK = new RagUpstashSdk<ArticleMetadata>({
  upstashUrl: 'https://your-index.upstash.io',
  upstashToken: 'your-token',
});

const vectors = await ragSDK.feedDocsToRAG([
  {
    metadata: {
      title: 'Getting Started with RAG',
      author: 'John Doe',
      publishDate: '2024-01-15',
      tags: ['rag', 'ai', 'tutorial'],
    },
    doc: 'Retrieval-Augmented Generation (RAG) is a technique that combines...',
  },
]);
```
