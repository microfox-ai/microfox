## Function: `deleteActor`

Deletes a specific actor by its unique identifier.

**Purpose:**
This function permanently removes an actor from the Apify platform. This action is irreversible.

**Parameters:**
- `actorId` (string): The unique identifier of the actor to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the actor has been successfully deleted.

**Examples:**

```typescript
// Example 1: Delete an actor by its ID
const actorId = '<actor_id_to_delete>';
await apify.deleteActor(actorId);
console.log('Actor deleted successfully.');
```