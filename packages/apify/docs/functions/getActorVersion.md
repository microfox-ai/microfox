## Function: `getActorVersion`

Retrieves the details of a specific version of an actor, identified by the actor ID and version number.

**Purpose:**
This function allows you to fetch the configuration and source details of a single, specific actor version.

**Parameters:**
- `actorId` (string): The unique identifier of the actor.
- `versionNumber` (string): The version number of the actor version to retrieve (e.g., "1.0", "1.1").

**Return Value:**
- `Promise<Version>`: A promise that resolves to the `Version` object.
- `Version` (object):
  - `versionNumber` (string): Version number of the actor.
  - `buildTag` (string): Build tag of the version.
  - `sourceType` (string): The type of the source code.
  - `sourceCode` (string, optional): The source code of the version.

**Examples:**

```typescript
// Example 1: Get a specific actor version
const actorId = '<actor_id>';
const versionNumber = '1.0';
const version = await apify.getActorVersion(actorId, versionNumber);
console.log(version);
```