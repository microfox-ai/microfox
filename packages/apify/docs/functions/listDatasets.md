## Function: `listDatasets`

Retrieves a paginated list of datasets available to the user.

**Purpose:**
This function allows you to browse and manage your datasets on the Apify platform. Datasets are used to store structured data produced by actor runs.

**Parameters:**
- `params` (object, optional): An object containing query parameters for filtering and pagination.
  - `offset` (number, optional): The number of datasets to skip. Default: `0`.
  - `limit` (number, optional): The maximum number of datasets to return. Default: `1000`.
  - `desc` (boolean, optional): If `true`, sorts datasets in descending order. Default: `false`.
  - `unnamed` (boolean, optional): If `true`, only returns unnamed datasets.

**Return Value:**
- `Promise<Pagination<Dataset>>`: A promise that resolves to a pagination object containing a list of datasets.
- `Pagination<Dataset>` (object):
  - `total` (number): Total number of datasets available.
  - `offset` (number): The starting offset of the returned datasets.
  - `limit` (number): The maximum number of datasets per page.
  - `count` (number): The number of datasets returned in the current page.
  - `items` (array<Dataset>): An array of `Dataset` objects.
- `Dataset` (object):
  - `id` (string): Unique identifier of the dataset.
  - `name` (string, optional): Name of the dataset.
  - `createdAt` (string): ISO 8601 date string of when the dataset was created.
  - `modifiedAt` (string): ISO 8601 date string of when the dataset was last modified.

**Examples:**

```typescript
// Example 1: List the 10 most recently modified datasets
const recentDatasets = await apify.listDatasets({ limit: 10, desc: true });
console.log(recentDatasets.items);

// Example 2: List all unnamed datasets
const unnamedDatasets = await apify.listDatasets({ unnamed: true });
console.log(unnamedDatasets);
```