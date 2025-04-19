# ClickUp SDK

A comprehensive TypeScript SDK for ClickUp, providing extensive functionality and handling edge cases.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Constructor](#constructor)
- [Functions](#functions)
  - [Tasks](#tasks)
  - [Lists](#lists)
  - [Folders](#folders)
  - [Spaces](#spaces)
  - [Time Tracking](#time-tracking)
  - [Goals](#goals)
  - [Comments](#comments)
  - [Webhooks](#webhooks)
  - [File Attachments](#file-attachments)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)
- [Type Safety](#type-safety)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install @microfox/clickup
# or
yarn add @microfox/clickup
```

## Configuration

```typescript
import { ClickUpSDK } from '@microfox/clickup';

const clickup = new ClickUpSDK('your-api-key');
```

## Constructor

### ClickUpSDK

Initializes a new instance of the ClickUp SDK.

#### Parameters

- **config** (ClickUpSDKConfig): An object containing the API key and optional base URL.
  - **apiKey** (string): Your ClickUp API key. Required.
  - **baseUrl** (string, optional): The base URL for the ClickUp API. Defaults to `https://api.clickup.com`.

#### Usage Example

```typescript
import { createClickUpSDK } from '@microfox/clickup-sdk';

// Initialize with API key
const clickUp = createClickUpSDK({ apiKey: 'YOUR_API_KEY' });

// Initialize with API key and custom base URL
const clickUpCustomUrl = createClickUpSDK({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://your-custom-domain.com/api',
});
```

## Functions

### Tasks

#### getTask

Retrieves a specific task from ClickUp by its ID.

```typescript
const task = await clickUp.getTask('taskId');
```

#### getTasks

Retrieves all tasks in a specific list.

```typescript
const tasks = await clickUp.getTasks('listId');
```

#### createTask

Creates a new task in a specified list.

```typescript
const newTask = await clickUp.createTask('listId', {
  name: 'New Task',
  description: 'Task description',
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

#### updateTask

Updates an existing task.

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

#### deleteTask

Deletes a task.

```typescript
await clickUp.deleteTask('taskId');
```

### Lists

#### getList

Retrieves a specific list.

```typescript
const list = await clickUp.getList('listId');
```

#### getLists

Retrieves all lists in a folder.

```typescript
const lists = await clickUp.getLists('folderId');
```

#### createList

Creates a new list in a folder.

```typescript
const newList = await clickUp.createList('folderId', {
  name: 'New List',
  content: 'List description',
  due_date: Date.now(),
  priority: 1,
});
```

#### updateList

Updates an existing list.

```typescript
const updatedList = await clickUp.updateList('listId', {
  name: 'Updated List Name',
  content: 'Updated description',
});
```

#### deleteList

Deletes a list.

```typescript
await clickUp.deleteList('listId');
```

### Folders

#### getFolder

Retrieves a specific folder.

```typescript
const folder = await clickUp.getFolder('folderId');
```

#### getFolders

Retrieves all folders in a space.

```typescript
const folders = await clickUp.getFolders('spaceId');
```

#### createFolder

Creates a new folder in a space.

```typescript
const newFolder = await clickUp.createFolder('spaceId', {
  name: 'New Folder',
});
```

#### updateFolder

Updates an existing folder.

```typescript
const updatedFolder = await clickUp.updateFolder('folderId', {
  name: 'Updated Folder Name',
});
```

#### deleteFolder

Deletes a folder.

```typescript
await clickUp.deleteFolder('folderId');
```

### Spaces

#### getSpace

Retrieves a specific space.

```typescript
const space = await clickUp.getSpace('spaceId');
```

#### getSpaces

Retrieves all spaces in a team.

```typescript
const spaces = await clickUp.getSpaces('teamId');
```

#### createSpace

Creates a new space in a team.

```typescript
const newSpace = await clickUp.createSpace('teamId', {
  name: 'New Space',
  multiple_assignees: true,
  features: {
    due_dates: true,
    sprints: true,
    time_tracking: true,
  },
});
```

#### updateSpace

Updates an existing space.

```typescript
const updatedSpace = await clickUp.updateSpace('spaceId', {
  name: 'Updated Space Name',
  multiple_assignees: false,
});
```

#### deleteSpace

Deletes a space.

```typescript
await clickUp.deleteSpace('spaceId');
```

### Time Tracking

#### getTimeEntries

Retrieves time entries for a task.

```typescript
const timeEntries = await clickUp.getTimeEntries('taskId');
```

#### createTimeEntry

Creates a new time entry for a task.

```typescript
const newTimeEntry = await clickUp.createTimeEntry('taskId', {
  start: Date.now(),
  end: Date.now() + 3600000,
  description: 'Worked on task',
});
```

#### updateTimeEntry

Updates an existing time entry.

```typescript
const updatedTimeEntry = await clickUp.updateTimeEntry(
  'taskId',
  'timeEntryId',
  {
    description: 'Updated time entry description',
    duration: 7200000,
  },
);
```

#### deleteTimeEntry

Deletes a time entry.

```typescript
await clickUp.deleteTimeEntry('taskId', 'timeEntryId');
```

### Goals

#### getGoal

Retrieves a specific goal.

```typescript
const goal = await clickUp.getGoal('goalId');
```

#### getGoals

Retrieves all goals in a team.

```typescript
const goals = await clickUp.getGoals('teamId');
```

#### createGoal

Creates a new goal in a team.

```typescript
const newGoal = await clickUp.createGoal('teamId', {
  name: 'New Goal',
  due_date: Date.now() + 2592000000, // 30 days from now
  description: 'Goal description',
  multiple_owners: true,
  owners: [123, 456],
});
```

#### updateGoal

Updates an existing goal.

```typescript
const updatedGoal = await clickUp.updateGoal('goalId', {
  name: 'Updated Goal Name',
  due_date: Date.now() + 5184000000, // 60 days from now
});
```

#### deleteGoal

Deletes a goal.

```typescript
await clickUp.deleteGoal('goalId');
```

### Comments

#### getComment

Retrieves a specific comment.

```typescript
const comment = await clickUp.getComment('commentId');
```

#### getComments

Retrieves all comments for a task.

```typescript
const comments = await clickUp.getComments('taskId');
```

#### createComment

Creates a new comment on a task.

```typescript
const newComment = await clickUp.createComment('taskId', {
  comment_text: 'This is a new comment',
  assignee: 123,
  notify_all: true,
});
```

#### updateComment

Updates an existing comment.

```typescript
const updatedComment = await clickUp.updateComment('commentId', {
  comment_text: 'Updated comment text',
});
```

#### deleteComment

Deletes a comment.

```typescript
await clickUp.deleteComment('commentId');
```

### Webhooks

#### getWebhook

Retrieves a specific webhook.

```typescript
const webhook = await clickUp.getWebhook('webhookId');
```

#### getWebhooks

Retrieves all webhooks for a team.

```typescript
const webhooks = await clickUp.getWebhooks('teamId');
```

#### createWebhook

Creates a new webhook for a team.

```typescript
const newWebhook = await clickUp.createWebhook('teamId', {
  endpoint: 'https://your-webhook-url.com',
  events: ['taskCreated', 'taskUpdated'],
  space_id: 'spaceId',
});
```

#### updateWebhook

Updates an existing webhook.

```typescript
const updatedWebhook = await clickUp.updateWebhook('webhookId', {
  endpoint: 'https://new-webhook-url.com',
  events: ['taskCreated', 'taskUpdated', 'taskDeleted'],
});
```

#### deleteWebhook

Deletes a webhook.

```typescript
await clickUp.deleteWebhook('webhookId');
```

### File Attachments

#### createTaskAttachment

Attaches a file to a task.

```typescript
const file = new File(['file content'], 'example.txt', { type: 'text/plain' });
const attachment = await clickUp.createTaskAttachment('taskId', file);
```

#### deleteTaskAttachment

Deletes a file attachment from a task.

```typescript
await clickUp.deleteTaskAttachment('taskId', 'attachmentId');
```

## Error Handling

All methods return Promises and will throw errors if something goes wrong. You should wrap your calls in try-catch blocks:

```typescript
try {
  const task = await clickUp.getTask('taskId');
} catch (error) {
  if (error.message.includes('not found')) {
    console.error('Task not found');
  } else if (error.message.includes('rate limit')) {
    console.error('Rate limit exceeded');
  } else {
    console.error('Failed to get task:', error.message);
  }
}
```

## Rate Limits

This SDK is subject to ClickUp's API rate limits:

- Free plan: 100 requests per minute
- Unlimited plan: 1000 requests per minute
- Business plan: 10000 requests per minute
- Enterprise plan: Custom limits

Make sure to implement appropriate rate limiting in your application if needed.

## Type Safety

This SDK is built with TypeScript and provides full type safety:

- All parameters and return types are properly typed
- IDE suggestions and autocompletion
- Compile-time error checking
- Input validation using Zod schemas

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
