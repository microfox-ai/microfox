## Function: `listChanges`

Lists changes to files and shared drives for a user. Changes include creations, deletions, metadata modifications, and permission updates. This function requires a `pageToken` obtained from `getStartPageToken` or a previous `listChanges` call to track changes incrementally.

**Purpose:**
To allow applications to stay synchronized with the state of a user's Google Drive by polling for changes since the last known state (represented by the `pageToken`).

**Parameters:**
- `pageToken`: `string` (required)
  - The token for the page of changes to retrieve. This should be the `startPageToken` from `getStartPageToken` for the initial call, or the `nextPageToken` or `newStartPageToken` from a previous `listChanges` response for subsequent calls.
- `driveId`: `string` (optional)
  - The ID of the shared drive from which changes should be listed. If specified, `supportsAllDrives` must be `true`, and `includeItemsFromAllDrives` must be `false`.
- `includeItemsFromAllDrives`: `boolean` (optional)
  - Whether to include changes from all drives (My Drive and shared drives) that the user has access to. If `true`, `supportsAllDrives` must also be `true`. If `false` (default) and `driveId` is not set, only changes from the user's My Drive are returned.
- `includeTeamDriveItems`: `boolean` (optional)
  - Deprecated: Use `includeItemsFromAllDrives` instead. Whether to include changes from Team Drives (now known as shared drives). If `true`, `supportsTeamDrives` (now `supportsAllDrives`) must also be `true`.
- `pageSize`: `number` (optional)
  - The maximum number of changes to return per page. The value must be between 1 and 1000, inclusive. If not specified, the server will pick a default page size.
- `spaces`: `string` (optional)
  - A comma-separated list of spaces to query. Supported values are 'drive', 'appDataFolder' and 'photos'. (Default: 'drive').
- `supportsAllDrives`: `boolean` (optional)
  - Whether the requesting application supports both My Drives and shared drives. If `false` (default), the response will not include changes from shared drives.
- `teamDriveId`: `string` (optional)
  - Deprecated: Use `driveId` instead. The ID of the Team Drive from which changes should be listed.

**Return Value:**
- `Promise<ChangesListResponse>`
  - A promise that resolves to a `ChangesListResponse` object. This object contains:
    - `kind`: `string` - Identifies the type of resource, typically "drive#changeList".
    - `nextPageToken`: `string` (optional) - The page token for the next page of changes. This will be absent if the end of the current change log has been reached. Store and use this token in a subsequent call to `listChanges` to retrieve the next page of changes.
    - `newStartPageToken`: `string` (optional) - The new start page token for the current set of changes. This token should be stored and used as the `pageToken` for the next `listChanges` call if `nextPageToken` is not present, indicating that the end of the current change log has been reached and a new starting point for future polling is available. This is particularly relevant when the change log has been truncated.
    - `changes`: `array<object>` - An array of change resource objects. Each object represents a change and contains:
      - `kind`: `string` - Identifies the type of resource, typically "drive#change".
      - `type`: `string` - The type of change. Possible values are "file" or "drive".
      - `time`: `string` - The time of this change (RFC 3339 date-time).
      - `removed`: `boolean` - Whether the file or shared drive has been removed from this collection of changes, for example, if the item has been deleted or the user has lost access.
      - `fileId`: `string` (optional) - The ID of the file that changed. Present if `type` is "file".
      - `file`: `object` (optional) - The updated metadata for the file. Present if `type` is "file" and the file has not been removed. The structure of this object is similar to a File resource (e.g., `id`, `name`, `mimeType`, `parents`, etc.).
      - `driveId`: `string` (optional) - The ID of the shared drive that changed. Present if `type` is "drive".
      - `drive`: `object` (optional) - The updated metadata for the shared drive. Present if `type` is "drive" and the drive has not been removed. The structure of this object is similar to a Drive resource (e.g., `id`, `name`, `themeId`, etc.).
  - It throws an error if the operation fails, for example, due to an invalid `pageToken` or other parameter issues.

**Examples:**
```typescript
// Example 1: List initial batch of changes using a startPageToken
async function listInitialChanges(sdk: GoogleDriveSdk, startToken: string) {
  try {
    const response = await sdk.listChanges(startToken, undefined, true, undefined, 100, undefined, true);
    console.log('Initial Changes:', response.changes);
    if (response.nextPageToken) {
      console.log('Next page token for more changes:', response.nextPageToken);
      // Store response.nextPageToken to fetch next page
    } else if (response.newStartPageToken) {
      console.log('New start page token for future polling:', response.newStartPageToken);
      // Store response.newStartPageToken for the next polling cycle
    }
    return response;
  } catch (error) {
    console.error('Failed to list initial changes:', error);
    return null;
  }
}

// Example 2: List changes for a specific shared drive
async function listDriveChanges(sdk: GoogleDriveSdk, driveStartToken: string, sharedDriveId: string) {
  try {
    const response = await sdk.listChanges(driveStartToken, sharedDriveId, undefined, undefined, 50, undefined, true);
    console.log(`Changes for Drive ${sharedDriveId}:`, response.changes);
    // Handle nextPageToken and newStartPageToken as in Example 1
    return response;
  } catch (error) {
    console.error(`Failed to list changes for drive ${sharedDriveId}:`, error);
    return null;
  }
}

// Assuming 'sdk' is an initialized instance of GoogleDriveSdk
// and 'aValidStartPageToken' is obtained from getStartPageToken()

// listInitialChanges(sdk, '<aValidStartPageToken>').then(response => {
//   if (response && response.nextPageToken) {
//     // sdk.listChanges(response.nextPageToken, ...)
//   } else if (response && response.newStartPageToken) {
//     // Store response.newStartPageToken for next full poll
//   }
// });

// listDriveChanges(sdk, '<driveSpecificStartToken>', '<sharedDriveId>');
```
