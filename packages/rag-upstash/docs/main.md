# RAG Upstash SDK

A TypeScript SDK for building Retrieval-Augmented Generation (RAG) applications using Upstash Vector.

## Installation

```bash
npm install @microfox/rag-upstash
```

## Usage

```typescript
import { RagUpstashSdk } from '@microfox/rag-upstash';

// Initialize the SDK with your Upstash Vector credentials
const ragSDK = new RagUpstashSdk({
  upstashUrl:
    process.env.UPSTASH_VECTOR_REST_URL ?? 'https://your-index.upstash.io',
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN ?? 'your-token',
});
```

## API Reference

### `RagUpstashSdk<TMetadata>`

Creates a new instance of the RAG Upstash SDK.

#### Config Options

- `upstashUrl` (string, required): Your Upstash Vector REST URL
- `upstashToken` (string, required): Your Upstash Vector REST token

## Error Handling

The SDK uses Zod for runtime type validation and will throw errors if:

- The configuration doesn't match the expected schema
- The Upstash Vector API request fails
- Invalid parameters are provided

Example:

```typescript
try {
  const vectors = await ragSDK.feedDocsToRAG([
    {
      metadata: { title: 'Document 1', category: 'tech' },
      doc: 'This is the content of document 1',
    },
  ]);
  console.log('Documents indexed:', vectors);
} catch (error) {
  console.error('Failed to index documents:', error);
}
```

## Features

- **Document Indexing**: Feed documents to the vector database with metadata
- **Semantic Search**: Query documents using vector similarity search
- **Namespace Support**: Organize documents in separate namespaces
- **Type Safety**: Full TypeScript support with generic metadata types
- **Direct API Access**: Access to all Upstash Vector Index methods
