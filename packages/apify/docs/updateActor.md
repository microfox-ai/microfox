## Function: `updateActor`

Updates an existing actor with new data. Only the fields provided in the `actor` object will be modified.

**Purpose:**
This function is used to modify the properties of an existing actor, such as changing its name or other configuration details.

**Parameters:**
- `actorId` (string): The unique identifier of the actor to update.
- `actor` (object): An object containing the fields to update. This is a partial representation of the `Actor` type.
  - `name` (string, optional): The new name for the actor.
  - ... any other mutable fields of the `Actor` type.

**Return Value:**
- `Promise<Actor>`: A promise that resolves to the updated `Actor` object.
- `Actor` (object):
  - `id` (string): Unique identifier of the actor.
  - `name` (string): Name of the actor.
  - `username` (string): Username of the actor's owner.
  - `createdAt` (string): ISO 8601 date string of when the actor was created.
  - `modifiedAt` (string): ISO 8601 date string of when the actor was last modified.

**Examples:**

```typescript
// Example 1: Update the name of an actor
const actorId = '<actor_id>';
const updatedActorData = {
  name: 'my-updated-actor-name'
};
const updatedActor = await apify.updateActor(actorId, updatedActorData);
console.log(updatedActor);
```