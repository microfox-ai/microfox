# Microfox Discord SDK

A lightweight, type-safe SDK for interacting with the Discord API v10

## Installation

```bash
npm install @microfox/discord
```

## Environment Variables

The following environment variables are used by this SDK:

- `DISCORD_BOT_TOKEN`: The Discord bot token is required to authenticate with the Discord API. You can obtain this token by creating a bot application on the Discord Developer Portal. (Required)

## Additional Information

Use the `createDiscordSdk` constructor to create a new Discord client.

The SDK supports Discord API v10 with comprehensive type safety.

Supports both guild-specific and global slash commands.

Includes full moderation, channel, and role management capabilities.

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [createDiscordSdk](./docs/createDiscordSdk.md)
- [sendMessage](./docs/sendMessage.md)
- [editMessage](./docs/editMessage.md)
- [deleteMessage](./docs/deleteMessage.md)
- [fetchMessages](./docs/fetchMessages.md)
- [reactToMessage](./docs/reactToMessage.md)
- [createThread](./docs/createThread.md)
- [fetchGuildInfo](./docs/fetchGuildInfo.md)
- [fetchUserInfo](./docs/fetchUserInfo.md)
- [registerSlashCommand](./docs/registerSlashCommand.md)
- [registerGlobalSlashCommand](./docs/registerGlobalSlashCommand.md)
- [deleteSlashCommand](./docs/deleteSlashCommand.md)
- [deleteGlobalSlashCommand](./docs/deleteGlobalSlashCommand.md)
- [moderateUser](./docs/moderateUser.md)
- [createChannel](./docs/createChannel.md)
- [updateChannel](./docs/updateChannel.md)
- [deleteChannel](./docs/deleteChannel.md)
- [createRole](./docs/createRole.md)
- [updateRole](./docs/updateRole.md)
- [deleteRole](./docs/deleteRole.md)
- [addRoleToUser](./docs/addRoleToUser.md)
- [removeRoleFromUser](./docs/removeRoleFromUser.md)
- [fetchChannels](./docs/fetchChannels.md)
- [fetchRoles](./docs/fetchRoles.md)
- [fetchSlashCommands](./docs/fetchSlashCommands.md)
- [fetchGlobalSlashCommands](./docs/fetchGlobalSlashCommands.md)
- [registerCommand](./docs/registerCommand.md)
- [registerGlobalCommand](./docs/registerGlobalCommand.md)
- [handleInteraction](./docs/handleInteraction.md)
- [respondToInteraction](./docs/respondToInteraction.md)
- [deferInteraction](./docs/deferInteraction.md)
- [followUpInteraction](./docs/followUpInteraction.md)
