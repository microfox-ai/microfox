# updateList

Updates an existing list in ClickUp.

## Parameters

- **listId** (string): The ID of the list to update.
- **params** (UpdateListParams): An object containing the list updates.
  - **name** (string, optional): The new name of the list.
  - **content** (string, optional): The new description of the list.
  - **due_date** (number, optional): The new due date in milliseconds since epoch.
  - **due_date_time** (boolean, optional): Whether the due date includes time.
  - **priority** (number, optional): The new priority level of the list (1-4).
  - **assignee** (number, optional): The new user ID to assign to the list.
  - **status** (string, optional): The new status of the list.

## Return Type

`Promise<List>`

## Example

```typescript
const updatedList = await clickUp.updateList('listId', {
  name: 'Updated List Name',
  content: 'Updated description',
  priority: 2,
});
```

## Response Example

```typescript
{
  id: '123456',
  name: 'Updated List Name',
  orderindex: 1,
  content: 'Updated description',
  status: {
    id: 'status_id',
    status: 'active',
    color: '#00ff00',
    orderindex: 1,
    type: 'open'
  },
  priority: {
    id: '2',
    priority: 'high',
    color: '#ff9900',
    orderindex: '2'
  },
  assignee: {
    id: 123,
    username: 'John Doe',
    color: '#ff0000',
    email: 'john@example.com',
    profilePicture: 'https://example.com/profile.jpg'
  },
  task_count: 5,
  due_date: '1567780450202',
  start_date: '1567780450202',
  folder: {
    id: '123',
    name: 'Folder Name',
    hidden: false,
    access: true
  },
  space: {
    id: '123',
    name: 'Space Name',
    access: true
  },
  archived: false,
  override_statuses: false,
  statuses: [
    {
      id: 'status_id',
      status: 'in progress',
      color: '#ff0000',
      orderindex: 1,
      type: 'open'
    }
  ],
  permission_level: 'create'
}
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
  const list = await clickUp.updateList('listId', params);
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('List not found');
  } else {
    console.error('Failed to update list:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The list ID can be found in the URL when viewing a list in ClickUp
- Only include the fields you want to update
- Priority levels: 1 (urgent), 2 (high), 3 (normal), 4 (low)
- Dates should be provided in milliseconds since epoch
- The assignee must be a valid user ID in your ClickUp workspace
