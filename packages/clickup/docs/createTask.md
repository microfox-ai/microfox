# createTask

Creates a new task in a specified ClickUp list.

## Parameters

- **listId** (string): The ID of the list where the task will be created.
- **params** (CreateTaskParams): An object containing the task details.
  - **name** (string): The name of the task. (Required)
  - **description** (string, optional): The task description.
  - **assignees** (number[], optional): Array of user IDs to assign to the task.
  - **status** (string, optional): The status of the task.
  - **priority** (number, optional): The priority level of the task (1-4).
  - **due_date** (number, optional): The due date in milliseconds since epoch.
  - **due_date_time** (boolean, optional): Whether the due date includes time.
  - **time_estimate** (number, optional): Estimated time in milliseconds.
  - **start_date** (number, optional): The start date in milliseconds since epoch.
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
const task = await clickUp.createTask('listId', {
  name: 'New Task',
  description: 'This is a new task',
  assignees: [123],
  status: 'in progress',
  priority: 2,
  due_date: Date.now(),
  custom_fields: [
    {
      id: 'fieldId',
      value: 'fieldValue',
    },
  ],
});
```

## Response Example

```typescript
{
  id: '123456',
  name: 'New Task',
  description: 'This is a new task',
  status: {
    id: 'status_id',
    status: 'in progress',
    color: '#ff0000',
    orderindex: 1,
    type: 'open'
  },
  // ... other task properties
}
```

## Error Handling

The function will throw an error if:

- The list ID is invalid
- Required parameters are missing
- Custom field values are invalid
- The API key is invalid
- There are network issues

Example error handling:

```typescript
try {
  const task = await clickUp.createTask('listId', params);
} catch (error) {
  if (error.message.includes('required')) {
    console.error('Missing required parameters');
  } else {
    console.error('Failed to create task:', error.message);
  }
}
```

## Rate Limits

This endpoint is subject to ClickUp's rate limits. The exact limits depend on your ClickUp plan.

## Notes

- The list ID can be found in the URL when viewing a list in ClickUp
- Custom fields must match the field type defined in ClickUp
- Priority levels: 1 (urgent), 2 (high), 3 (normal), 4 (low)
- Dates should be provided in milliseconds since epoch
- The task will be created with the default status if none is specified
