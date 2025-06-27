## Function: `updateDataset`

Updates an existing dataset. Currently, only the name of the dataset can be modified.

**Purpose:**
This function is used to rename a dataset.

**Parameters:**
- `datasetId` (string): The unique identifier of the dataset to update.
- `dataset` (object): An object containing the fields to update.
  - `name` (string, optional): The new name for the dataset.

**Return Value:**
- `Promise<Dataset>`: A promise that resolves to the updated `Dataset` object.
- `Dataset` (object):
  - `id` (string): Unique identifier of the dataset.
  - `name` (string, optional): The updated name of the dataset.
  - `createdAt` (string): ISO 8601 date string of when the dataset was created.
  - `modifiedAt` (string): ISO 8601 date string of when the dataset was last modified.

**Examples:**

```typescript
// Example 1: Rename a dataset
const datasetId = '<dataset_id>';
const updatedDataset = await apify.updateDataset(datasetId, { name: 'new-dataset-name' });
console.log(updatedDataset);
```