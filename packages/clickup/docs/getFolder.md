# getFolder

Retrieves a specific folder from ClickUp.

## Parameters

- **folderId** (string): The ID of the folder to retrieve.

## Return Type

`Promise<Folder>`

## Example

```typescript
const folder = await clickUp.getFolder('folderId');
console.log(folder);
```

## Response Example

```typescript
{
  id: '123456',
  name: 'Folder Name',
  orderindex: 1,
  override_statuses: false,
  hidden: false,
  space: {
    id: '123',
    name: 'Space Name',
    access: true
  },
  task_count: 10,
  archived: false,
  statuses: [
    {
      id: 'status_id',
      status: 'in progress',
      color: '#ff0000',
      orderindex: 1,
      type: 'open'
    }
  ],
  lists: [
    {
      id: '123',
      name: 'List Name',
      orderindex: 1,
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
      archived: false,
      override_statuses: false,
      permission_level: 'create'
    }
  ],
  permission_level: 'create'
}
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
  const folder = await clickUp.getFolder('folderId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Folder not found');
  } else {
    console.error('Failed to get folder:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The folder ID can be found in the URL when viewing a folder in ClickUp
- The response includes detailed information about the folder, including its lists and statuses
- Archived folders can still be retrieved using this endpoint
