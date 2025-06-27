## Function: `listJobs`

Lists all reporting jobs.

**Purpose:**
Retrieves a list of all reporting jobs.

**Parameters:**

- `params`: `object` (optional) - An object containing optional parameters for the request.
  - `includeSystemManaged`: `boolean` (optional) - Whether to include system-managed jobs in the response.
  - `onBehalfOfContentOwner`: `string` (optional) - The content owner's external ID.
  - `pageToken`: `string` (optional) - A token to retrieve the next page of results.

**Return Value:**

- `Promise<ListJobsResponse>` - A promise that resolves to an object containing the list of jobs and a next page token (if available).
  - `jobs`: `array<Job>` - An array of job objects.
    - `id`: `string` - The ID of the job.
    - `name`: `string` - The name of the job.
    - `reportTypeId`: `string` - The ID of the report type for the job.
    - `createTime`: `string` - The creation time of the job.
  - `nextPageToken`: `string` (optional) - A token to retrieve the next page of results.

**Examples:**

```typescript
// Example 1: List all jobs
const jobs = await sdk.listJobs();
console.log(jobs);

// Example 2: List jobs with optional parameters
const jobs = await sdk.listJobs({
  includeSystemManaged: true,
  onBehalfOfContentOwner: '<content owner id>',
  pageToken: '<next page token>'
});
console.log(jobs);
```