## Function: `updateDrive`

Updates the metadata of an existing shared drive. This can include changing its name, theme, or other modifiable properties. Only the fields provided in the `updates` object will be modified.

**Purpose:**
To allow modification of shared drive properties, such as renaming a drive or changing its visual theme.

**Parameters:**
- `driveId`: `string` (required)
  - The unique identifier (ID) of the shared drive that needs to be updated.
- `updates`: `Partial<DriveUpdateRequest>` (required)
  - An object containing the fields to update. Only the properties present in this object will be attempted to be updated. The `DriveUpdateRequest` type defines the possible fields that can be updated:
    - `name`: `string` (optional) - The new name for the shared drive.
    - `themeId`: `string` (optional) - The ID of the theme to apply to the shared drive. A list of available theme IDs can be found in the Google Drive API documentation.
    - `backgroundImageFile`: `object` (optional) - An object to update the background image of the shared drive. 
        - `id`: `string` (optional) - The ID of an image file in Google Drive to use as the background.
        - `width`: `number` (optional) - The width of the image in pixels. (Note: The API might not directly support setting width, this is usually derived from the image itself).
        - `xCoordinate`: `number` (optional) - The X coordinate of the focal point of the background image.
        - `yCoordinate`: `number` (optional) - The Y coordinate of the focal point of the background image.
    - `colorRgb`: `string` (optional) - A new color hint for the shared drive, represented as an RGB hex string (e.g., "#FF0000" for red).
    - `restrictions`: `object` (optional) - New restrictions to apply to the shared drive.
        - `copyRequiresWriterPermission`: `boolean` (optional) - When `true`, only users with writer permission can copy files. When `false`, users with commenter or viewer permission can also copy files.
        - `domainUsersOnly`: `boolean` (optional) - When `true`, only users in the same domain as the shared drive can be added as members. When `false`, external users can be added.
        - `driveMembersOnly`: `boolean` (optional) - When `true`, only members of the shared drive can access content. When `false`, content can be shared more broadly, depending on file-level permissions.
        - `adminManagedRestrictions`: `boolean` (optional) - Whether administrative restrictions are enforced on this shared drive. This is typically read-only and managed by domain administrators.

**Return Value:**
- `Promise<DriveResponse>`
  - A promise that resolves to a `DriveResponse` object representing the updated shared drive. This object includes:
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
    - `capabilities`: `object` (optional) - The capabilities of the current user on this shared drive (see `listDrives` for structure).
    - `restrictions`: `object` (optional) - Restrictions for accessing the shared drive and its content (see `listDrives` for structure).
  - It throws an error if the operation fails, for example, due to invalid `driveId`, invalid update parameters, or insufficient permissions.

**Examples:**
```typescript
// Example 1: Update the name of a shared drive
async function renameDrive(sdk: GoogleDriveSdk, driveIdToUpdate: string, newName: string) {
  try {
    const updatedDrive = await sdk.updateDrive(driveIdToUpdate, { name: newName });
    console.log('Drive renamed successfully:', updatedDrive);
  } catch (error) {
    console.error(`Failed to rename drive ${driveIdToUpdate}:`, error);
  }
}

// Example 2: Update the theme and color of a shared drive
async function updateDriveTheme(sdk: GoogleDriveSdk, driveIdToUpdate: string, newThemeId: string, newColor: string) {
  try {
    const updatedDrive = await sdk.updateDrive(driveIdToUpdate, {
      themeId: newThemeId,
      colorRgb: newColor,
    });
    console.log('Drive theme updated successfully:', updatedDrive);
  } catch (error) {
    console.error(`Failed to update theme for drive ${driveIdToUpdate}:`, error);
  }
}

// Example 3: Update restrictions on a shared drive
async function updateDriveRestrictions(sdk: GoogleDriveSdk, driveIdToUpdate: string) {
  try {
    const updatedDrive = await sdk.updateDrive(driveIdToUpdate, {
      restrictions: {
        copyRequiresWriterPermission: true,
        domainUsersOnly: true,
      },
    });
    console.log('Drive restrictions updated successfully:', updatedDrive);
  } catch (error) {
    console.error(`Failed to update restrictions for drive ${driveIdToUpdate}:`, error);
  }
}

// Assuming 'sdk' is an initialized instance of GoogleDriveSdk
// renameDrive(sdk, '<driveId>', 'New Marketing Drive');
// updateDriveTheme(sdk, '<driveId>', '<themeIdString>', '#4A90E2');
// updateDriveRestrictions(sdk, '<driveId>');
```
