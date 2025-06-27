## Function: `getForms`

Retrieves a list of all forms accessible by the API key.

**Purpose:**
This function fetches a list of all available forms.

**Parameters:**
This function does not take any parameters.

**Return Value:**

* `Promise<Form[]>` A promise that resolves to an array of `Form` objects.
    * `Form`: An object representing a form.

**Examples:**

```typescript
// Example: Get all forms
async function getAllForms() {
  const forms = await filloutSDK.getForms();
  console.log(forms);
}
```