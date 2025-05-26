## Function: `createDrive`

Creates a new shared drive. Shared drives are shared spaces where teams can easily store, search, and access their files.

**Purpose:**
To programmatically create new shared drives for collaboration. This is useful for setting up team spaces or project-specific drives.

**Parameters:**
- `name`: `string` (required) - The name of the new shared drive.
- `themeId`: `string` (optional) - The ID of the theme to apply to the new shared drive. Theme IDs can be retrieved from the `driveThemes` field in the `About` resource.

**Return Value:**
- Type: `Promise<DriveResponse>` (object)
- Description: A promise that resolves to a `DriveResponse` object representing the newly created shared drive.
  - `DriveResponse`: An object containing details of the shared drive, such as:
    - `id`: `string` - The ID of the shared drive.
    - `name`: `string` - The name of the shared drive.
    - `kind`: `string` - Identifies the resource type, `drive#drive`.
    - `themeId`: `string` (optional) - The ID of the theme applied to the shared drive.
    - `colorRgb`: `string` (optional) - The color of the shared drive as an RGB hex string.
    - `backgroundImageFile`: `object` (optional) - Information about the background image of the shared drive.
      - `id`: `string` - The ID of the image file.
      - `width`: `number` - The width of the image in pixels.
      - `yCoordinate`: `number` - The Y coordinate of the image.
      - `xCoordinate`: `number` - The X coordinate of the image.
    - `backgroundImageLink`: `string` (optional) - A short-lived link to the background image.
    - `capabilities`: `object` (optional) - Capabilities of the current user on this shared drive.
      - `canAddChildren`: `boolean`
      - `canChangeCopyRequiresWriterPermissionRestriction`: `boolean`
      - `canChangeDomainUsersOnlyRestriction`: `boolean`
      - `canChangeDriveBackground`: `boolean`
      - `canChangeDriveMembersOnlyRestriction`: `boolean`
      - `canComment`: `boolean`
      - `canCopy`: `boolean`
      - `canDeleteChildren`: `boolean`
      - `canDeleteDrive`: `boolean`
      - `canDownload`: `boolean`
      - `canEdit`: `boolean`
      - `canListChildren`: `boolean`
      - `canManageMembers`: `boolean`
      - `canReadRevisions`: `boolean`
      - `canRename`: `boolean`
      - `canRenameDrive`: `boolean`
      - `canShare`: `boolean`
      - `canTrashChildren`: `boolean`
    - `createdTime`: `string` (date-time, optional) - The time at which the shared drive was created.
    - `hidden`: `boolean` (optional) - Whether the shared drive is hidden from the user.
    - `restrictions`: `object` (optional) - Restrictions for this shared drive.
      - `copyRequiresWriterPermission`: `boolean`
      - `domainUsersOnly`: `boolean`
      - `driveMembersOnly`: `boolean`
      - `adminManagedRestrictions`: `boolean`

**Examples:**
```typescript
// Example 1: Create a new shared drive with a name only
async function exampleCreateDriveMinimal() {
  const driveName = 'New Project Shared Drive';
  try {
    const newDrive = await sdk.createDrive(driveName);
    console.log('Created Shared Drive:', newDrive);
    console.log(`Drive ID: ${newDrive.id}, Name: ${newDrive.name}`);
  } catch (error) {
    console.error('Error creating shared drive:', error);
  }
}

// Example 2: Create a new shared drive with a name and theme ID
async function exampleCreateDriveWithTheme() {
  const driveName = 'Marketing Team Drive';
  const themeId = 'your-theme-id'; // Replace with a valid theme ID from About resource
  try {
    const newDrive = await sdk.createDrive(driveName, themeId);
    console.log('Created Shared Drive with Theme:', newDrive);
    console.log(`Drive ID: ${newDrive.id}, Name: ${newDrive.name}, Theme ID: ${newDrive.themeId}`);
  } catch (error) {
    console.error('Error creating shared drive with theme:', error);
  }
}
```
