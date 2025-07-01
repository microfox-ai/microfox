## Function: `getUsersWhere`

Retrieves a listing of users by category.

**Parameters:**

- `where`: "popular" | "new" - The category of users to retrieve.
- `after`: string (optional) - The fullname of an item to list after for pagination.
- `before`: string (optional) - The fullname of an item to list before for pagination.
- `count`: number (optional) - The number of items already seen in the listing.
- `limit`: number (optional, default: 25) - The maximum number of items to return.
- `show`: "all" | undefined (optional) - If "all", posts that have been voted on will be included.

**Return Type:**

- `Promise<ThingListing<User>>`: A promise that resolves to a listing of `User` objects.

**ThingListing<User> Object Details:**

- `kind`: string (always 'Listing')
- `data`: object
  - `after`: string | null
  - `before`: string | null
  - `dist`: number
  - `modhash`: string
  - `geo_filter`: string | null
  - `children`: `User[]`

**User Object Details:**

- See the `User` object schema in the `account.getMe` documentation.

**Usage Example:**

```typescript
const popularUsers = await reddit.users.getUsersWhere({ where: 'popular', limit: 10 });
console.log(popularUsers.data.children.map(user => user.data.name));
``` 
