## Function: `listActors`

Retrieves a paginated list of actors. The list can be filtered and sorted using optional parameters.

**Purpose:**
This function allows you to browse and search for actors on the Apify platform, with options for pagination, sorting, and filtering.

**Parameters:**
- `params` (object, optional): An object containing query parameters for filtering and pagination.
  - `my` (boolean, optional): If set to `true`, only returns actors owned by the current user.
  - `offset` (number, optional): The number of actors to skip from the beginning of the list. Default: `0`.
  - `limit` (number, optional): The maximum number of actors to return. Default: `1000`.
  - `desc` (boolean, optional): If set to `true`, the actors are sorted in descending order. Default: `false`.
  - `sortBy` (string, optional): The field to sort the actors by. Valid values are `'createdAt'` or `'lastRunStartedAt'`.

**Return Value:**
- `Promise<Pagination<Actor>>`: A promise that resolves to a pagination object containing a list of actors.
- `Pagination<Actor>` (object):
  - `total` (number): Total number of actors available.
  - `offset` (number): The starting offset of the returned actors.
  - `limit` (number): The maximum number of actors per page.
  - `count` (number): The number of actors returned in the current page.
  - `desc` (boolean, optional): Indicates if the sorting is in descending order.
  - `items` (array<Actor>): An array of `Actor` objects.
- `Actor` (object):
  - `id` (string): Unique identifier of the actor.
  - `name` (string): Name of the actor.
  - `username` (string): Username of the actor's owner.
  - `createdAt` (string): ISO 8601 date string of when the actor was created.
  - `modifiedAt` (string): ISO 8601 date string of when the actor was last modified.

**Examples:**

```typescript
// Example 1: Minimal usage to list actors
const actorsList = await apify.listActors();
console.log(actorsList.items);

// Example 2: Full usage with all optional arguments
const options = {
  my: true,
  offset: 10,
  limit: 5,
  desc: true,
  sortBy: 'lastRunStartedAt'
};
const myActors = await apify.listActors(options);
console.log(myActors);
```