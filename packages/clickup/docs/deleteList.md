# deleteList

Deletes a list from ClickUp.

## Parameters

- **listId** (string): The ID of the list to delete.

## Return Type

`Promise<void>`

## Example

```typescript
await clickUp.deleteList('listId');
```

## Error Handling

The function will throw an error if:

- The list ID is invalid
- The list doesn't exist
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  await clickUp.deleteList('listId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('List not found');
  } else {
    console.error('Failed to delete list:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The list ID can be found in the URL when viewing a list in ClickUp
- This operation cannot be undone
- Deleting a list will also delete all tasks within it
- The list will be permanently removed from ClickUp
