## Function: `deleteDrive`

Permanently deletes a shared drive. The calling user must be an organizer of the shared drive. The shared drive must be empty before it can be deleted.

**Purpose:**
To remove a shared drive that is no longer needed. This is a permanent action and cannot be undone.

**Parameters:**
- `driveId`: `string` (required) - The ID of the shared drive to delete.

**Return Value:**
- Type: `Promise<void>`
- Description: A promise that resolves when the shared drive has been successfully deleted. It does not return any specific data on success.
- Error cases: Throws an error if the deletion fails (e.g., `driveId` is invalid, the user is not an organizer, the drive is not empty, or the drive does not exist).

**Examples:**
```typescript
// Example 1: Delete a shared drive
async function exampleDeleteDrive() {
  const driveIdToDelete = 'your-drive-id-to-delete'; // Replace with an actual drive ID

  // Ensure the drive is empty and the user has permissions before calling.
  // This often requires listing files in the drive and deleting them first,
  // or ensuring the drive was created for temporary purposes and is known to be empty.

  try {
    await sdk.deleteDrive(driveIdToDelete);
    console.log(`Shared drive ${driveIdToDelete} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting shared drive ${driveIdToDelete}:`, error);
    // Common errors include: drive not empty, insufficient permissions.
  }
}
```
