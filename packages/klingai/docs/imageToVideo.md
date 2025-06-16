## Function: `imageToVideo`

Generates a video from a single source image. The function takes the URL of an image and animates it to create a video clip.

**Purpose:**
To bring static images to life by converting them into dynamic video content.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for the image-to-video generation.
  - **`imageUrl`** (string, required): The publicly accessible URL of the source image. The URL must be valid and properly formatted.
  - **`style`** (string, optional): The artistic or animation style to be applied to the generated video.
  - **`duration`** (number, optional): The desired duration of the video in seconds. Must be a positive number.

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the video generation task.

**Examples:**

```typescript
// Example 1: Minimal usage with only the required image URL
const taskId1 = await klingai.imageToVideo({
  imageUrl: 'https://example.com/path/to/your/image.jpg'
});
console.log('Video generation task started with ID:', taskId1);

// Example 2: Full usage with style and duration
const taskId2 = await klingai.imageToVideo({
  imageUrl: 'https://example.com/path/to/your/character.png',
  style: 'fantasy',
  duration: 8
});
console.log('Video generation task started with ID:', taskId2);
```