## Function: `getMyFriends`

Part of the `account` section. Gets the list of friends for the currently authenticated user.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<RelationshipListing>`: A promise that resolves to a list of friends.

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
// Example: Get friends list
const friends = await redditSdk.api.account.getMyFriends();
friends.data.children.forEach(friend => {
  console.log(friend.name);
});
``` 