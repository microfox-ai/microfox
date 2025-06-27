## Function: `getRequestQueue`

Retrieves the details of a specific request queue by its ID.

**Purpose:**
This function allows you to fetch the metadata of a single request queue, such as its name, creation date, and the number of requests it contains.

**Parameters:**
- `queueId` (string): The unique identifier of the request queue to retrieve.

**Return Value:**
- `Promise<RequestQueue>`: A promise that resolves to the `RequestQueue` object.
- `RequestQueue` (object):
  - `id` (string): Unique identifier of the request queue.
  - `name` (string, optional): Name of the request queue.
  - `createdAt` (string): ISO 8601 date string of when the queue was created.
  - `modifiedAt` (string): ISO 8601 date string of when the queue was last modified.

**Examples:**

```typescript
// Example 1: Get a specific request queue by its ID
const queueId = '<queue_id>';
const queue = await apify.getRequestQueue(queueId);
console.log(queue);
```