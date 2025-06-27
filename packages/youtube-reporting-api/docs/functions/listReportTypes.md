## Function: `listReportTypes`

Lists available report types.

**Purpose:**
Retrieves a list of available report types from the YouTube Reporting API.

**Parameters:**

- `params`: `object` (optional) - An object containing optional parameters for the request.
  - `includeSystemManaged`: `boolean` (optional) - Whether to include system-managed report types in the response.
  - `onBehalfOfContentOwner`: `string` (optional) - The content owner's external ID.
  - `pageToken`: `string` (optional) - A token to retrieve the next page of results.

**Return Value:**

- `Promise<ListReportTypesResponse>` - A promise that resolves to an object containing the list of report types and a next page token (if available).
  - `reportTypes`: `array<ReportType>` - An array of report type objects.
    - `id`: `string` - The ID of the report type.
    - `name`: `string` - The name of the report type.
    - `systemManaged`: `boolean` (optional) - Whether the report type is system-managed.
  - `nextPageToken`: `string` (optional) - A token to retrieve the next page of results.

**Examples:**

```typescript
// Example 1: List all report types
const reportTypes = await sdk.listReportTypes();
console.log(reportTypes);

// Example 2: List report types with optional parameters
const reportTypes = await sdk.listReportTypes({
  includeSystemManaged: true,
  onBehalfOfContentOwner: '<content owner id>',
  pageToken: '<next page token>'
});
console.log(reportTypes);
```