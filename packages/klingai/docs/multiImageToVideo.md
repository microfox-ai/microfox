## Function: `multiImageToVideo`

Generates a video by sequencing multiple source images. This function creates a video slideshow or a more complex animation from an array of image URLs.

**Purpose:**
To create a single video from a collection of images, useful for storytelling, presentations, or creating dynamic visual sequences.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for the multi-image-to-video generation.
  - **`imageUrls`** (array<string>, required): An array of publicly accessible image URLs. The array must contain between 2 and 10 URLs.
  - **`style`** (string, optional): The artistic style or transition effect to be applied to the generated video.
  - **`duration`** (number, optional): The desired total duration of the video in seconds. Must be a positive number.

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the video generation task.

**Examples:**

```typescript
// Example 1: Minimal usage with required image URLs
const taskId1 = await klingai.multiImageToVideo({
  imageUrls: [
    'https://example.com/path/to/image1.jpg',
    'https://example.com/path/to/image2.jpg',
    'https://example.com/path/to/image3.jpg'
  ]
});
console.log('Video generation task started with ID:', taskId1);

// Example 2: Full usage with style and duration
const taskId2 = await klingai.multiImageToVideo({
  imageUrls: [
    'https://example.com/path/to/scene1.png',
    'https://example.com/path/to/scene2.png'
  ],
  style: 'dissolve',
  duration: 15
});
console.log('Video generation task started with ID:', taskId2);
```