## Function: `queryLipSyncTask`

Queries the status and result of a specific lip-sync task using its `task_id`. This allows you to track the progress of the task and retrieve the final video when it's complete.

**Purpose:**
To check the status of an ongoing lip-sync task or fetch the final result.

**Parameters:**

- `taskId` (string, required): The unique identifier of the task you want to query. This ID is returned by the `lipSync` function.

**Return Value:**

- `Promise<TaskResponse>`: A promise that resolves to a generic task response object, which includes the task's current status and results if available.
  - `code` (number): The status code of the response.
  - `message` (string): A message describing the result of the request.
  - `request_id` (string): The unique ID for this API request.
  - `data` (object): An object containing detailed task information.
    - `task_id` (string): The identifier of the task.
    - `task_status` (string): The current status of the task (`'submitted'`, `'processing'`, `'succeed'`, `'failed'`).
    - `task_status_msg` (string, optional): A detailed message about the task's status.
    - `task_result` (object, optional): Contains the output of the task upon success.

**Examples:**

```typescript
// Example 1: Querying a lip-sync task
const taskId = 'some-task-id-from-lipSync'; // Replace with a real task ID

try {
  const result = await klingai.queryLipSyncTask(taskId);
  console.log(`Task ${taskId} status: ${result.data.task_status}`);

  if (result.data.task_status === 'succeed') {
    console.log('Task completed successfully. Result:', result.data.task_result);
  } else if (result.data.task_status === 'failed') {
    console.error('Task failed:', result.data.task_status_msg);
  }
} catch (error) {
  console.error('Error querying task:', error);
}
```