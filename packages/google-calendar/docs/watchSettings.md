## Function: `watchSettings`

Establishes a notification channel to monitor changes to the user's Google Calendar settings. When settings are modified, Google's servers will send a notification to a webhook URL you provide in the `channel` object.

**Purpose:**
To enable real-time or near real-time updates about changes to user settings without continuously polling the API. This can be useful for applications that need to adapt their behavior based on user preferences stored in calendar settings.

**Parameters:**
- `channel`: `Channel` (required) - A `Channel` object configuring the notification channel.
  - `Channel`: An object that must include:
    - `id`: `string` - A unique ID you generate for this channel (e.g., a UUID).
    - `type`: `string` - The type of delivery mechanism. Must be `"web_hook"`.
    - `address`: `string` - The HTTPS URL that will receive the push notifications.
    - `params`: `object` (optional) - Additional parameters to send with the notification, e.g., `{ "ttl": "3600" }` for a 1-hour Time To Live for the channel.
    - `token`: `string` (optional) - An arbitrary string that will be included in the `X-Goog-Channel-Token` HTTP header of notifications, useful for validating the source or routing.

**Return Value:**
- `Promise<Channel>`: A promise that resolves to a `Channel` object. This object will contain the server-assigned `resourceId` and `expiration` timestamp for the channel, in addition to the properties you provided.
  - `Channel` (response): Includes your input properties plus:
    - `resourceId`: `string` - An opaque identifier for the watched resource (user settings).
    - `resourceUri`: `string` - The URI of the watched resource.
    - `expiration`: `string` (timestamp) - The time at which the channel will expire. You'll need to renew it before this time.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Watch user settings for changes
async function setupSettingsNotifications() {
  const channelConfig = {
    id: 'channel-settings-user-' + Date.now(), // Unique ID for the channel
    type: 'web_hook',
    address: 'https://your-webhook-receiver.example.com/settings-notifications',
    token: 'secure-settings-token',
    params: { ttl: '604800' } // Optional: Time to live for 7 days (in seconds)
  };
  try {
    const activeChannel = await sdk.watchSettings(channelConfig);
    console.log('User settings watch channel established successfully:');
    console.log('Channel ID:', activeChannel.id);
    console.log('Resource ID:', activeChannel.resourceId);
    console.log('Expires:', new Date(Number(activeChannel.expiration)).toISOString());
    // Store activeChannel.id and activeChannel.resourceId to stop the channel later if needed.
  } catch (error) {
    console.error('Error setting up settings watch:', error);
  }
}

// Remember to handle POST requests to your webhook 'address' URL.
// Notifications will indicate that settings have changed, prompting a re-fetch if necessary.
// A 'sync' message is sent when the channel is first established.
```