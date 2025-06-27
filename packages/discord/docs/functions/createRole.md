## Function: `createRole`

Creates a new role in the guild.

**Purpose:**
Adds a new role to the specified guild.

**Parameters:**

- `guildId`: string - The ID of the guild to create the role in.
- `data`: object<DiscordRoleSchema> - The role data.
  - `id`: string - The role ID.
  - `name`: string - The role name.
  - `color`: number - The role color.
  - `hoist`: boolean - Whether the role is hoisted.
  - `position`: number - The role position.
  - `permissions`: string - The role permissions.
  - `mentionable`: boolean - Whether the role is mentionable.
  - `managed`: boolean - Whether the role is managed.
  - `description`: string (optional) - The role description.

**Return Value:**
A `Promise` that resolves to the created role object.

**Examples:**

```typescript
await discordSdk.createRole('1234567890', {
  id: '9876543210',
  name: 'Moderator',
  color: 16711680,
  hoist: true,
  position: 2,
  permissions: '2147483647',
  mentionable: true,
  managed: false,
});
```
