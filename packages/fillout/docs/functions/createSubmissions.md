## Function: `createSubmissions`

Creates multiple submissions for a specific form.

**Purpose:**
This function creates multiple submissions for a given form ID.

**Parameters:**

* `formId`: A string representing the ID of the form.
* `submissions`: An array of `Submission` objects representing the submissions to create. Maximum 10 submissions are allowed per request.
    * `Submission`: An object representing a submission.

**Return Value:**

* `Promise<CreateSubmissionsResponse>` A promise that resolves to a `CreateSubmissionsResponse` object.
    * `CreateSubmissionsResponse`: An object containing the created submissions data.

**Examples:**

```typescript
// Example: Create multiple submissions
async function createSubmissionsExample(formId: string, submissions: Submission[]) {
  const createdSubmissions = await filloutSDK.createSubmissions(formId, submissions);
  console.log(createdSubmissions);
}
```