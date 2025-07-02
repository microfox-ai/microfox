## Function: `listReportTasks`

Lists report tasks.

**Purpose:**

Retrieves a list of report tasks.

**Parameters:**

- `parent`: string - The parent resource name.

**Return Value:**

- `Promise<ListReportTasksResponse>` - A promise that resolves to the list of report tasks.

**Examples:**

```typescript
// Example: List report tasks
const response = await sdk.listReportTasks('properties/<propertyId>');
console.log(response);
```
