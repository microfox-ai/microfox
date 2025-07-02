## Function: `updateRequestQueue`

Updates an existing request queue. Currently, only the name of the queue can be modified.

**Purpose:**
This function is used to rename a request queue.

**Parameters:**
- `queueId` (string): The unique identifier of the request queue to update.
- `queue` (object): An object containing the fields to update.
  - `name` (string, optional): The new name for the request queue.

**Return Value:**
- `Promise<RequestQueue>`: A promise that resolves to the updated `RequestQueue` object.
- `RequestQueue` (object):
  - `id` (string): Unique identifier of the request queue.
  - `name` (string, optional): The updated name of the request queue.
  - `createdAt` (string): ISO 8601 date string of when the queue was created.
  - `modifiedAt` (string): ISO 8601 date string of when the queue was last modified.

**Examples:**

```typescript
// Example 1: Rename a request queue
const queueId = '<queue_id>';
const updatedQueue = await apify.updateRequestQueue(queueId, { name: 'new-queue-name' });
console.log(updatedQueue);
```