## Function: `getFormMetadata`

Retrieves metadata for a specific form.

**Purpose:**
This function fetches metadata information for a given form ID.

**Parameters:**

* `formId`: A string representing the ID of the form.

**Return Value:**

* `Promise<FormMetadata>` A promise that resolves to a `FormMetadata` object.
    * `FormMetadata`: An object containing metadata about the form.

**Examples:**

```typescript
// Example: Get form metadata
async function getFormMetadataExample(formId: string) {
  const metadata = await filloutSDK.getFormMetadata(formId);
  console.log(metadata);
}
```