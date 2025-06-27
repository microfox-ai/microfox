## Function: `updateChannel`

Updates a channel's settings.

**Purpose:**
Modifies the properties of an existing channel.

**Parameters:**

- `channelId`: string - The ID of the channel to update.
- `data`: Partial<object<DiscordChannelSchema>> - The updated channel data (same structure as in `createChannel`, but partial).

**Return Value:**
A `Promise` that resolves to the updated channel object.

**Examples:**

```typescript
await discordSdk.updateChannel('1234567890', {
  name: 'new-channel-name',
  nsfw: true,
});
```
