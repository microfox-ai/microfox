## Function: `listDrives`

Lists the user's shared drives. This function can retrieve a paginated list of shared drives that the authenticated user has access to. It supports filtering and pagination to manage large sets of drives.

**Purpose:**
To provide a way to enumerate shared drives accessible to the user, allowing applications to display, manage, or interact with these drives.

**Parameters:**
- `pageSize`: `number` (optional)
  - The maximum number of shared drives to return per page. The value must be between 1 and 100, inclusive. If not specified, the server will pick a default page size.
- `pageToken`: `string` (optional)
  - A token to specify the page of results to retrieve. This token is obtained from the `nextPageToken` field of a previous `DrivesListResponse`. If not specified, the first page of results is returned.
- `useDomainAdminAccess`: `boolean` (optional)
  - If set to `true`, this parameter indicates that the request is being made by a domain administrator and that the response should include all shared drives in the domain. This requires appropriate domain administrator privileges. Defaults to `false`.

**Return Value:**
- `Promise<DrivesListResponse>`
  - A promise that resolves to a `DrivesListResponse` object. This object contains:
    - `kind`: `string` - Identifies the type of resource, typically "drive#driveList".
    - `nextPageToken`: `string` (optional) - The page token for the next page of results. This will be absent if the end of the list has been reached.
    - `drives`: `array<object>` - An array of drive resource objects. Each object represents a shared drive and contains details such as:
      - `id`: `string` - The ID of the shared drive.
      - `name`: `string` - The name of the shared drive.
      - `kind`: `string` - Identifies the type of resource, typically "drive#drive".
      - `hidden`: `boolean` (optional) - Whether the shared drive is hidden from this user.
      - `createdTime`: `string` (optional) - The time at which the shared drive was created (RFC 3339 date-time).
      - `themeId`: `string` (optional) - The ID of the theme from which the background image and color hint are selected.
      - `colorRgb`: `string` (optional) - A color hint for the shared drive, represented as an RGB hex string.
      - `backgroundImageFile`: `object` (optional) - A short-lived link to this shared drive's background image.
        - `id`: `string` - The ID of the background image file in Drive.
        - `width`: `number` - The width of the image in pixels.
        - `xCoordinate`: `number` - The X coordinate of the focal point of the background image.
        - `yCoordinate`: `number` - The Y coordinate of the focal point of the background image.
      - `capabilities`: `object` (optional) - The capabilities of the current user on this shared drive.
        - `canAddChildren`: `boolean` - Whether the current user can add children to folders in this shared drive.
        - `canChangeCopyRequiresWriterPermissionRestriction`: `boolean` - Whether the current user can change the `copyRequiresWriterPermission` restriction of this shared drive.
        - `canChangeDomainUsersOnlyRestriction`: `boolean` - Whether the current user can change the `domainUsersOnly` restriction of this shared drive.
        - `canChangeDriveBackground`: `boolean` - Whether the current user can change the background of this shared drive.
        - `canChangeDriveMembersOnlyRestriction`: `boolean` - Whether the current user can change the `driveMembersOnly` restriction of this shared drive.
        - `canComment`: `boolean` - Whether the current user can comment on files in this shared drive.
        - `canCopy`: `boolean` - Whether the current user can copy files in this shared drive.
        - `canDeleteChildren`: `boolean` - Whether the current user can delete children from folders in this shared drive.
        - `canDeleteDrive`: `boolean` - Whether the current user can delete this shared drive.
        - `canDownload`: `boolean` - Whether the current user can download files in this shared drive.
        - `canEdit`: `boolean` - Whether the current user can edit files in this shared drive.
        - `canListChildren`: `boolean` - Whether the current user can list the children of folders in this shared drive.
        - `canManageMembers`: `boolean` - Whether the current user can manage members of this shared drive.
        - `canReadRevisions`: `boolean` - Whether the current user can read the revisions of files in this shared drive.
        - `canRename`: `boolean` - Whether the current user can rename files or folders in this shared drive.
        - `canRenameDrive`: `boolean` - Whether the current user can rename this shared drive.
        - `canShare`: `boolean` - Whether the current user can share files or folders in this shared drive.
        - `canTrashChildren`: `boolean` - Whether the current user can trash children from folders in this shared drive.
      - `restrictions`: `object` (optional) - Restrictions for accessing the shared drive and its content.
        - `copyRequiresWriterPermission`: `boolean` - Whether the current user is prevented from copying files in this shared drive because it's restricted for users with writer access.
        - `domainUsersOnly`: `boolean` - Whether the shared drive is restricted to users within its domain.
        - `driveMembersOnly`: `boolean` - Whether the shared drive is restricted to its members.
        - `adminManagedRestrictions`: `boolean` - Whether administrative restrictions are enforced on this shared drive.
  - It throws an error if the operation fails, for example, due to invalid parameters or insufficient permissions.

**Examples:**
```typescript
// Example 1: List the first page of shared drives with default page size
async function listFirstPageDrives(sdk: GoogleDriveSdk) {
  try {
    const response = await sdk.listDrives();
    console.log('Shared Drives:', response.drives);
    if (response.nextPageToken) {
      console.log('Next page token:', response.nextPageToken);
    }
  } catch (error) {
    console.error('Failed to list drives:', error);
  }
}

// Example 2: List shared drives with a specific page size and page token
async function listDrivesPaginated(sdk: GoogleDriveSdk, pSize: number, pToken: string) {
  try {
    const response = await sdk.listDrives(pSize, pToken);
    console.log(`Shared Drives (Page with token ${pToken}):`, response.drives);
    if (response.nextPageToken) {
      console.log('Next page token for subsequent call:', response.nextPageToken);
    }
  } catch (error) {
    console.error('Failed to list drives with pagination:', error);
  }
}

// Example 3: List all shared drives in the domain (requires domain admin access)
async function listAllDomainDrives(sdk: GoogleDriveSdk) {
  try {
    const response = await sdk.listDrives(undefined, undefined, true);
    console.log('All Domain Shared Drives:', response.drives);
    // Potentially handle pagination if many drives exist
    let nextPageToken = response.nextPageToken;
    while (nextPageToken) {
      const nextPageResponse = await sdk.listDrives(undefined, nextPageToken, true);
      console.log('More Domain Shared Drives:', nextPageResponse.drives);
      nextPageToken = nextPageResponse.nextPageToken;
    }
  } catch (error) {
    console.error('Failed to list all domain drives:', error);
  }
}

// Assuming 'sdk' is an initialized instance of GoogleDriveSdk
// listFirstPageDrives(sdk);
// listDrivesPaginated(sdk, 10, '<nextPageTokenFromPreviousResponse>');
// listAllDomainDrives(sdk); // Ensure the authenticated user is a domain admin
```
