## Function: `multiImageToVideo`

Submits a task to generate a video from multiple source images. This function initiates a multi-image-to-video generation job on the Klingai API.

**Note:** The specific parameters for the request body (`MultiImageToVideoRequestBody`) are not defined in the current version of the SDK's type definitions. Please refer to the official Klingai API documentation for the detailed structure of the request body.

**Purpose:**
To start a video generation process that combines or transitions between multiple input images.

**Parameters:**

- `params` (object, required): An object containing the parameters for the multi-image-to-video generation task. This corresponds to the `MultiImageToVideoRequestBody` type.
  - **(undefined)**: The properties for this object are not yet specified in the SDK. You should structure this object according to the official Klingai API documentation.

**Return Value:**

- `Promise<TaskResponse>`: A promise that resolves to a generic task response object.
  - `code` (number): The status code of the response.
  - `message` (string): A message describing the result of the request.
  - `request_id` (string): The unique ID for this API request.
  - `data` (object): An object containing task-specific information.
    - `task_id` (string): The unique identifier for the newly created task.
    - `task_status` (string): The initial status of the task (e.g., `'submitted'`).

**Examples:**

```typescript
// Example 1: Submitting a multi-image-to-video task
// Note: The structure of the 'params' object depends on the official API documentation.
// The example below uses an empty object as a placeholder.

try {
  const response = await klingai.multiImageToVideo({
    // Add required parameters like 'images' or 'prompt' as per the API docs.
    // e.g., images: [{ url: '...' }, { url: '...' }], prompt: 'transition between images'
  });
  console.log('Multi-image-to-video task submitted:', response);
  // You can use response.data.task_id to query the task status later.
} catch (error) {
  console.error('Error submitting multi-image-to-video task:', error);
}
```