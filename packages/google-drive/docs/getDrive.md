## Function: `getDrive`

Retrieves the metadata for a specific shared drive by its ID. This includes information like the drive's name, theme, capabilities, and restrictions.

**Purpose:**
To fetch detailed information about a particular shared drive. This can be used to display drive properties, check user capabilities, or understand drive settings.

**Parameters:**
- `driveId`: `string` (required) - The ID of the shared drive to retrieve.

**Return Value:**
- Type: `Promise<DriveResponse>` (object)
- Description: A promise that resolves to a `DriveResponse` object containing the metadata for the shared drive.
  - `DriveResponse`: An object containing details of the shared drive. (See the `createDrive` function's return value for a detailed structure of `DriveResponse`.)

**Examples:**
```typescript
// Example 1: Get metadata for a shared drive
async function exampleGetDrive() {
  const driveIdToGet = 'your-drive-id'; // Replace with an actual drive ID
  try {
    const driveInfo = await sdk.getDrive(driveIdToGet);
    console.log('Shared Drive Information:', driveInfo);
    console.log(`Drive Name: ${driveInfo.name}`);
    console.log(`Created Time: ${driveInfo.createdTime}`);
    if (driveInfo.capabilities) {
      console.log(`Can current user add children? ${driveInfo.capabilities.canAddChildren}`);
    }
  } catch (error) {
    console.error(`Error getting shared drive ${driveIdToGet}:`, error);
  }
}
```
