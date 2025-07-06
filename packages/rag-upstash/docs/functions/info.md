## Function: `info`

Retrieves information about the vector index.

**Purpose:**
Gets metadata and statistics about the current vector index.

**Parameters:**

- None

**Return Value:**

- `Promise<any>`: A promise that resolves to index information.

**Examples:**

```typescript
// Example 1: Get basic index information
const info = await ragSDK.info();
console.log('Index info:', info);
// Output: { dimension: 1536, metric: 'cosine', totalVectorCount: 1000, ... }

// Example 2: Check index health
const info = await ragSDK.info();
if (info.totalVectorCount > 10000) {
  console.log('Large index detected, consider optimization');
}

// Example 3: Monitor index usage
const info = await ragSDK.info();
console.log(`Index contains ${info.totalVectorCount} vectors`);
console.log(`Vector dimension: ${info.dimension}`);
console.log(`Distance metric: ${info.metric}`);

// Example 4: Use info for capacity planning
const info = await ragSDK.info();
const usagePercentage = (info.totalVectorCount / info.maxVectorCount) * 100;
if (usagePercentage > 80) {
  console.warn('Index is approaching capacity limit');
}
```
