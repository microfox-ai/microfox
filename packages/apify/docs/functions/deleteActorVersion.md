## Function: `deleteActorVersion`

Deletes a specific version of an actor by its version number.

**Purpose:**
This function permanently removes a specific version of an actor. This action is irreversible and should be used with caution.

**Parameters:**
- `actorId` (string): The unique identifier of the actor.
- `versionNumber` (string): The version number of the actor version to delete (e.g., "1.0").

**Return Value:**
- `Promise<void>`: A promise that resolves when the actor version has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete an actor version
const actorId = '<actor_id>';
const versionNumberToDelete = '1.1-beta';
await apify.deleteActorVersion(actorId, versionNumberToDelete);
console.log(`Version ${versionNumberToDelete} of actor ${actorId} deleted successfully.`);
```