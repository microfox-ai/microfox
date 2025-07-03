## Function: `getMyBlocked`

Part of the `account` section. Gets the list of blocked users for the currently authenticated user.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<RelationshipListing>`: A promise that resolves to a list of blocked users.

**RelationshipListing Type:**

```typescript
export interface RelationshipListing {
  kind: "UserList";
  data: {
    children: Relationship[];
  };
}
```

**Relationship Type:**

```typescript
export interface Relationship {
  name: string; // The username.
  id: string; // The user's fullname.
  rel_id?: string; // The relation ID (for friends).
  date: number; // A UTC timestamp of when the relationship was created.
}
```

**Usage Example:**

```typescript
// Example: Get blocked users
const blockedUsers = await redditSdk.api.account.getMyBlocked();
blockedUsers.data.children.forEach(user => {
  console.log(user.name);
});
``` 