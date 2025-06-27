## Function: `batchRunReports`

Runs multiple reports in a single request.

**Purpose:**

Executes multiple Google Analytics reports in a batch.

**Parameters:**

- `property`: string - The property ID to query.
- `request`: BatchRunReportsRequest - The batch report request parameters.

**Return Value:**

- `Promise<BatchRunReportsResponse>` - A promise that resolves to the batch report response.

**Examples:**

```typescript
// Example: Run multiple reports
const response = await sdk.batchRunReports('properties/<propertyId>', {
  requests: [
    { metrics: [{ name: 'sessions' }], dimensions: [{ name: 'country' }] },
    { metrics: [{ name: 'users' }], dimensions: [{ name: 'city' }] },
  ],
});
console.log(response);
```
