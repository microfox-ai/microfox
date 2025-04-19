# getFolders

Retrieves all folders in a specific space from ClickUp.

## Parameters

- **spaceId** (string): The ID of the space to retrieve folders from.

## Return Type

`Promise<FolderResponse>`

## Example

```typescript
const folders = await clickUp.getFolders('spaceId');
console.log(folders);
```

## Response Example

```typescript
{
  folders: [
    {
      id: '123456',
      name: 'Folder Name',
      orderindex: 1,
      override_statuses: false,
      hidden: false,
      space: {
        id: '123',
        name: 'Space Name',
        access: true,
      },
      task_count: 10,
      archived: false,
      statuses: [
        {
          id: 'status_id',
          status: 'in progress',
          color: '#ff0000',
          orderindex: 1,
          type: 'open',
        },
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
          archived: false,
          override_statuses: false,
          permission_level: 'create',
        },
      ],
      permission_level: 'create',
    },
    // ... more folders
  ];
}
```

## Error Handling

The function will throw an error if:

- The space ID is invalid
- The space doesn't exist
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  const folders = await clickUp.getFolders('spaceId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Space not found');
  } else {
    console.error('Failed to get folders:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The space ID can be found in the URL when viewing a space in ClickUp
- The response includes all folders in the space, including their full details
- Archived folders are included in the response
- Folders are returned in order of their orderindex
