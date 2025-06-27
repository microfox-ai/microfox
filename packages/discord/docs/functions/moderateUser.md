## Function: `moderateUser`

Performs a moderation action on a user.

**Purpose:**
Allows for various moderation actions, including banning, kicking, and timing out users.

**Parameters:**

- `guildId`: string - The ID of the guild where the user is located.
- `userId`: string - The ID of the user to moderate.
- `action`: object<DiscordModerationActionSchema> - The moderation action to perform.
  - `type`: 'ban' | 'kick' | 'timeout' | 'warn' - The type of moderation action.
  - `reason`: string (optional) - The reason for the moderation action.
  - `duration`: number (optional) - The duration of the timeout in milliseconds.
  - `delete_message_days`: number (optional) - The number of days of messages to delete (for bans).

**Return Value:**
A `Promise` that resolves when the moderation action is complete.

**Examples:**

```typescript
// Example 1: Ban a user
await discordSdk.moderateUser('1234567890', '9876543210', {
  type: 'ban',
  reason: 'Spamming',
  delete_message_days: 7,
});

// Example 2: Kick a user
await discordSdk.moderateUser('1234567890', '9876543210', {
  type: 'kick',
  reason: 'Inappropriate behavior',
});

// Example 3: Timeout a user
await discordSdk.moderateUser('1234567890', '9876543210', {
  type: 'timeout',
  duration: 3600000,
  reason: 'Excessive pings',
}); // Timeout for 1 hour
```
