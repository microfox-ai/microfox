## Function: `createChannel`

Creates a new channel in the guild.

**Purpose:**
Adds a new channel to the specified guild.

**Parameters:**

- `guildId`: string - The ID of the guild to create the channel in.
- `data`: object<DiscordChannelSchema> - The channel data.
  - `id`: string - The channel ID.
  - `type`: number - The channel type (refer to Discord API documentation for channel types).
  - `name`: string - The channel name.
  - `topic`: string (optional) - The channel topic.
  - `nsfw`: boolean (optional) - Whether the channel is NSFW.
  - `parent_id`: string (optional) - The ID of the parent category.
  - `permission_overwrites`: array<DiscordPermissionOverwriteSchema> (optional) - Permission overwrites for the channel.
    - `id`: string - The role or user ID.
    - `type`: number - The type (0 for role, 1 for user).
    - `allow`: string (optional) - Allowed permissions.
    - `deny`: string (optional) - Denied permissions.
  - `rate_limit_per_user`: number (optional) - Slowmode rate limit.
  - `position`: number (optional) - Channel position.

**Return Value:**
A `Promise` that resolves to the created channel object.

**Examples:**

```typescript
await discordSdk.createChannel('1234567890', {
  id: '9876543210',
  type: 0, // TEXT
  name: 'general',
});
```
