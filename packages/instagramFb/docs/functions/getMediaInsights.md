## Function: `getMediaInsights`

Gets insights for a given media object.

**Parameters:**

- `instagramMediaId` (string, required): The ID of the media object.
- `metric` (string, required): The metric to retrieve.
- `period` (string, required): The period for the metric.

**Return Value:**

- `Promise<array<InsightMetric>>`: An array of insight metrics.

**Examples:**

```typescript
const insights = await sdk.getMediaInsights(
  '<instagramMediaId>',
  '<metric>',
  '<period>',
);
console.log(insights);
```
