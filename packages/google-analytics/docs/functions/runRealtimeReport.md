## Function: `runRealtimeReport`

Runs a realtime report.

**Purpose:**

Executes a Google Analytics realtime report.

**Parameters:**

- `property`: string - The property ID to query.
- `request`: RunRealtimeReportRequest - The realtime report request parameters.

**Return Value:**

- `Promise<RunRealtimeReportResponse>` - A promise that resolves to the realtime report response.

**Examples:**

```typescript
// Example: Run a realtime report
const response = await sdk.runRealtimeReport('properties/<propertyId>', {
  metrics: [{ name: 'activeUsers' }],
});
console.log(response);
```
