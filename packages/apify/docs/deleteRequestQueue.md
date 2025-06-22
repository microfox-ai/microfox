## Function: `deleteRequestQueue`

Deletes a specific request queue and all of its contents.

**Purpose:**
This function permanently removes a request queue and all the requests stored within it. This action is irreversible.

**Parameters:**
- `queueId` (string): The unique identifier of the request queue to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the request queue has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete a request queue by its ID
const queueId = '<queue_id_to_delete>';
await apify.deleteRequestQueue(queueId);
console.log('Request queue deleted successfully.');
```