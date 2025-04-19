# getTask

Retrieves a specific task from ClickUp by its ID.

## Parameters

- **taskId** (string): The unique identifier of the task to retrieve.

## Return Type

`Promise<Task>`

## Example

```typescript
const task = await clickUp.getTask('123456');
console.log(task);
```

## Response Example

```typescript
{
  id: '123456',
  name: 'Task Name',
  description: 'Task description',
  status: {
    id: 'status_id',
    status: 'in progress',
    color: '#ff0000',
    orderindex: 1,
    type: 'open'
  },
  orderindex: '1.00000000000000000000',
  date_created: '1567780450202',
  date_updated: '1567780450202',
  date_closed: null,
  archived: false,
  creator: {
    id: 123,
    username: 'John Doe',
    color: '#ff0000',
    email: 'john@example.com',
    profilePicture: 'https://example.com/profile.jpg'
  },
  assignees: [
    {
      id: 123,
      username: 'John Doe',
      color: '#ff0000',
      email: 'john@example.com',
      profilePicture: 'https://example.com/profile.jpg'
    }
  ],
  watchers: [],
  checklists: [],
  tags: [],
  parent: null,
  priority: {
    id: '1',
    priority: 'urgent',
    color: '#ff0000',
    orderindex: '1'
  },
  due_date: '1567780450202',
  start_date: '1567780450202',
  points: 5,
  time_estimate: 3600000,
  time_spent: 1800000,
  custom_fields: [],
  dependencies: [],
  linked_tasks: [],
  team_id: '123',
  url: 'https://app.clickup.com/t/123456',
  permission_level: 'create',
  list: {
    id: '123',
    name: 'List Name',
    access: true
  },
  project: {
    id: '123',
    name: 'Project Name',
    hidden: false,
    access: true
  },
  folder: {
    id: '123',
    name: 'Folder Name',
    hidden: false,
    access: true
  },
  space: {
    id: '123'
  }
}
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
  const task = await clickUp.getTask('123456');
} catch (error) {
  console.error('Failed to get task:', error.message);
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The task ID can be found in the URL when viewing a task in ClickUp
- The response includes all task details including custom fields, dependencies, and linked tasks
- Archived tasks can still be retrieved using this method
