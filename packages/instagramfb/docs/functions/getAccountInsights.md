## Function: `getAccountInsights`

Gets insights for a given account.

**Parameters:**

- `instagramAccountId` (string, required): The ID of the account.
- `metric` (string, required): The metric to retrieve.
- `period` (string, required): The period for the metric.

**Return Value:**

- `Promise<array<InsightMetric>>`: An array of insight metrics.

**Examples:**

```typescript
const insights = await sdk.getAccountInsights(
  '<instagramAccountId>',
  '<metric>',
  '<period>',
);
console.log(insights);
```
