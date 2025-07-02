## Function: `getMyFriends`

Retrieves a list of the user's friends.

**Return Type:**

- `Promise<UserList>`: A promise that resolves to a UserList object containing a list of friends.

**UserList Object Details:**

- `kind`: string (always 'UserList') - The type of the object.
- `data`: object - The main data payload.
  - `children`: `Relationship[]` - An array of friend relationships.

**Relationship Object Details:**

- `name`: string - The username of the friend.
- `id`: string - The friend's unique user ID (fullname).
- `rel_id`: string - The relationship ID.
- `date`: number - A UTC timestamp of when the friendship was created.

**Usage Example:**

```typescript
const friendsList = await reddit.account.getMyFriends();
console.log(friendsList);
```

**Code Example:**

```typescript
async function listFriends() {
  const friendsData = await reddit.account.getMyFriends();
  console.log('My Friends:');
  friendsData.data.children.forEach(friend => {
    console.log(`- ${friend.name} (since ${new Date(friend.date * 1000).toLocaleDateString()})`);
  });
}

listFriends();
``` 
