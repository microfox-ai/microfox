## Function: `runFunnelReport`

Runs a funnel report.

**Purpose:**

Executes a Google Analytics funnel report.

**Parameters:**

- `property`: string - The property ID to query.
- `request`: RunFunnelReportRequest - The funnel report request parameters.

**Return Value:**

- `Promise<RunFunnelReportResponse>` - A promise that resolves to the funnel report response.

**Examples:**

```typescript
// Example: Run a funnel report
const response = await sdk.runFunnelReport('properties/<propertyId>', {
  steps: [
    { name: 'Step 1', isGoal: false },
    { name: 'Step 2', isGoal: true },
  ],
});
console.log(response);
```
