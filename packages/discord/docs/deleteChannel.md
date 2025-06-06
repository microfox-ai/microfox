## Function: `deleteChannel`

Deletes a channel.

**Purpose:**
Removes a channel from the guild.

**Parameters:**

- `channelId`: string - The ID of the channel to delete.

**Return Value:**
A `Promise` that resolves when the channel is deleted.

**Examples:**

```typescript
await discordSdk.deleteChannel('1234567890');
```
