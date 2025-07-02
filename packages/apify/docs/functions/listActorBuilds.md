## Function: `listActorBuilds`

Retrieves a paginated list of builds for a specific actor.

**Purpose:**
This function allows you to track the build history of an actor, which is useful for debugging and monitoring the deployment process of actor versions.

**Parameters:**
- `actorId` (string): The unique identifier of the actor whose builds you want to list.
- `params` (object, optional): An object containing query parameters for pagination.
  - `offset` (number, optional): The number of builds to skip from the beginning of the list. Default: `0`.
  - `limit` (number, optional): The maximum number of builds to return. Default: `1000`.
  - `desc` (boolean, optional): If set to `true`, the builds are sorted in descending order (newest first). Default: `false`.

**Return Value:**
- `Promise<Pagination<Build>>`: A promise that resolves to a pagination object containing a list of builds.
- `Pagination<Build>` (object):
  - `total` (number): Total number of builds available.
  - `offset` (number): The starting offset of the returned builds.
  - `limit` (number): The maximum number of builds per page.
  - `count` (number): The number of builds returned in the current page.
  - `desc` (boolean, optional): Indicates if the sorting is in descending order.
  - `items` (array<Build>): An array of `Build` objects.
- `Build` (object):
  - `id` (string): Unique identifier of the build.
  - `actId` (string): ID of the actor this build belongs to.
  - `status` (string): The status of the build. Can be one of `'READY'`, `'BUILDING'`, or `'FAILED'`.
  - `startedAt` (string): ISO 8601 date string of when the build started.
  - `finishedAt` (string, optional): ISO 8601 date string of when the build finished.

**Examples:**

```typescript
// Example 1: List the latest builds for an actor
const actorId = '<actor_id>';
const builds = await apify.listActorBuilds(actorId, { desc: true, limit: 5 });
console.log(builds.items);

// Example 2: List all builds for an actor with default options
const allBuilds = await apify.listActorBuilds(actorId);
console.log(allBuilds);
```