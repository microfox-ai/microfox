## Function: `watchAcl`

Establishes a watch on the Access Control List (ACL) of a specified calendar. This allows your application to receive notifications whenever there are changes to the calendar's ACL rules.

**Purpose:**
To subscribe to real-time notifications for modifications (additions, deletions, updates) to the ACL of a calendar, enabling reactive updates in an application.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar on which to watch ACL changes. This is typically the email address of the calendar or the calendar's unique ID.
- `channel`: `Channel` (required) - A `Channel` object specifying the configuration for the notification channel. This includes the delivery mechanism (e.g., webhook URL) and any custom client tokens.
  The `Channel` object structure:
  ```typescript
  interface Channel {
    id: string; // A unique string that identifies this channel. 
               // This is provided by your application and echoed back by the API.
    type: string; // The type of delivery mechanism used for this channel. 
                 // For Google Calendar API, this is typically "web_hook".
    address: string; // The address where notifications are delivered for this channel (e.g., a webhook URL).
    token?: string; // An arbitrary string delivered to the target address with each notification delivered over this channel. Optional.
    params?: { [key: string]: string }; // Additional parameters controlling delivery channel behavior. Optional.
    resourceId?: string; // An opaque ID that identifies the resource being watched. Server-generated.
    resourceUri?: string; // A version-specific URI identifying the resource being watched. Server-generated.
    expiration?: string; // Date and time of notification channel expiration, expressed as a Unix timestamp, in milliseconds. Optional.
  }
  ```
  For `watchAcl`, you primarily need to provide `id`, `type`, and `address`. `token` is optional.

**Return Value:**
`Promise<Channel>` - A promise that resolves to a `Channel` object representing the established notification channel. This object will include server-generated information like `resourceId`, `resourceUri`, and `expiration` time for the watch.
An error is thrown if the operation fails, for example, due to an invalid channel configuration, insufficient permissions, or if the calendar does not exist.

**Examples:**
```typescript
// Example 1: Watch ACL changes for the primary calendar with a webhook
async function watchPrimaryCalendarAcl() {
  const channelConfig: Channel = {
    id: "my-unique-acl-watch-channel-id-123", // Must be unique
    type: "web_hook",
    address: "https://myapplication.com/notifications/google-calendar-acl",
    token: "clientTokenForVerification", // Optional: for verifying notifications
  };
  try {
    const establishedChannel = await calendarSdk.watchAcl("primary", channelConfig);
    console.log("ACL watch established successfully:", establishedChannel);
    console.log(`Channel ID: ${establishedChannel.id}`);
    console.log(`Resource ID: ${establishedChannel.resourceId}`);
    console.log(`Expiration: ${new Date(Number(establishedChannel.expiration))}`);
  } catch (error) {
    console.error("Failed to establish ACL watch:", error);
  }
}

// Example 2: Watch ACL for a specific calendar without a client token
async function watchSpecificCalendarAcl() {
  const calendarId = "my.custom.calendar@group.calendar.google.com";
  const channelConfig: Channel = {
    id: "custom-calendar-acl-watch-456",
    type: "web_hook",
    address: "https://my.webhook.handler/acl-updates",
  };
  try {
    const establishedChannel = await calendarSdk.watchAcl(calendarId, channelConfig);
    console.log(`ACL watch for calendar ${calendarId} established:`, establishedChannel);
  } catch (error) {
    console.error(`Failed to watch ACL for calendar ${calendarId}:`, error);
  }
}
```

**Note on Webhooks:**
When using `type: "web_hook"`, your `address` URL must be an HTTPS endpoint. Google Calendar API will send a `POST` request to this URL to verify ownership and subsequently to deliver notifications. Your application needs to handle these requests appropriately. The `token` can be used to verify that incoming notifications are genuinely from Google.