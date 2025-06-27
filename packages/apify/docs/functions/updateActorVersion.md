## Function: `updateActorVersion`

Updates an existing actor version with new data. Only the fields provided in the `version` object will be modified.

**Purpose:**
This function is used to modify the properties of an existing actor version, such as its build tag or source code.

**Parameters:**
- `actorId` (string): The unique identifier of the actor.
- `versionNumber` (string): The version number of the actor version to update.
- `version` (object): An object containing the fields to update. This is a partial representation of the `Version` type.
  - `buildTag` (string, optional): The new build tag for the version.
  - `sourceCode` (string, optional): The new source code for the version.
  - ... any other mutable fields of the `Version` type.

**Return Value:**
- `Promise<Version>`: A promise that resolves to the updated `Version` object.
- `Version` (object):
  - `versionNumber` (string): Version number of the actor.
  - `buildTag` (string): Build tag of the version.
  - `sourceType` (string): The type of the source code.
  - `sourceCode` (string, optional): The source code of the version.

**Examples:**

```typescript
// Example 1: Update the build tag of an actor version
const actorId = '<actor_id>';
const versionNumber = '1.0';
const updatedVersionData = {
  buildTag: 'stable-release'
};
const updatedVersion = await apify.updateActorVersion(actorId, versionNumber, updatedVersionData);
console.log(updatedVersion);
```