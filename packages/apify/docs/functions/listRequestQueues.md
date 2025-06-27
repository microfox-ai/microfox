## Function: `listRequestQueues`

Retrieves a paginated list of request queues available to the user.

**Purpose:**
This function allows you to browse and manage your request queues on the Apify platform. Request queues are used to manage URLs to be crawled or processed by an actor.

**Parameters:**
- `params` (object, optional): An object containing query parameters for filtering and pagination.
  - `offset` (number, optional): The number of queues to skip. Default: `0`.
  - `limit` (number, optional): The maximum number of queues to return. Default: `1000`.
  - `desc` (boolean, optional): If `true`, sorts queues in descending order. Default: `false`.
  - `unnamed` (boolean, optional): If `true`, only returns unnamed queues.

**Return Value:**
- `Promise<Pagination<RequestQueue>>`: A promise that resolves to a pagination object containing a list of request queues.
- `Pagination<RequestQueue>` (object):
  - `total` (number): Total number of queues available.
  - `offset` (number): The starting offset of the returned queues.
  - `limit` (number): The maximum number of queues per page.
  - `count` (number): The number of queues returned in the current page.
  - `items` (array<RequestQueue>): An array of `RequestQueue` objects.
- `RequestQueue` (object):
  - `id` (string): Unique identifier of the request queue.
  - `name` (string, optional): Name of the request queue.
  - `createdAt` (string): ISO 8601 date string of when the queue was created.
  - `modifiedAt` (string): ISO 8601 date string of when the queue was last modified.

**Examples:**

```typescript
// Example 1: List the 5 most recently modified request queues
const recentQueues = await apify.listRequestQueues({ limit: 5, desc: true });
console.log(recentQueues.items);

// Example 2: List all request queues
const allQueues = await apify.listRequestQueues();
console.log(allQueues);
```