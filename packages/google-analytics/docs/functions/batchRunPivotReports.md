## Function: `batchRunPivotReports`

Runs multiple pivot reports in a single request.

**Purpose:**

Executes multiple Google Analytics pivot reports in a batch.

**Parameters:**

- `property`: string - The property ID to query.
- `request`: BatchRunPivotReportsRequest - The batch pivot report request parameters.

**Return Value:**

- `Promise<BatchRunPivotReportsResponse>` - A promise that resolves to the batch pivot report response.

**Examples:**

```typescript
// Example: Run multiple pivot reports
const response = await sdk.batchRunPivotReports('properties/<propertyId>', {
  requests: [
    {
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'country' }],
      pivots: [{ fieldNames: ['country'] }],
    },
    {
      metrics: [{ name: 'users' }],
      dimensions: [{ name: 'city' }],
      pivots: [{ fieldNames: ['city'] }],
    },
  ],
});
console.log(response);
```
