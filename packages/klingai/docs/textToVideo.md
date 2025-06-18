## Function: `textToVideo`

Submits a task to generate a video from a text prompt. This function sends a request to the Klingai API to start a new video generation job with the specified parameters. You can control various aspects of the generated video, such as the AI model, negative prompts, camera movements, and more.

**Purpose:**
To initiate the creation of a video based on a descriptive text input. This is the primary function for text-to-video generation tasks.

**Parameters:**

- `params` (object, required): An object containing the parameters for the text-to-video generation task. This corresponds to the `TextToVideoRequestBody` type.
  - `prompt` (string, required): A detailed textual description of the video content you want to generate.
  - `model_name` (string, optional): The name of the model to use for generation. Defaults to the latest stable model if not specified.
    - Valid values: `'kling-v1'`, `'kling-v1-6'`, `'kling-v2-master'`.
  - `negative_prompt` (string, optional): A description of what you want to avoid in the video, helping to guide the model away from undesirable elements.
  - `cfg_scale` (number, optional): A value between 0 and 1 that controls how closely the generation follows the prompt. Higher values result in stricter adherence.
  - `mode` (string, optional): The generation mode.
    - Valid values: `'std'`, `'pro'`.
  - `camera_control` (object, optional): An object to define camera movements.
    - `type` (string, optional): The type of camera movement preset.
      - Valid values: `'simple'`, `'down_back'`, `'forward_up'`, `'right_turn_forward'`, `'left_turn_forward'`.
    - `config` (object, optional): Fine-grained control over camera parameters. All values range from -10 to 10.
      - `horizontal` (number, optional): Horizontal movement.
      - `vertical` (number, optional): Vertical movement.
      - `pan` (number, optional): Camera panning.
      - `tilt` (number, optional): Camera tilting.
      - `roll` (number, optional): Camera rolling.
      - `zoom` (number, optional): Camera zooming.
  - `aspect_ratio` (string, optional): The aspect ratio of the output video.
    - Valid values: `'16:9'`, `'9:16'`, `'1:1'`.
  - `duration` (number, optional): The desired duration of the video in seconds.
    - Valid values: `5`, `10`.
  - `callback_url` (string, optional): A valid URL to which a notification will be sent upon task completion.
  - `external_task_id` (string, optional): A custom identifier you can assign to the task for your own reference.

**Return Value:**

- `Promise<TextToVideoResponse>`: A promise that resolves to an object containing details about the submitted task.
  - `code` (number): The status code of the response.
  - `message` (string): A message describing the result of the request.
  - `request_id` (string): The unique ID for this API request.
  - `data` (object): An object containing task-specific information.
    - `task_id` (string): The unique identifier for the newly created task. This ID is used to query the task's status and retrieve the result.
    - `task_status` (string): The initial status of the task (e.g., `'submitted'`).
    - `task_info` (object): Additional information about the task.
      - `external_task_id` (string, optional): The custom ID you provided.
    - `created_at` (number): A Unix timestamp of when the task was created.
    - `updated_at` (number): A Unix timestamp of when the task was last updated.

**Examples:**

```typescript
// Example 1: Minimal usage with only the required prompt
const response1 = await klingai.textToVideo({
  prompt: "A majestic lion roaming the savanna at sunrise"
});
console.log('Minimal usage response:', response1);
// Expected output: { code: 0, message: 'succeed', ..., data: { task_id: '...', ... } }

// Example 2: Full usage with all optional arguments
const response2 = await klingai.textToVideo({
  prompt: "A futuristic cityscape at night, with flying vehicles and neon lights, cinematic style",
  negative_prompt: "blurry, cartoon, ugly",
  model_name: 'kling-v2-master',
  cfg_scale: 0.8,
  mode: 'pro',
  camera_control: {
    type: 'simple',
    config: {
      zoom: 2.5,
      pan: -1.5
    }
  },
  aspect_ratio: '16:9',
  duration: 10,
  callback_url: 'https://example.com/webhook/klingai',
  external_task_id: 'my-custom-video-task-123'
});
console.log('Full usage response:', response2);
```