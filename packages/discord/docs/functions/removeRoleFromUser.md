## Function: `removeRoleFromUser`

Removes a role from a user.

**Purpose:**
Revokes a specific role from a user in a guild.

**Parameters:**

- `guildId`: string - The ID of the guild where the user and role are located.
- `userId`: string - The ID of the user to remove the role from.
- `roleId`: string - The ID of the role to remove.
- `reason`: string (optional) - The reason for removing the role (audit log purposes).

**Return Value:**
A `Promise` that resolves when the role is removed.

**Examples:**

```typescript
// Example 1: Remove role without reason
await discordSdk.removeRoleFromUser('1234567890', '9876543210', '1122334455');

// Example 2: Remove role with reason
await discordSdk.removeRoleFromUser(
  '1234567890',
  '9876543210',
  '1122334455',
  'Revoked moderator status',
);
```
