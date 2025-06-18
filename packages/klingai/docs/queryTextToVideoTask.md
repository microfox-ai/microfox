## Function: `queryTextToVideoTask`

Queries the status and result of a specific text-to-video task that was previously submitted. Use the `task_id` received from the `textToVideo` function to track the progress and retrieve the output video once the task is complete.

**Purpose:**
To check the status of an ongoing text-to-video task or fetch the final result, including the URL to the generated video.

**Parameters:**

- `taskId` (string, required): The unique identifier of the task you want to query. This ID is returned in the `data.task_id` field by the `textToVideo` function.

**Return Value:**

- `Promise<TextToVideoQueryResponse>`: A promise that resolves to an object containing the detailed status and potential results of the task. This type extends `TextToVideoResponse` with additional fields.
  - `code` (number): The status code of the response.
  - `message` (string): A message describing the result of the request.
  - `request_id` (string): The unique ID for this API request.
  - `data` (object): An object containing detailed task information.
    - `task_id` (string): The identifier of the task.
    - `task_status` (string): The current status of the task.
      - Possible values: `'submitted'`, `'processing'`, `'succeed'`, `'failed'`.
    - `task_status_msg` (string, optional): A more detailed message about the task's status, especially in case of failure.
    - `created_at` (number): A Unix timestamp of when the task was created.
    - `updated_at` (number): A Unix timestamp of when the task was last updated.
    - `task_result` (object, optional): This object is present when the task has succeeded.
      - `videos` (array<object>): An array containing the generated video(s).
        - `id` (string): A unique ID for the video asset.
        - `url` (string): The URL where the generated video can be downloaded or viewed.
        - `duration` (string): The duration of the video.

**Examples:**

```typescript
// Example 1: Querying a task by its ID
const taskId = 'some-task-id-from-textToVideo-response'; // Replace with a real task ID

try {
  const result = await klingai.queryTextToVideoTask(taskId);
  console.log('Task status:', result.data.task_status);

  if (result.data.task_status === 'succeed') {
    console.log('Video generated successfully!');
    console.log('Video URL:', result.data.task_result.videos[0].url);
  } else if (result.data.task_status === 'failed') {
    console.error('Task failed:', result.data.task_status_msg);
  } else {
    console.log('Task is still processing...');
  }
} catch (error) {
  console.error('Error querying task:', error);
}
```