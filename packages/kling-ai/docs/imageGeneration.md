## Function: `imageGeneration`

Submits a task to generate an image from a text prompt. This function allows you to create still images using Klingai's image generation models.

**Note:** The specific parameters for the request body (`ImageGenerationRequestBody`) are not defined in the current version of the SDK's type definitions. Please refer to the official Klingai API documentation for the detailed structure of the request body.

**Purpose:**
To start an image generation job based on a descriptive text input.

**Parameters:**

- `params` (object, required): An object containing the parameters for the image generation task. This corresponds to the `ImageGenerationRequestBody` type.
  - **(undefined)**: The properties for this object are not yet specified in the SDK. You should structure this object according to the official Klingai API documentation, likely including a `prompt` and other image-related settings.

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
// Example 1: Submitting an image generation task
// Note: The structure of the 'params' object depends on the official API documentation.
// The example below uses an empty object as a placeholder.

try {
  const response = await klingai.imageGeneration({
    // Add required parameters like 'prompt' as per the API docs.
    // e.g., prompt: 'A hyper-realistic portrait of a cat wearing a wizard hat'
  });
  console.log('Image generation task submitted:', response);
  // You can use response.data.task_id to query the task status later.
} catch (error) {
  console.error('Error submitting image generation task:', error);
}
```