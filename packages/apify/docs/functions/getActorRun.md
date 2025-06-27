## Function: `getActorRun`

Retrieves the details of a specific actor run by its ID.

**Purpose:**
This function allows you to check the status, logs, and other details of a specific actor run. It is useful for monitoring the progress and outcome of an execution.

**Parameters:**
- `actorId` (string): The unique identifier of the actor.
- `runId` (string): The unique identifier of the run to retrieve.

**Return Value:**
- `Promise<Run>`: A promise that resolves to the `Run` object.
- `Run` (object):
  - `id` (string): Unique identifier of the run.
  - `actId` (string): ID of the actor this run belongs to.
  - `status` (string): The current status of the run.
  - `startedAt` (string): ISO 8601 date string of when the run started.
  - `finishedAt` (string, optional): ISO 8601 date string of when the run finished.

**Examples:**

```typescript
// Example 1: Get a specific actor run
const actorId = '<actor_id>';
const runId = '<run_id>';
const runDetails = await apify.getActorRun(actorId, runId);
console.log(runDetails);
```