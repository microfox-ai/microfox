# getList

Retrieves a specific list from ClickUp.

## Parameters

- **listId** (string): The ID of the list to retrieve.

## Return Type

`Promise<List>`

## Example

```typescript
const list = await clickUp.getList('listId');
console.log(list);
```

## Response Example

```typescript
{
  id: '123456',
  name: 'List Name',
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
  const list = await clickUp.getList('listId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('List not found');
  } else {
    console.error('Failed to get list:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The list ID can be found in the URL when viewing a list in ClickUp
- The response includes detailed information about the list, including its statuses and permissions
- Archived lists can still be retrieved using this endpoint
