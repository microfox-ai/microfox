## Function: `getActor`

Retrieves the details of a specific actor by its unique identifier.

**Purpose:**
This function allows you to fetch the complete configuration and metadata of a single actor when you know its ID.

**Parameters:**
- `actorId` (string): The unique identifier of the actor you want to retrieve.

**Return Value:**
- `Promise<Actor>`: A promise that resolves to the `Actor` object.
- `Actor` (object):
  - `id` (string): Unique identifier of the actor.
  - `name` (string): Name of the actor.
  - `username` (string): Username of the actor's owner.
  - `createdAt` (string): ISO 8601 date string of when the actor was created.
  - `modifiedAt` (string): ISO 8601 date string of when the actor was last modified.

**Examples:**

```typescript
// Example 1: Get a specific actor by its ID
const actorId = '<actor_id>';
const actor = await apify.getActor(actorId);
console.log(actor);
```