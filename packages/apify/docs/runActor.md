## Function: `runActor`

Starts a new run for a specific actor with the given options. This is equivalent to pressing the "Start" button in the Apify Console.

**Purpose:**
This function is used to execute an actor. You can provide input for the actor and override its default run options.

**Parameters:**
- `actorId` (string): The unique identifier of the actor to run.
- `runOptions` (object): An object containing the options for the run. This is a partial representation of the `Run` type. It can include input for the actor, memory allocation, timeout settings, etc.
  - ... any fields from the `Run` type that can be set at the start of a run.

**Return Value:**
- `Promise<Run>`: A promise that resolves to the `Run` object, which represents the started actor run.
- `Run` (object):
  - `id` (string): Unique identifier of the run.
  - `actId` (string): ID of the actor this run belongs to.
  - `status` (string): The initial status of the run (e.g., `'READY'` or `'RUNNING'`).
  - `startedAt` (string): ISO 8601 date string of when the run was started.
  - `finishedAt` (string, optional): ISO 8601 date string of when the run finished.

**Examples:**

```typescript
// Example 1: Run an actor with custom input
const actorId = '<actor_id>';
const runOptions = {
  // Assuming the actor accepts an input object
  // This will be passed as the input to the actor run
  input: {
    url: 'https://example.com',
    maxItems: 100
  }
};
const actorRun = await apify.runActor(actorId, runOptions);
console.log(`Started actor run with ID: ${actorRun.id}`);
```