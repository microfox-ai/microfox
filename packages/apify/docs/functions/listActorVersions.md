## Function: `listActorVersions`

Retrieves a list of all versions for a specific actor.

**Purpose:**
This function allows you to see all the different versions of an actor that have been created, which is useful for managing and tracking changes over time.

**Parameters:**
- `actorId` (string): The unique identifier of the actor whose versions you want to list.

**Return Value:**
- `Promise<Version[]>`: A promise that resolves to an array of `Version` objects.
- `Version` (object):
  - `versionNumber` (string): Version number of the actor (e.g., "1.0", "1.1").
  - `buildTag` (string): Build tag of the version.
  - `sourceType` (string): The type of the source code. Can be one of `'SOURCE_FILES'`, `'TARBALL'`, or `'GIT_REPO'`.
  - `sourceCode` (string, optional): The source code of the version.

**Examples:**

```typescript
// Example 1: List all versions of an actor
const actorId = '<actor_id>';
const versions = await apify.listActorVersions(actorId);
console.log(versions);
```