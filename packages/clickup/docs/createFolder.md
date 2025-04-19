# createFolder

Creates a new folder in a specific space in ClickUp.

## Parameters

- **spaceId** (string): The ID of the space to create the folder in.
- **params** (CreateFolderParams): An object containing the folder details.
  - **name** (string): The name of the folder.
  - **hidden** (boolean, optional): Whether the folder should be hidden.
  - **override_statuses** (boolean, optional): Whether to override statuses.

## Return Type

`Promise<Folder>`

## Example

```typescript
const newFolder = await clickUp.createFolder('spaceId', {
  name: 'New Folder',
  hidden: false,
});
```

## Response Example

```typescript
{
  id: '123456',
  name: 'New Folder',
  orderindex: 1,
  override_statuses: false,
  hidden: false,
  space: {
    id: '123',
    name: 'Space Name',
    access: true
  },
  task_count: 0,
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
  lists: [],
  permission_level: 'create'
}
```

## Error Handling

The function will throw an error if:

- The space ID is invalid
- The space doesn't exist
- Required parameters are missing
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  const folder = await clickUp.createFolder('spaceId', params);
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Space not found');
  } else if (error.message.includes('required')) {
    console.error('Missing required parameters');
  } else {
    console.error('Failed to create folder:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The space ID can be found in the URL when viewing a space in ClickUp
- The folder name is required
- Hidden folders are not visible to all users
- Overriding statuses allows custom status configurations
