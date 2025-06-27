## Function: `deleteGlobalSlashCommand`

Deletes a global slash command.

**Purpose:**
Removes a previously registered global slash command.

**Parameters:**

- `commandId`: string - The ID of the command to delete.

**Return Value:**
A `Promise` that resolves when the command is deleted.

**Examples:**

```typescript
await discordSdk.deleteGlobalSlashCommand('9876543210');
```
