## Function: `watchEvents`

Establishes a notification channel to monitor changes to events on a given calendar. When changes occur (e.g., event creation, update, deletion), Google's servers will send a notification to a webhook URL you provide in the `channel` object.

**Purpose:**
To enable real-time or near real-time updates about event changes without continuously polling the API. This is essential for applications that need to stay synchronized with a user's calendar.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar to watch for event changes. Typically 'primary' or a specific calendar ID.
- `channel`: `Channel` (required) - A `Channel` object configuring the notification channel.
  - `Channel`: An object that must include:
    - `id`: `string` - A unique ID you generate for this channel (e.g., a UUID).
    - `type`: `string` - The type of delivery mechanism. Must be `"web_hook"`.
    - `address`: `string` - The HTTPS URL that will receive the push notifications.
    - `params`: `object` (optional) - Additional parameters to send with the notification, e.g., `{ "ttl": "3600" }` for a 1-hour Time To Live for the channel.
    - `token`: `string` (optional) - An arbitrary string that will be included in the `X-Goog-Channel-Token` HTTP header of notifications, useful for validating the source or routing.
- `params`: `object` (optional) - An object containing additional query parameters.
  - `eventTypes`: `array<string>` (optional) - A list of event types to watch for. If not specified, notifications are sent for all event types. Valid values include:
    - `"default"`: Default behavior, includes most common changes.
    - `"focusTime"`: Notifications for focus time events.
    - `"outOfOffice"`: Notifications for out-of-office events.

**Return Value:**
- `Promise<Channel>`: A promise that resolves to a `Channel` object. This object will contain the server-assigned `resourceId` and `expiration` timestamp for the channel, in addition to the properties you provided.
  - `Channel` (response): Includes your input properties plus:
    - `resourceId`: `string` - An opaque identifier for the watched resource.
    - `resourceUri`: `string` - The URI of the watched resource.
    - `expiration`: `string` (timestamp) - The time at which the channel will expire. You'll need to renew it before this time.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Watch events on the primary calendar
async function setupEventNotifications() {
  const channelConfig = {
    id: 'channel-events-primary-' + Date.now(), // Unique ID for the channel
    type: 'web_hook',
    address: 'https://your-webhook-receiver.example.com/notifications',
    token: 'secret-token-for-validation',
    params: { ttl: '86400' } // Optional: Time to live for 24 hours (in seconds)
  };
  try {
    const activeChannel = await sdk.watchEvents('primary', channelConfig);
    console.log('Event watch channel established successfully:');
    console.log('Channel ID:', activeChannel.id);
    console.log('Resource ID:', activeChannel.resourceId);
    console.log('Expires:', new Date(Number(activeChannel.expiration)).toISOString());
    // Store activeChannel.id and activeChannel.resourceId to stop the channel later if needed.
  } catch (error) {
    console.error('Error setting up event watch:', error);
  }
}

// Example 2: Watch specific event types
async function watchSpecificEventTypes() {
  const channelConfig = {
    id: 'channel-focus-ooo-' + Date.now(),
    type: 'web_hook',
    address: 'https://your-webhook-receiver.example.com/specific-events'
  };
  try {
    const activeChannel = await sdk.watchEvents('primary', channelConfig, {
      eventTypes: ['focusTime', 'outOfOffice']
    });
    console.log('Watching for focus time and out-of-office events.');
    console.log('Channel Expiration:', new Date(Number(activeChannel.expiration)).toLocaleString());
  } catch (error) {
    console.error('Error setting up specific event watch:', error);
  }
}

// Remember to handle POST requests to your webhook 'address' URL.
// Notifications will include headers like 'X-Goog-Channel-ID', 'X-Goog-Resource-ID',
// 'X-Goog-Resource-State' (e.g., 'sync', 'exists', 'not_exists'), 'X-Goog-Message-Number'.
// A 'sync' message is sent when the channel is first established.
```