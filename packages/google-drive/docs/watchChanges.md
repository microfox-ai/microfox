## Function: `watchChanges`

Subscribes to push notifications for changes to files and shared drives. Instead of repeatedly polling the `listChanges` endpoint, your application can register a webhook URL to receive notifications whenever a change occurs. This is a more efficient way to monitor changes.

**Purpose:**
To enable real-time or near real-time updates about changes in a user's Google Drive by setting up a notification channel. This avoids the overhead and latency of frequent polling.

**Parameters:**
- `pageToken`: `string` (required)
  - The token for the page of changes to start watching from. This should be a `startPageToken` from `getStartPageToken` or a `newStartPageToken` from a previous `listChanges` response. Notifications will be sent for changes occurring after this token.
- `channel`: `object` (required)
  - An object defining the notification channel configuration:
    - `id`: `string` (required) - A unique identifier for the channel, chosen by your application (e.g., a UUID). This ID will be included in notification messages.
    - `type`: `string` (required) - The type of delivery mechanism. Must be set to "web_hook".
    - `address`: `string` (required) - The HTTPS URL that will receive the push notifications. This URL must be registered and verified in your Google Cloud Console project.
    - `expiration`: `string` (optional) - A Unix timestamp (in milliseconds) or an RFC 3339 date-time string indicating when the channel should expire. If not provided, the channel might have a default lifespan set by Google (e.g., a few hours or days).
    - `params`: `Record<string, string>` (optional) - Additional parameters to send with the push notification. For example, you could include a secret token to verify the notification's origin.
- `driveId`: `string` (optional)
  - The ID of the shared drive for which changes should be watched. If specified, `supportsAllDrives` must be `true`.
- `includeItemsFromAllDrives`: `boolean` (optional)
  - Whether to include changes from all drives (My Drive and shared drives) that the user has access to. If `true`, `supportsAllDrives` must also be `true`.
- `includeTeamDriveItems`: `boolean` (optional)
  - Deprecated: Use `includeItemsFromAllDrives` instead.
- `pageSize`: `number` (optional)
  - The maximum number of changes to include in the initial response (not the push notifications themselves). The value must be between 1 and 1000. This is often less critical for `watchChanges` as the primary goal is the notification channel.
- `spaces`: `string` (optional)
  - A comma-separated list of spaces to query. Supported values are 'drive', 'appDataFolder' and 'photos'. (Default: 'drive').
- `supportsAllDrives`: `boolean` (optional)
  - Whether the requesting application supports both My Drives and shared drives.
- `teamDriveId`: `string` (optional)
  - Deprecated: Use `driveId` instead.

**Return Value:**
- `Promise<ChannelResponse>`
  - A promise that resolves to a `ChannelResponse` object, confirming the channel setup. This object contains:
    - `kind`: `string` - Identifies the type of resource, typically "api#channel".
    - `id`: `string` - The unique ID of the channel that was created (same as the one provided in the request).
    - `resourceId`: `string` - An opaque ID that identifies the resource being watched.
    - `resourceUri`: `string` - A version-specific URI identifying the resource being watched.
    - `expiration`: `string` (optional) - The expiration time for the channel, if set, as a Unix timestamp in milliseconds.
  - It throws an error if the operation fails, for example, due to an invalid `pageToken`, an inaccessible or unverified `address`, or other configuration issues.

**Important Notes on Push Notifications:**
- Your `address` URL must be an HTTPS endpoint.
- Google will send a `sync` message to your `address` URL upon successful channel creation to verify the endpoint.
- Subsequent notifications will be POST requests to your `address` URL. The request headers will contain metadata like `X-Goog-Channel-ID`, `X-Goog-Resource-ID`, `X-Goog-Resource-State` (e.g., "change"), etc.
- The request body will typically be empty for change notifications; you should use the metadata to know that a change occurred and then call `listChanges` with your stored `pageToken` to get the actual changes.
- Channels have an expiration time. You need to renew them before they expire by calling `watchChanges` again.
- To stop receiving notifications, you can use the `Channels.stop` method (not directly exposed by this SDK snippet, but available in the underlying Google Drive API).

**Examples:**
```typescript
// Example 1: Watch for all changes and set up a notification channel
async function watchAllDriveChanges(sdk: GoogleDriveSdk, startToken: string, channelId: string, notificationUrl: string) {
  try {
    const channelConfig = {
      id: channelId, // A unique ID for your channel
      type: 'web_hook' as 'web_hook', // Type assertion for string literal type
      address: notificationUrl, // Your HTTPS webhook URL
      // expiration: (Date.now() + 6 * 60 * 60 * 1000).toString(), // Optional: 6 hours from now
    };

    const response = await sdk.watchChanges(
      startToken,
      channelConfig,
      undefined, // driveId
      true,      // includeItemsFromAllDrives
      undefined, // includeTeamDriveItems
      100,       // pageSize (for initial response, not critical for watch)
      undefined, // spaces
      true       // supportsAllDrives
    );

    console.log('Successfully set up watch channel:', response);
    console.log(`Channel ID: ${response.id}, Resource ID: ${response.resourceId}`);
    if (response.expiration) {
      console.log(`Channel expires at: ${new Date(parseInt(response.expiration, 10))}`);
    }
    // Store channel details and the pageToken used, to renew or stop the channel later
    // Your application at notificationUrl should now expect a POST request from Google to verify.
    return response;
  } catch (error) {
    console.error('Failed to set up watch channel:', error);
    // Handle errors, e.g., invalid notificationUrl, token issues
    return null;
  }
}

// Example 2: Watch changes for a specific shared drive
async function watchSpecificDriveChanges(
  sdk: GoogleDriveSdk,
  driveStartToken: string,
  sharedDriveId: string,
  channelId: string,
  notificationUrl: string
) {
  try {
    const channelConfig = {
      id: channelId,
      type: 'web_hook' as 'web_hook',
      address: notificationUrl,
    };

    const response = await sdk.watchChanges(
      driveStartToken,
      channelConfig,
      sharedDriveId,
      undefined, // includeItemsFromAllDrives (false by implication of specific driveId)
      undefined, // includeTeamDriveItems
      undefined, // pageSize
      undefined, // spaces
      true       // supportsAllDrives (required if driveId is set)
    );

    console.log(`Watch channel for Drive ${sharedDriveId} set up:`, response);
    return response;
  } catch (error) {
    console.error(`Failed to watch changes for drive ${sharedDriveId}:`, error);
    return null;
  }
}

// Assuming 'sdk' is an initialized instance of GoogleDriveSdk,
// 'aValidStartPageToken' is from getStartPageToken(),
// 'uniqueChannelId' is a UUID generated by your app,
// and 'https://your-app.com/google-drive-notifications' is your verified webhook URL.

// watchAllDriveChanges(sdk, '<aValidStartPageToken>', '<uniqueChannelId>', '<https://your-app.com/notifications>');
// watchSpecificDriveChanges(sdk, '<driveSpecificStartToken>', '<sharedDriveId>', '<anotherUniqueChannelId>', '<https://your-app.com/notifications>');

```
