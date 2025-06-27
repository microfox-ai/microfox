## Function: `deleteSubmissionById`

Deletes a single submission by ID.

**Purpose:**
This function deletes a specific submission for a given form ID and submission ID.

**Parameters:**

* `formId`: A string representing the ID of the form.
* `submissionId`: A string representing the ID of the submission.

**Return Value:**

* `Promise<void>` A promise that resolves when the submission is deleted.

**Examples:**

```typescript
// Example: Delete submission by ID
async function deleteSubmissionByIdExample(formId: string, submissionId: string) {
  await filloutSDK.deleteSubmissionById(formId, submissionId);
  console.log("Submission deleted successfully");
}
```