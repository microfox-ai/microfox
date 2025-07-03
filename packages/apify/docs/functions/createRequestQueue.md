## Function: `createRequestQueue`

Creates a new, empty request queue with an optional name.

**Purpose:**
This function is used to programmatically create a new request queue where you can later add requests (URLs) for an actor to process.

**Parameters:**
- `queue` (object): An object representing the request queue to be created. The `id` property is omitted.
  - `name` (string, optional): A name for the new request queue.
  - ... other fields from the `RequestQueue` type that can be set on creation.

**Return Value:**
- `Promise<RequestQueue>`: A promise that resolves to the newly created `RequestQueue` object.
- `RequestQueue` (object):
  - `id` (string): Unique identifier of the request queue.
  - `name` (string, optional): Name of the request queue.
  - `createdAt` (string): ISO 8601 date string of when the queue was created.
  - `modifiedAt` (string): ISO 8601 date string of when the queue was last modified.

**Examples:**

```typescript
// Example 1: Create a new named request queue
const newQueue = await apify.createRequestQueue({ name: 'my-url-queue' });
console.log(newQueue);

// Example 2: Create a new unnamed request queue
const unnamedQueue = await apify.createRequestQueue({});
console.log(unnamedQueue);
```