# createList

Creates a new list in a specific folder in ClickUp.

## Parameters

- **folderId** (string): The ID of the folder to create the list in.
- **params** (CreateListParams): An object containing the list details.
  - **name** (string): The name of the list.
  - **content** (string, optional): The description of the list.
  - **due_date** (number, optional): The due date in milliseconds since epoch.
  - **due_date_time** (boolean, optional): Whether the due date includes time.
  - **priority** (number, optional): The priority level of the list (1-4).
  - **assignee** (number, optional): The user ID to assign to the list.
  - **status** (string, optional): The status of the list.

## Return Type

`Promise<List>`

## Example

```typescript
const newList = await clickUp.createList('folderId', {
  name: 'New List',
  content: 'List description',
  priority: 1,
  assignee: 123,
});
```

## Response Example

```typescript
{
  id: '123456',
  name: 'New List',
  orderindex: 1,
  content: 'List description',
  status: {
    id: 'status_id',
    status: 'active',
    color: '#00ff00',
    orderindex: 1,
    type: 'open'
  },
  priority: {
    id: '1',
    priority: 'urgent',
    color: '#ff0000',
    orderindex: '1'
  },
  assignee: {
    id: 123,
    username: 'John Doe',
    color: '#ff0000',
    email: 'john@example.com',
    profilePicture: 'https://example.com/profile.jpg'
  },
  task_count: 0,
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

- The folder ID is invalid
- The folder doesn't exist
- Required parameters are missing
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  const list = await clickUp.createList('folderId', params);
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Folder not found');
  } else if (error.message.includes('required')) {
    console.error('Missing required parameters');
  } else {
    console.error('Failed to create list:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The folder ID can be found in the URL when viewing a folder in ClickUp
- The list name is required
- Priority levels: 1 (urgent), 2 (high), 3 (normal), 4 (low)
- Dates should be provided in milliseconds since epoch
- The assignee must be a valid user ID in your ClickUp workspace
