## Function: `addRoleToUser`

Adds a role to a user.

**Purpose:**
Assigns a specific role to a user in a guild.

**Parameters:**

- `guildId`: string - The ID of the guild where the user and role are located.
- `userId`: string - The ID of the user to add the role to.
- `roleId`: string - The ID of the role to add.
- `reason`: string (optional) - The reason for adding the role (audit log purposes).

**Return Value:**
A `Promise` that resolves when the role is added.

**Examples:**

```typescript
// Example 1: Add role without reason
await discordSdk.addRoleToUser('1234567890', '9876543210', '1122334455');

// Example 2: Add role with reason
await discordSdk.addRoleToUser(
  '1234567890',
  '9876543210',
  '1122334455',
  'Granted moderator status',
);
```