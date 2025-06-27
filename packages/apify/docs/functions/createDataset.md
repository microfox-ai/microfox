## Function: `createDataset`

Creates a new, empty dataset with an optional name.

**Purpose:**
This function is used to programmatically create a new dataset where you can later store data from your actor runs or other sources.

**Parameters:**
- `dataset` (object): An object representing the dataset to be created. The `id` property is omitted.
  - `name` (string, optional): A name for the new dataset.
  - ... other fields from the `Dataset` type that can be set on creation.

**Return Value:**
- `Promise<Dataset>`: A promise that resolves to the newly created `Dataset` object.
- `Dataset` (object):
  - `id` (string): Unique identifier of the dataset.
  - `name` (string, optional): Name of the dataset.
  - `createdAt` (string): ISO 8601 date string of when the dataset was created.
  - `modifiedAt` (string): ISO 8601 date string of when the dataset was last modified.

**Examples:**

```typescript
// Example 1: Create a new named dataset
const newDataset = await apify.createDataset({ name: 'my-new-dataset' });
console.log(newDataset);

// Example 2: Create a new unnamed dataset
const unnamedDataset = await apify.createDataset({});
console.log(unnamedDataset);
```