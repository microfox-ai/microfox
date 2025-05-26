## Function: `getStartPageToken`

Retrieves the starting page token for listing changes to files and shared drives. This token represents a point in time from which changes can be tracked. It is essential for initiating the change tracking process with the `listChanges` function.

**Purpose:**
To obtain an initial token that marks the beginning of the change log. This token is then used to fetch subsequent changes, ensuring that no changes are missed and that change polling is efficient.

**Parameters:**
- `driveId`: `string` (optional)
  - If specified, the function returns a start page token for changes within the specified shared drive. If omitted, the token is for changes in all files and shared drives accessible to the user (corpora).
- `supportsAllDrives`: `boolean` (optional)
  - Whether the requesting application supports both My Drives and shared drives. If `false` (default), the response will not include changes from shared drives. If `true`, changes from shared drives are included if the user is a member of one.

**Return Value:**
- `Promise<StartPageTokenResponse>`
  - A promise that resolves to a `StartPageTokenResponse` object. This object contains:
    - `kind`: `string` - Identifies the type of resource, typically "drive#startPageToken".
    - `startPageToken`: `string` - The token to be used as the `pageToken` in the first call to `listChanges`.
  - It throws an error if the operation fails, for example, due to invalid parameters or server issues.

**Examples:**
```typescript
// Example 1: Get start page token for all changes (My Drive and supported Shared Drives)
async function getGlobalStartToken(sdk: GoogleDriveSdk) {
  try {
    const response = await sdk.getStartPageToken(undefined, true);
    console.log('Global Start Page Token:', response.startPageToken);
    // Store this token to use with listChanges
    return response.startPageToken;
  } catch (error) {
    console.error('Failed to get global start page token:', error);
    return null;
  }
}

// Example 2: Get start page token for a specific shared drive
async function getDriveSpecificStartToken(sdk: GoogleDriveSdk, sharedDriveId: string) {
  try {
    const response = await sdk.getStartPageToken(sharedDriveId, true);
    console.log(`Start Page Token for Drive ${sharedDriveId}:`, response.startPageToken);
    // Store this token to use with listChanges for this specific drive
    return response.startPageToken;
  } catch (error) {
    console.error(`Failed to get start page token for drive ${sharedDriveId}:`, error);
    return null;
  }
}

// Assuming 'sdk' is an initialized instance of GoogleDriveSdk
// getGlobalStartToken(sdk).then(token => {
//   if (token) {
//     // Use token with listChanges
//   }
// });

// getDriveSpecificStartToken(sdk, '<sharedDriveId>').then(token => {
//   if (token) {
//     // Use token with listChanges, providing the same driveId
//   }
// });
```
