## Function: `createActorVersion`

Creates a new version for a specific actor with the provided source code and configuration.

**Purpose:**
This function is used to create a new, immutable version of an actor's source code and settings. This is essential for version control and for running specific iterations of an actor.

**Parameters:**
- `actorId` (string): The unique identifier of the actor for which to create a new version.
- `version` (object): An object representing the new version. The `id` property is omitted.
  - `versionNumber` (string): The version number for the new version (e.g., "1.2").
  - `buildTag` (string): A build tag to identify this version.
  - `sourceType` (string): The type of the source code. Must be one of `'SOURCE_FILES'`, `'TARBALL'`, or `'GIT_REPO'`.
  - `sourceCode` (string, optional): The source code for this version.

**Return Value:**
- `Promise<Version>`: A promise that resolves to the newly created `Version` object.
- `Version` (object):
  - `versionNumber` (string): Version number of the actor.
  - `buildTag` (string): Build tag of the version.
  - `sourceType` (string): The type of the source code.
  - `sourceCode` (string, optional): The source code of the version.

**Examples:**

```typescript
// Example 1: Create a new actor version
const actorId = '<actor_id>';
const newVersionData = {
  versionNumber: '1.1',
  buildTag: 'beta',
  sourceType: 'SOURCE_FILES',
  sourceCode: 'console.log("Hello from version 1.1");'
};
const newVersion = await apify.createActorVersion(actorId, newVersionData);
console.log(newVersion);
```