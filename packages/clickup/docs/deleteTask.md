# deleteTask

Deletes a task from ClickUp.

## Parameters

- **taskId** (string): The ID of the task to delete.

## Return Type

`Promise<void>`

## Example

```typescript
await clickUp.deleteTask('taskId');
```

## Error Handling

The function will throw an error if:

- The task ID is invalid
- The task doesn't exist
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  await clickUp.deleteTask('taskId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Task not found');
  } else {
    console.error('Failed to delete task:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The task ID can be found in the URL when viewing a task in ClickUp
- This operation cannot be undone
- Deleting a task will also delete all its subtasks
- The task will be permanently removed from ClickUp
