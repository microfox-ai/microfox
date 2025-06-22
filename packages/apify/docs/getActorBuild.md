## Function: `getActorBuild`

Retrieves the details of a specific actor build by its ID.

**Purpose:**
This function allows you to check the status and other details of a specific build process for an actor.

**Parameters:**
- `actorId` (string): The unique identifier of the actor.
- `buildId` (string): The unique identifier of the build to retrieve.

**Return Value:**
- `Promise<Build>`: A promise that resolves to the `Build` object.
- `Build` (object):
  - `id` (string): Unique identifier of the build.
  - `actId` (string): ID of the actor this build belongs to.
  - `status` (string): The status of the build. Can be one of `'READY'`, `'BUILDING'`, or `'FAILED'`.
  - `startedAt` (string): ISO 8601 date string of when the build started.
  - `finishedAt` (string, optional): ISO 8601 date string of when the build finished.

**Examples:**

```typescript
// Example 1: Get a specific actor build
const actorId = '<actor_id>';
const buildId = '<build_id>';
const build = await apify.getActorBuild(actorId, buildId);
console.log(build);
```