## Function: `getMemberChangeLogs`

Retrieves member change logs.

**Purpose:**

Fetches change logs for the authenticated member.

**Parameters:**

- `startTime` (number, optional): The start timestamp for the change logs (milliseconds since epoch).

**Return Value:**

- `Promise<ChangelogEventSchema[]>`: An array of change log events.
  - `ChangelogEventSchema` (object):
    - `id` (number, required): Unique identifier for the event.
    - `capturedAt` (number, required): Timestamp when the event was captured.
    - `processedAt` (number, required): Timestamp when the event was processed.
    - `configVersion` (number, required): Configuration version.
    - `owner` (string, required): Owner of the resource.
    - `actor` (string, required): Actor who performed the action.
    - `resourceName` (string, required): Name of the resource.
    - `resourceId` (string, required): ID of the resource.
    - `resourceUri` (string, required): URI of the resource.
    - `method` (enum, required): Method used (CREATE, UPDATE, PARTIAL_UPDATE, DELETE).
    - `methodName` (string, optional): Name of the method.
    - `activity` (record<unknown>, required): Activity data.
    - `processedActivity` (record<unknown>, required): Processed activity data.
    - `siblingActivities` (array<record<unknown>>, required): Sibling activities.
    - `parentSiblingActivities` (array<record<unknown>>, required): Parent sibling activities.
    - `activityId` (string, required): ID of the activity.
    - `activityStatus` (enum, required): Status of the activity (SUCCESS, FAILURE, SUCCESSFUL_REPLAY).

**Examples:**

```typescript
// Example: Get member change logs
try {
  const changeLogs = await sdk.getMemberChangeLogs();
  console.log(changeLogs);

  const changeLogsFromTimestamp = await sdk.getMemberChangeLogs(1700332800000);
  console.log(changeLogsFromTimestamp);
} catch (error) {
  console.error('Failed to get change logs:', error);
}
```
