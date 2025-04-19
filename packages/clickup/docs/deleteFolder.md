# deleteFolder

Deletes a folder from ClickUp.

## Parameters

- **folderId** (string): The ID of the folder to delete.

## Return Type

`Promise<void>`

## Example

```typescript
await clickUp.deleteFolder('folderId');
```

## Error Handling

The function will throw an error if:

- The folder ID is invalid
- The folder doesn't exist
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  await clickUp.deleteFolder('folderId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Folder not found');
  } else {
    console.error('Failed to delete folder:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The folder ID can be found in the URL when viewing a folder in ClickUp
- This operation cannot be undone
- Deleting a folder will also delete all lists and tasks within it
- The folder will be permanently removed from ClickUp
