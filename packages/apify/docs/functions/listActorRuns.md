## Function: `listActorRuns`

Retrieves a paginated list of runs for a specific actor. The list can be filtered by status.

**Purpose:**
This function allows you to view the execution history of an actor, which is crucial for monitoring its performance and debugging issues.

**Parameters:**
- `actorId` (string): The unique identifier of the actor whose runs you want to list.
- `params` (object, optional): An object containing query parameters for filtering and pagination.
  - `offset` (number, optional): The number of runs to skip. Default: `0`.
  - `limit` (number, optional): The maximum number of runs to return. Default: `1000`.
  - `desc` (boolean, optional): If `true`, sorts runs in descending order (newest first). Default: `false`.
  - `status` (string, optional): Filters runs by their status. Valid values include `'READY'`, `'RUNNING'`, `'SUCCEEDED'`, `'FAILED'`, `'TIMED_OUT'`, `'CANCELED'`.

**Return Value:**
- `Promise<Pagination<Run>>`: A promise that resolves to a pagination object containing a list of runs.
- `Pagination<Run>` (object):
  - `total` (number): Total number of runs available.
  - `offset` (number): The starting offset of the returned runs.
  - `limit` (number): The maximum number of runs per page.
  - `count` (number): The number of runs returned in the current page.
  - `desc` (boolean, optional): Indicates if the sorting is in descending order.
  - `items` (array<Run>): An array of `Run` objects.
- `Run` (object):
  - `id` (string): Unique identifier of the run.
  - `actId` (string): ID of the actor this run belongs to.
  - `status` (string): The status of the run.
  - `startedAt` (string): ISO 8601 date string of when the run started.
  - `finishedAt` (string, optional): ISO 8601 date string of when the run finished.

**Examples:**

```typescript
// Example 1: List the last 5 failed runs for an actor
const actorId = '<actor_id>';
const failedRuns = await apify.listActorRuns(actorId, {
  status: 'FAILED',
  desc: true,
  limit: 5
});
console.log(failedRuns.items);

// Example 2: List all runs for an actor
const allRuns = await apify.listActorRuns(actorId);
console.log(allRuns);
```