## Function: `getSubmissionById`

Retrieves a single submission by ID.

**Purpose:**
This function fetches a specific submission for a given form ID and submission ID.

**Parameters:**

* `formId`: A string representing the ID of the form.
* `submissionId`: A string representing the ID of the submission.
* `includeEditLink`: An optional boolean indicating whether to include the edit link in the response.

**Return Value:**

* `Promise<SingleSubmissionResponse>` A promise that resolves to a `SingleSubmissionResponse` object.
    * `SingleSubmissionResponse`: An object containing the submission data.

**Examples:**

```typescript
// Example 1: Get submission by ID
async function getSubmissionByIdExample(formId: string, submissionId: string) {
  const submission = await filloutSDK.getSubmissionById(formId, submissionId);
  console.log(submission);
}

// Example 2: Get submission by ID with edit link
async function getSubmissionByIdWithEditLinkExample(formId: string, submissionId: string) {
  const submission = await filloutSDK.getSubmissionById(formId, submissionId, true);
  console.log(submission);
}
```