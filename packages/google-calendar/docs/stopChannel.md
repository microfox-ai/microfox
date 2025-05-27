## Function: `stopChannel`

Stops a previously established notification channel, ceasing the delivery of notifications for the watched resource.

**Purpose:**
To explicitly close a notification channel when it is no longer needed, preventing further notifications from being sent to the specified address. This is important for resource management and to avoid unnecessary traffic.

**Parameters:**
- `channel` (object, required): A `Channel` object that identifies the channel to be stopped. This object must contain the `id` and `resourceId` that were returned when the channel was created (e.g., by `watchAcl`, `watchCalendarList`, `watchEvents`, or `watchSettings`).
  - `Channel` (object):
    - `id` (string, required): The identifier of the channel to stop. This was provided by your application when the channel was created.
    - `resourceId` (string, required): The identifier of the resource being watched. This was returned by the server when the channel was created.
    - Other fields like `type`, `address`, `token`, `params`, `expiration`, `resourceUri` are not strictly required by the API for stopping the channel but might be present in the `Channel` object you stored.

**Return Value:**
- A `Promise` that resolves to `void` upon successful stopping of the channel.
- Throws an error if the channel cannot be stopped (e.g., if the `id` or `resourceId` is incorrect, or the channel has already expired or been stopped).

**Examples:**
```typescript
// Assume 'createdChannel' is an object stored after a successful call to a 'watch' method
// const createdChannel: Channel = {
//   id: "channel-id-12345", // The ID you used to create the channel
//   type: "web_hook",
//   address: "https://example.com/notifications",
//   resourceId: "server-generated-resource-id", // Returned by the server on watch creation
//   expiration: "1678886400000"
// };

// Example 1: Stop a notification channel
async function stopNotification(channelToStop: { id: string; resourceId: string }) {
  try {
    await sdk.stopChannel(channelToStop as Channel); // Cast to Channel, ensuring required fields are present
    console.log(`Notification channel with ID "${channelToStop.id}" and resource ID "${channelToStop.resourceId}" stopped successfully.`);
  } catch (error) {
    console.error("Error stopping notification channel:", error);
    // Handle errors, e.g., channel not found
  }
}

// To run this example, you would first need to create a channel and get its id and resourceId.
// For instance, if you had `createdChannel` from a watch operation:
// stopNotification({ id: createdChannel.id, resourceId: createdChannel.resourceId });

// Example 2: Attempting to stop a channel with invalid details (will likely fail)
async function stopNonExistentChannel() {
  const invalidChannelDetails = {
    id: "non-existent-channel-id",
    resourceId: "non-existent-resource-id"
  };
  try {
    await sdk.stopChannel(invalidChannelDetails as Channel);
    console.log("Channel stopped successfully."); // This line will likely not be reached
  } catch (error) {
    console.error("Error stopping non-existent channel:", error);
    // Expected error: API request failed: Channel not found or invalid.
  }
}
// stopNonExistentChannel();
```