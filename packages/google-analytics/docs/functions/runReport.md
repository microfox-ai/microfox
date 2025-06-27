## Function: `runReport`

Runs a report.

**Purpose:**

Executes a Google Analytics report based on the provided request parameters.

**Parameters:**

- `property`: string - The property ID to query.
- `request`: RunReportRequest - The report request parameters.

**Return Value:**

- `Promise<RunReportResponse>` - A promise that resolves to the report response.

**Examples:**

```typescript
// Example: Run a report
const response = await sdk.runReport('properties/<propertyId>', {
  metrics: [{ name: 'sessions' }],
  dimensions: [{ name: 'country' }],
  dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
});
console.log(response);
```
