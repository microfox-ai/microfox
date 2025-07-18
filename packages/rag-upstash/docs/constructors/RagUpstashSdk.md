## Constructor: `RagUpstashSdk`

Creates a new instance of the RAG Upstash SDK.

**Purpose:**
Initializes a new client for interacting with Upstash Vector for RAG applications.

**Parameters:**

- `config`: object<RagUpstashSdkConfig>
  - An object containing the configuration options for the SDK.

**Return Value:**

- `RagUpstashSdk<TMetadata>`: An instance of the RAG Upstash SDK.

**RagUpstashSdkConfig Type:**

```typescript
export interface RagUpstashSdkConfig {
  upstashUrl: string; // Upstash Vector REST URL
  upstashToken: string; // Upstash Vector REST token
}
```

**Examples:**

```typescript
// Example 1: Basic initialization
const ragSDK = new RagUpstashSdk({
  upstashUrl: 'https://your-index.upstash.io',
  upstashToken: 'your-upstash-token',
});

// Example 2: With environment variables
const ragSDK = new RagUpstashSdk({
  upstashUrl: process.env.UPSTASH_VECTOR_REST_URL!,
  upstashToken: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// Example 3: With custom metadata type
interface DocumentMetadata {
  title: string;
  category: string;
  author: string;
}

const ragSDK = new RagUpstashSdk<DocumentMetadata>({
  upstashUrl: 'https://your-index.upstash.io',
  upstashToken: 'your-upstash-token',
});
```
