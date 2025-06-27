## Function: `listReports`

Lists reports for a given job ID.

**Purpose:**
Retrieves a list of reports for a specific reporting job.

**Parameters:**

- `jobId`: `string` - The ID of the job.
- `params`: `object` (optional) - An object containing optional parameters for the request.
  - `createdAfter`: `string` (optional) - Filter results to include only reports created after this date and time.
  - `startTimeAtOrAfter`: `string` (optional) - Filter results to include only reports with a start time at or after this date and time.
  - `startTimeBefore`: `string` (optional) - Filter results to include only reports with a start time before this date and time.
  - `onBehalfOfContentOwner`: `string` (optional) - The content owner's external ID.
  - `pageToken`: `string` (optional) - A token to retrieve the next page of results.

**Return Value:**

- `Promise<ListReportsResponse>` - A promise that resolves to an object containing the list of reports and a next page token (if available).
  - `reports`: `array<Report>` - An array of report objects.
    - `id`: `string` - The ID of the report.
    - `jobId`: `string` - The ID of the job that generated the report.
    - `startTime`: `string` - The start time of the report data.
    - `endTime`: `string` - The end time of the report data.
    - `createTime`: `string` - The creation time of the report.
    - `downloadUrl`: `string` (optional) - The URL to download the report data.
  - `nextPageToken`: `string` (optional) - A token to retrieve the next page of results.

**Examples:**

```typescript
// Example 1: List reports for a job
const reports = await sdk.listReports('<job id>');
console.log(reports);

// Example 2: List reports with optional parameters
const reports = await sdk.listReports('<job id>', {
  createdAfter: '2023-10-26T12:00:00Z',
  startTimeAtOrAfter: '2023-10-27T00:00:00Z',
  startTimeBefore: '2023-10-28T00:00:00Z',
  onBehalfOfContentOwner: '<content owner id>',
  pageToken: '<next page token>'
});
console.log(reports);
```