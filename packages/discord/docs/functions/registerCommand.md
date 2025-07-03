## Function: `registerCommand`

Registers a command handler.

**Purpose:**
Registers a function to handle a specific slash command.

**Parameters:**

- `guildId`: string - The ID of the guild to register the command in.
- `command`: object<DiscordCommandHandlerSchema> - The command handler data.
  - `name`: string - The name of the command.
  - `description`: string - The description of the command.
  - `options`: array<DiscordSlashCommandOptionSchema> (optional) - An array of options for the command (same structure as in `registerSlashCommand`).
  - `handler`: function - The function to handle the command interaction.
    - `interaction`: object<DiscordSlashCommandInteractionSchema> - The interaction object.
    - `options`: object - An object containing the values of the command options.
  - `default_member_permissions`: string (optional) - Default permissions required to use the command.
  - `dm_permission`: boolean (optional) - Whether the command can be used in DMs.

**Return Value:**
A `Promise` that resolves when the command is registered.

**Examples:**

```typescript
await discordSdk.registerCommand('1234567890', {
  name: 'test',
  description: 'Test command',
  handler: async (interaction, options) => {
    await discordSdk.respondToInteraction(interaction.token, {
      content: 'Command executed!',
    });
  },
});
```
