## Function: `deleteDataset`

Deletes a specific dataset and all of its contents.

**Purpose:**
This function permanently removes a dataset and all the data stored within it. This action is irreversible and should be used with caution.

**Parameters:**
- `datasetId` (string): The unique identifier of the dataset to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the dataset has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete a dataset by its ID
const datasetId = '<dataset_id_to_delete>';
await apify.deleteDataset(datasetId);
console.log('Dataset deleted successfully.');
```