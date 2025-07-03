## Function: `listImageToVideoTasks`

Retrieves a paginated list of your previously submitted image-to-video tasks. This is useful for reviewing your task history.

**Purpose:**
To get a historical list of image-to-video tasks.

**Parameters:**

- `pageNum` (number, optional): The page number of the results to retrieve.
  - Default: `1`.
- `pageSize` (number, optional): The number of tasks to include on each page.
  - Default: `30`.

**Return Value:**

- `Promise<QueryListResponse>`: A promise that resolves to an object containing a list of tasks.
  - `code` (number): The status code of the response.
  - `message` (string): A message describing the result of the request.
  - `request_id` (string): The unique ID for this API request.
  - `data` (array<object>): An array of task data objects. Each object provides details about a specific task.

**Examples:**

```typescript
// Example 1: Get the first page of image-to-video tasks
try {
  const taskList = await klingai.listImageToVideoTasks();
  console.log(`Found ${taskList.data.length} tasks on the first page.`);
  taskList.data.forEach(task => {
    console.log(`- Task ID: ${task.task_id}, Status: ${task.task_status}`);
  });
} catch (error) {
  console.error('Error listing tasks:', error);
}

// Example 2: Get the second page with 5 tasks per page
try {
  const taskList = await klingai.listImageToVideoTasks(2, 5);
  console.log(`Listing tasks from page 2 (5 per page):`);
  taskList.data.forEach(task => {
    console.log(`- Task ID: ${task.task_id}, Status: ${task.task_status}`);
  });
} catch (error) {
  console.error('Error listing tasks with custom pagination:', error);
}
```