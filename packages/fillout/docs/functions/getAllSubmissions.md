## Function: `getAllSubmissions`

Retrieves all submissions for a specific form.

**Purpose:**
This function fetches all submissions for a given form ID, with optional filtering and pagination.

**Parameters:**

* `formId`: A string representing the ID of the form.
* `options`: An optional object with the following properties:
    * `limit`: An optional number specifying the maximum number of submissions to retrieve.
    * `afterDate`: An optional string representing the start date for filtering submissions.
    * `beforeDate`: An optional string representing the end date for filtering submissions.
    * `offset`: An optional number specifying the offset for pagination.
    * `status`: An optional string representing the submission status. Currently, only "in_progress" is supported.
    * `includeEditLink`: An optional boolean indicating whether to include the edit link in the response.
    * `includePreview`: An optional boolean indicating whether to include the preview in the response.
    * `sort`: An optional string specifying the sort order. Can be either "asc" or "desc".
    * `search`: An optional string to search submissions.

**Return Value:**

* `Promise<SubmissionResponse>` A promise that resolves to a `SubmissionResponse` object.
    * `SubmissionResponse`: An object containing an array of submissions and pagination information.

**Examples:**

```typescript
// Example 1: Get all submissions
async function getAllSubmissionsExample(formId: string) {
  const submissions = await filloutSDK.getAllSubmissions(formId);
  console.log(submissions);
}

// Example 2: Get submissions with options
async function getAllSubmissionsWithOptionsExample(formId: string) {
  const submissions = await filloutSDK.getAllSubmissions(formId, {
    limit: 10,
    afterDate: '2024-01-01',
    sort: 'desc',
  });
  console.log(submissions);
}
```