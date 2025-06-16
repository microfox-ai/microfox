## Function: `videoEffects`

Applies a predefined visual effect to a source video. This function modifies the visual appearance of the video based on the specified effect name.

**Purpose:**
To quickly add stylistic filters or complex visual effects to a video without needing specialized video editing software.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for applying video effects.
  - **`videoUrl`** (string, required): The publicly accessible URL of the video to which the effect will be applied.
  - **`effectName`** (string, required): The name of the effect to apply (e.g., 'black_and_white', 'vintage', 'glow').

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the video effects task.

**Examples:**

```typescript
// Example: Apply a 'vintage' effect to a video
const taskId = await klingai.videoEffects({
  videoUrl: 'https://example.com/path/to/your/video.mp4',
  effectName: 'vintage'
});
console.log('Video effects task started with ID:', taskId);
```