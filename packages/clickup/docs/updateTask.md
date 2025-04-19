# updateTask

Updates an existing task in ClickUp.

## Parameters

- **taskId** (string): The ID of the task to update.
- **params** (UpdateTaskParams): An object containing the task updates.
  - **name** (string, optional): The new name of the task.
  - **description** (string, optional): The new task description.
  - **assignees** (number[], optional): Array of user IDs to assign to the task.
  - **status** (string, optional): The new status of the task.
  - **priority** (number, optional): The new priority level of the task (1-4).
  - **due_date** (number, optional): The new due date in milliseconds since epoch.
  - **due_date_time** (boolean, optional): Whether the due date includes time.
  - **time_estimate** (number, optional): New estimated time in milliseconds.
  - **start_date** (number, optional): The new start date in milliseconds since epoch.
  - **start_date_time** (boolean, optional): Whether the start date includes time.
  - **notify_all** (boolean, optional): Whether to notify all assignees.
  - **parent** (string, optional): The ID of the parent task.
  - **links_to** (string, optional): The ID of the task to link to.
  - **check_required_custom_fields** (boolean, optional): Whether to check required custom fields.
  - **custom_fields** (Array<{ id: string; value?: unknown }>, optional): Array of custom field values.

## Return Type

`Promise<Task>`

## Example

```typescript
const updatedTask = await clickUp.updateTask('taskId', {
  name: 'Updated Task Name',
  status: 'completed',
  priority: 1,
  custom_fields: [
    {
      id: 'fieldId',
      value: 'newValue',
    },
  ],
});
```

## Response Example

```typescript
{
  id: '123456',
  name: 'Updated Task Name',
  description: 'Task description',
  status: {
    id: 'status_id',
    status: 'completed',
    color: '#00ff00',
    orderindex: 2,
    type: 'closed'
  },
  orderindex: '1.00000000000000000000',
  date_created: '1567780450202',
  date_updated: '1567780450202',
  date_closed: '1567780450202',
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
  custom_fields: [
    {
      id: 'fieldId',
      name: 'Custom Field',
      type: 'text',
      type_config: {},
      date_created: '1567780450202',
      hide_from_guests: false,
      value: 'newValue',
      required: false
    }
  ],
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
- Custom field values are invalid
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  const task = await clickUp.updateTask('taskId', params);
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Task not found');
  } else if (error.message.includes('custom field')) {
    console.error('Invalid custom field value');
  } else {
    console.error('Failed to update task:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The task ID can be found in the URL when viewing a task in ClickUp
- Only include the fields you want to update
- Custom fields must match the field type defined in ClickUp
- Priority levels: 1 (urgent), 2 (high), 3 (normal), 4 (low)
- Dates should be provided in milliseconds since epoch
