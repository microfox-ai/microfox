## Function: `watchCalendarList`

Establishes a notification channel to watch for changes to the user's calendar list. When changes occur (e.g., a calendar is added, removed, or updated), a notification will be sent to the specified address.

**Purpose:**
To enable applications to receive real-time notifications about modifications to the user's calendar list, eliminating the need for frequent polling.

**Parameters:**
- `channel` (object, required): A `Channel` object that specifies the configuration for the notification channel.
  - `Channel` (object): 
    - `id` (string, required): A unique string that identifies this channel. UUIDs are recommended.
    - `type` (string, required): The type of delivery mechanism used for this channel. Must be `"web_hook"`.
    - `address` (string, required): The address where notifications are delivered for this channel (e.g., a URL).
    - `params` (optional object): Additional parameters controlling delivery channel behavior.
      - `ttl` (string, optional): Time To Live for the channel, in seconds. If not specified, a default TTL will be used.
    - `resourceId` (string, optional): An opaque ID that identifies the resource being watched on this channel. Stable across different API versions.
    - `resourceUri` (string, optional): A version-specific identifier for the watched resource.
    - `token` (string, optional): An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.
    - `expiration` (string, optional): Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.

**Return Value:**
- A `Promise` that resolves to a `Channel` object representing the created notification channel.
- `Channel` (object): The `Channel` object, which includes the `resourceId` and `expiration` time for the created watch. The structure is the same as the input `channel` parameter, but with server-assigned values for fields like `resourceId` and `expiration`.

**Examples:**
```typescript
// Example 1: Watch calendar list with minimal channel configuration
const watchConfig: Channel = {
  id: 'channel-id-12345',
  type: 'web_hook',
  address: 'https://example.com/notifications'
};

async function setupWatch() {
  try {
    const createdChannel = await sdk.watchCalendarList(watchConfig);
    console.log('Notification channel created:', createdChannel);
    // Store createdChannel.resourceId and createdChannel.id to stop the channel later
  } catch (error) {
    console.error('Error setting up watch:', error);
  }
}
setupWatch();

// Example 2: Watch calendar list with a custom token and TTL
const advancedWatchConfig: Channel = {
  id: 'advanced-channel-abcde',
  type: 'web_hook',
  address: 'https://myapplication.com/google-calendar-updates',
  token: 'secret-token-for-validation',
  params: {
    ttl: '3600' // TTL of 1 hour (3600 seconds)
  }
};

async function setupAdvancedWatch() {
  try {
    const createdChannel = await sdk.watchCalendarList(advancedWatchConfig);
    console.log('Advanced notification channel created:', createdChannel);
  } catch (error) {
    console.error('Error setting up advanced watch:', error);
  }
}
setupAdvancedWatch();
```