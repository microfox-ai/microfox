## Function: `runPivotReport`

Runs a pivot report.

**Purpose:**

Executes a Google Analytics pivot report.

**Parameters:**

- `property`: string - The property ID to query.
- `request`: RunPivotReportRequest - The pivot report request parameters.

**Return Value:**

- `Promise<RunPivotReportResponse>` - A promise that resolves to the pivot report response.

**Examples:**

```typescript
// Example: Run a pivot report
const response = await sdk.runPivotReport('properties/<propertyId>', {
  metrics: [{ name: 'sessions' }],
  dimensions: [{ name: 'country' }],
  pivots: [{ fieldNames: ['country'] }],
});
console.log(response);
```
