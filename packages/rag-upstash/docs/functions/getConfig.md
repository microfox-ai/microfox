## Function: `getConfig`

Retrieves the current configuration of the RAG Upstash SDK.

**Purpose:**
Returns a copy of the current configuration used by the SDK instance.

**Parameters:**

- None

**Return Value:**

- `RagUpstashSdkConfig`: A copy of the current configuration object.

**Examples:**

```typescript
// Example 1: Get current configuration
const config = ragSDK.getConfig();
console.log('Current config:', config);
// Output: { upstashUrl: 'https://your-index.upstash.io', upstashToken: 'your-token' }

// Example 2: Use configuration for debugging
const config = ragSDK.getConfig();
console.log('Connected to:', config.upstashUrl);

// Example 3: Validate configuration
const config = ragSDK.getConfig();
if (!config.upstashUrl || !config.upstashToken) {
  throw new Error('Invalid configuration');
}

// Example 4: Use configuration in other parts of the application
const config = ragSDK.getConfig();
const otherService = new OtherService({
  vectorUrl: config.upstashUrl,
  vectorToken: config.upstashToken,
});
```
