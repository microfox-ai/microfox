# RAG Upstash SDK

A TypeScript SDK for building Retrieval-Augmented Generation (RAG) applications using Upstash Vector. This SDK provides a simple and type-safe interface for indexing documents, performing semantic search, and managing vector databases.

## Features

- 🚀 **Easy Document Indexing**: Feed documents to your vector database with custom metadata
- 🔍 **Semantic Search**: Query documents using vector similarity search
- 🏷️ **Namespace Support**: Organize documents in separate namespaces
- 🛡️ **Type Safety**: Full TypeScript support with generic metadata types
- 🔧 **Direct API Access**: Access to all Upstash Vector Index methods
- 📊 **Metadata Filtering**: Powerful filtering capabilities for precise search results

## Installation

```bash
npm install @microfox/rag-upstash
```

## Quick Start

```typescript
import { RagUpstashSdk } from '@microfox/rag-upstash';

// Initialize the SDK
const ragSDK = new RagUpstashSdk({
  upstashUrl: process.env.UPSTASH_VECTOR_REST_URL!,
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Index documents
await ragSDK.feedDocsToRAG([
  {
    metadata: { title: 'AI Guide', category: 'technology' },
    doc: 'Artificial Intelligence is a branch of computer science...',
  },
]);

// Search documents
const results = await ragSDK.queryDocsFromRAG({
  data: 'What is artificial intelligence?',
  topK: 5,
  includeData: true,
  includeMetadata: true,
});
```

## API Reference

### Constructor

#### `new RagUpstashSdk<TMetadata>(config: RagUpstashSdkConfig)`

Creates a new instance of the RAG Upstash SDK.

```typescript
interface RagUpstashSdkConfig {
  upstashUrl: string; // Your Upstash Vector REST URL
  upstashToken: string; // Your Upstash Vector REST token
}
```

### Core Methods

#### `feedDocsToRAG(docs: Array<{metadata: TMetadata, doc: string}>, namespace?: string)`

Indexes documents in the vector database.

```typescript
// Basic indexing
await ragSDK.feedDocsToRAG([
  {
    metadata: { title: 'Document 1', category: 'tech' },
    doc: 'Document content here...',
  },
]);

// Indexing with namespace
await ragSDK.feedDocsToRAG(
  [
    {
      metadata: { title: 'Product Manual', category: 'docs' },
      doc: 'Product documentation...',
    },
  ],
  'product-docs'
);
```

#### `queryDocsFromRAG(query: QueryOptions, namespace?: string)`

Performs semantic search on indexed documents.

```typescript
interface QueryOptions {
  data: string; // Query text
  topK: number; // Number of results
  filter?: string; // Metadata filter
  includeData?: boolean; // Include document data
  includeMetadata?: boolean; // Include metadata
}

// Basic search
const results = await ragSDK.queryDocsFromRAG({
  data: 'machine learning algorithms',
  topK: 5,
  includeData: true,
  includeMetadata: true,
});

// Search with filter
const results = await ragSDK.queryDocsFromRAG(
  {
    data: 'AI tutorials',
    topK: 10,
    filter: 'category = "technology" AND difficulty = "beginner"',
    includeData: true,
    includeMetadata: true,
  },
  'tutorials'
);
```

### Utility Methods

#### `getConfig(): RagUpstashSdkConfig`

Returns the current configuration.

```typescript
const config = ragSDK.getConfig();
console.log('Connected to:', config.upstashUrl);
```

#### `info(): Promise<any>`

Gets information about the vector index.

```typescript
const info = await ragSDK.info();
console.log('Index contains', info.totalVectorCount, 'vectors');
```

#### `listNamespaces(): Promise<any>`

Lists all available namespaces.

```typescript
const namespaces = await ragSDK.listNamespaces();
console.log('Available namespaces:', namespaces);
```

### Direct API Access

The SDK also provides direct access to all Upstash Vector Index methods:

```typescript
// Direct vector operations
await ragSDK.upsert([{ id: 'doc-1', vector: [...], metadata: {...} }]);
await ragSDK.query({ vector: [...], topK: 5 });
await ragSDK.delete({ ids: ['doc-1', 'doc-2'] });
await ragSDK.fetch({ ids: ['doc-1'] });
```

## Advanced Usage

### Custom Metadata Types

```typescript
interface ArticleMetadata {
  title: string;
  author: string;
  publishDate: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ragSDK = new RagUpstashSdk<ArticleMetadata>({
  upstashUrl: process.env.UPSTASH_VECTOR_REST_URL!,
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Type-safe operations
await ragSDK.feedDocsToRAG([
  {
    metadata: {
      title: 'Getting Started with RAG',
      author: 'John Doe',
      publishDate: '2024-01-15',
      tags: ['rag', 'ai', 'tutorial'],
      difficulty: 'intermediate',
    },
    doc: 'Retrieval-Augmented Generation (RAG) is a technique...',
  },
]);
```

### Metadata Filtering

The SDK supports powerful metadata filtering using SQL-like syntax:

```typescript
// Complex filtering
const results = await ragSDK.queryDocsFromRAG({
  data: 'machine learning',
  topK: 10,
  filter: `
    category = "technology" AND 
    difficulty = "intermediate" AND 
    tags CONTAINS "ai" AND
    publishDate >= "2024-01-01"
  `,
  includeData: true,
  includeMetadata: true,
});
```

For detailed filtering documentation, see [filtering.md](./docs/filtering.md).

## Error Handling

The SDK uses Zod for runtime type validation and provides comprehensive error handling:

```typescript
try {
  const results = await ragSDK.queryDocsFromRAG({
    data: 'search query',
    topK: 5,
  });
  console.log('Search results:', results);
} catch (error) {
  if (error instanceof Error) {
    console.error('Search failed:', error.message);
  }
}
```

## Environment Variables

Set up your environment variables:

```bash
UPSTASH_VECTOR_REST_URL=https://your-index.upstash.io
UPSTASH_VECTOR_REST_TOKEN=your-upstash-token
```

## Documentation

- [Main Documentation](./docs/main.md)
- [API Reference](./docs/constructors/)
- [Function Documentation](./docs/functions/)
- [Filtering Guide](./docs/filtering.md)
- [Rules and Guidelines](./docs/rules.md)

## Examples

Check out the [examples](./examples/) directory for complete usage examples.

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.
