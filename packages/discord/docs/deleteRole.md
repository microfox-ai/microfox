## Function: `deleteRole`

Deletes a role.

**Purpose:**
Removes a role from the guild.

**Parameters:**

- `guildId`: string - The ID of the guild containing the role.
- `roleId`: string - The ID of the role to delete.

**Return Value:**
A `Promise` that resolves when the role is deleted.

**Examples:**

```typescript
await discordSdk.deleteRole('1234567890', '9876543210');
```
