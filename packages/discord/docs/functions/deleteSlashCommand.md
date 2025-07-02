## Function: `deleteSlashCommand`

Deletes a slash command.

**Purpose:**
Removes a previously registered slash command from a specific guild.

**Parameters:**

- `guildId`: string - The ID of the guild where the command is registered.
- `commandId`: string - The ID of the command to delete.

**Return Value:**
A `Promise` that resolves when the command is deleted.

**Examples:**

```typescript
await discordSdk.deleteSlashCommand('1234567890', '9876543210');
```
