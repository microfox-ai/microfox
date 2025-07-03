## Function: `createReportTask`

Creates a report task.

**Purpose:**

Creates a new report task.

**Parameters:**

- `parent`: string - The parent resource name.
- `request`: CreateReportTaskRequest - The report task request parameters.

**Return Value:**

- `Promise<ReportTask>` - A promise that resolves to the created report task.

**Examples:**

```typescript
// Example: Create a report task
const reportTask = await sdk.createReportTask('properties/<propertyId>', {
  reportTask: { name: '<name>', description: '<description>' },
});
console.log(reportTask);
```
