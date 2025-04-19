# getLists

Retrieves all lists in a specific folder from ClickUp.

## Parameters

- **folderId** (string): The ID of the folder to retrieve lists from.

## Return Type

`Promise<ListResponse>`

## Example

```typescript
const lists = await clickUp.getLists('folderId');
console.log(lists);
```

## Response Example

```typescript
{
  lists: [
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
        type: 'open',
      },
      priority: {
        id: '1',
        priority: 'urgent',
        color: '#ff0000',
        orderindex: '1',
      },
      assignee: {
        id: 123,
        username: 'John Doe',
        color: '#ff0000',
        email: 'john@example.com',
        profilePicture: 'https://example.com/profile.jpg',
      },
      task_count: 5,
      due_date: '1567780450202',
      start_date: '1567780450202',
      folder: {
        id: '123',
        name: 'Folder Name',
        hidden: false,
        access: true,
      },
      space: {
        id: '123',
        name: 'Space Name',
        access: true,
      },
      archived: false,
      override_statuses: false,
      statuses: [
        {
          id: 'status_id',
          status: 'in progress',
          color: '#ff0000',
          orderindex: 1,
          type: 'open',
        },
      ],
      permission_level: 'create',
    },
    // ... more lists
  ];
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
  const lists = await clickUp.getLists('folderId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Folder not found');
  } else {
    console.error('Failed to get lists:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The folder ID can be found in the URL when viewing a folder in ClickUp
- The response includes all lists in the folder, including their full details
- Archived lists are included in the response
- Lists are returned in order of their orderindex
