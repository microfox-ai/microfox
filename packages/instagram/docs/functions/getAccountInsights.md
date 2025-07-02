## Function: `getAccountInsights`

Gets insights for an account.

**Parameters:**

- `accountId`: string - The ID of the Instagram account.
- `insightsData`: object - The insights data.
  - `metric`: array<string> - Array of metric names to retrieve.
  - `period`: enum - Time period for the metrics. Possible values: 'day', 'week', 'days_28', 'lifetime'.

**Return Value:**

- `Promise<any>` - The insights data.

**Examples:**

```typescript
const insights = await instagramSDK.getAccountInsights('<accountId>', {
  metric: ['impressions', 'reach'],
  period: 'day',
});
```
