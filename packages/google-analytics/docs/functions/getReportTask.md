## Function: `getReportTask`

Retrieves a report task.

**Purpose:**

Gets an existing report task.

**Parameters:**

- `name`: string - The name of the report task to retrieve.

**Return Value:**

- `Promise<ReportTask>` - A promise that resolves to the report task.

**Examples:**

```typescript
// Example: Get a report task
const reportTask = await sdk.getReportTask(
  'properties/<propertyId>/reportTasks/<reportTaskId>',
);
console.log(reportTask);
```
