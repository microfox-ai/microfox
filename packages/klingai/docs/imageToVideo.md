## Function: `imageToVideo`

Submits a task to generate a video from a source image. This function initiates an image-to-video generation job on the Klingai API.

**Note:** The specific parameters for the request body (`ImageToVideoRequestBody`) are not defined in the current version of the SDK's type definitions. Please refer to the official Klingai API documentation for the detailed structure of the request body.

**Purpose:**
To start a video generation process based on an input image.

**Parameters:**

- `params` (object, required): An object containing the parameters for the image-to-video generation task. This corresponds to the `ImageToVideoRequestBody` type.
  - **(undefined)**: The properties for this object are not yet specified in the SDK. You should structure this object according to the official Klingai API documentation.

**Return Value:**

- `Promise<TaskResponse>`: A promise that resolves to a generic task response object.
  - `code` (number): The status code of the response.
  - `message` (string): A message describing the result of the request.
  - `request_id` (string): The unique ID for this API request.
  - `data` (object): An object containing task-specific information.
    - `task_id` (string): The unique identifier for the newly created task.
    - `task_status` (string): The initial status of the task (e.g., `'submitted'`).
    - `task_info` (object): Additional information about the task.
    - `created_at` (number): A Unix timestamp of when the task was created.
    - `updated_at` (number): A Unix timestamp of when the task was last updated.

**Examples:**

```typescript
// Example 1: Submitting an image-to-video task
// Note: The structure of the 'params' object depends on the official API documentation.
// The example below uses an empty object as a placeholder.

try {
  const response = await klingai.imageToVideo({
    // Add required parameters like 'image_url' or 'prompt' as per the API docs.
    // e.g., imageUrl: 'https://example.com/source.jpg', prompt: 'make the person wave'
  });
  console.log('Image-to-video task submitted:', response);
  // You can use response.data.task_id to query the task status later.
} catch (error) {
  console.error('Error submitting image-to-video task:', error);
}
```