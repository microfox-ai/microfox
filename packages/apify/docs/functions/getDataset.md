## Function: `getDataset`

Retrieves the details of a specific dataset by its ID.

**Purpose:**
This function allows you to fetch the metadata of a single dataset, such as its name, creation date, and modification date.

**Parameters:**
- `datasetId` (string): The unique identifier of the dataset to retrieve.

**Return Value:**
- `Promise<Dataset>`: A promise that resolves to the `Dataset` object.
- `Dataset` (object):
  - `id` (string): Unique identifier of the dataset.
  - `name` (string, optional): Name of the dataset.
  - `createdAt` (string): ISO 8601 date string of when the dataset was created.
  - `modifiedAt` (string): ISO 8601 date string of when the dataset was last modified.

**Examples:**

```typescript
// Example 1: Get a specific dataset by its ID
const datasetId = '<dataset_id>';
const dataset = await apify.getDataset(datasetId);
console.log(dataset);
```