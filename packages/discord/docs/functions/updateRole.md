## Function: `updateRole`

Updates a role's settings.

**Purpose:**
Modifies the properties of an existing role.

**Parameters:**

- `guildId`: string - The ID of the guild containing the role.
- `roleId`: string - The ID of the role to update.
- `data`: Partial<object<DiscordRoleSchema>> - The updated role data (same structure as in `createRole`, but partial).

**Return Value:**
A `Promise` that resolves to the updated role object.

**Examples:**

```typescript
await discordSdk.updateRole('1234567890', '9876543210', {
  name: 'New Role Name',
  color: 65280,
});
```
