# createTaskAttachment

Creates a new task attachment.

## Parameters

- **taskId** (string): The ID of the task.
- **file** (File): The file to attach.
- **customTaskIds** (boolean, optional): Whether to use custom task IDs.
- **teamId** (string, optional): The ID of the team.

## Return Type

Promise<TaskAttachmentResponse>

## Usage Example

```typescript
const file = new File(['file content'], 'my-file.txt', { type: 'text/plain' });
const attachment = await clickUp.createTaskAttachment('YOUR_TASK_ID', file);
console.log(attachment);
```

## File Upload Limits

The maximum file size is 1GB. Exceeding the storage limit will result in a 400 error with the code GBUSED_005.