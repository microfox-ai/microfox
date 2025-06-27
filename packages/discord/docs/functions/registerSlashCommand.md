## Function: `registerSlashCommand`

Registers a slash command for the bot.

**Purpose:**
Creates a new slash command that can be used in a specific guild.

**Parameters:**

- `guildId`: string - The ID of the guild to register the command in.
- `command`: object<DiscordSlashCommandSchema> - An object defining the command's properties.
  - `name`: string - The name of the command.
  - `description`: string - The description of the command.
  - `options`: array<DiscordSlashCommandOptionSchema> (optional) - An array of options for the command.
    - `name`: string - The name of the option.
    - `description`: string - The description of the option.
    - `type`: number - The type of the option (refer to Discord API documentation for option types).
    - `required`: boolean (optional) - Whether the option is required.
    - `choices`: array<object> (optional) - An array of choices for the option.
      - `name`: string - The name of the choice.
      - `value`: string | number - The value of the choice.
    - `options`: array<DiscordSlashCommandOptionSchema> (optional) - Sub-options for subcommands.
  - `default_member_permissions`: string (optional) - Default permissions required to use the command.
  - `dm_permission`: boolean (optional) - Whether the command can be used in DMs.

**Return Value:**
A `Promise` that resolves to the registered command object.

**Examples:**

```typescript
await discordSdk.registerSlashCommand('1234567890', {
  name: 'ping',
  description: 'Replies with pong!',
});

await discordSdk.registerSlashCommand('1234567890', {
  name: 'greet',
  description: 'Greets a user',
  options: [
    {
      name: 'user',
      description: 'The user to greet',
      type: 6, // USER
      required: true,
    },
  ],
});
```
