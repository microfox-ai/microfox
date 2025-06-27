## Function: `createActorBuild`

Creates a new build for a specific actor. This is equivalent to pressing the "Build" button in the Apify Console.

**Purpose:**
This function triggers a new build process for an actor's specific version. This is used to compile the source code of an actor version into a runnable image.

**Parameters:**
- `actorId` (string): The unique identifier of the actor for which to create a new build.
- `build` (object): An object representing the build to be created. The `id` property is omitted.
  - `actId` (string): ID of the actor this build belongs to.
  - `status` (string): Status of the build.
  - `startedAt` (string): Date when the build started.
  - `finishedAt` (string, optional): Date when the build finished.
  - ... and other fields as defined in the `Build` type.

**Return Value:**
- `Promise<Build>`: A promise that resolves to the newly created `Build` object.
- `Build` (object):
  - `id` (string): Unique identifier of the build.
  - `actId` (string): ID of the actor this build belongs to.
  - `status` (string): The status of the build.
  - `startedAt` (string): ISO 8601 date string of when the build started.
  - `finishedAt` (string, optional): ISO 8601 date string of when the build finished.

**Examples:**

```typescript
// Example 1: Start a new build for an actor
const actorId = '<actor_id>';
const newBuildData = {
  actId: actorId,
  status: 'BUILDING',
  startedAt: new Date().toISOString(),
  // Add other required fields from the Build type
};
const newBuild = await apify.createActorBuild(actorId, newBuildData);
console.log(newBuild);
```