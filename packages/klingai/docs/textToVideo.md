## Function: `textToVideo`

Generates a video from a given text prompt. This function submits a request to the Klingai API to create a video that visually represents the provided text description.

**Purpose:**
To convert a textual description into a video, enabling creative video generation from simple text inputs.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for the text-to-video generation.
  - **`prompt`** (string, required): A detailed description of the video content to be generated. The prompt has a maximum length of 1000 characters.
  - **`style`** (string, optional): The artistic style to be applied to the generated video (e.g., 'cinematic', 'anime', 'photorealistic').
  - **`duration`** (number, optional): The desired duration of the video in seconds. Must be a positive number.

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the video generation task. This ID can be used to track the status and retrieve the final video.

**Examples:**

```typescript
// Example 1: Minimal usage with only the required prompt
const taskId1 = await klingai.textToVideo({
  prompt: 'A majestic lion walking through the savanna at sunset'
});
console.log('Video generation task started with ID:', taskId1);

// Example 2: Full usage with style and duration
const taskId2 = await klingai.textToVideo({
  prompt: 'A futuristic city with flying cars and neon lights',
  style: 'cyberpunk',
  duration: 10
});
console.log('Video generation task started with ID:', taskId2);
```