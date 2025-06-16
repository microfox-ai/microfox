## Function: `videoExtension`

Extends the duration of an existing video. This function takes a source video and generates new content to lengthen it to the desired duration.

**Purpose:**
To seamlessly extend video clips without manual editing, useful for making a short clip fit a longer timeline.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for the video extension.
  - **`videoUrl`** (string, required): The publicly accessible URL of the video to be extended.
  - **`duration`** (number, required): The desired total duration of the extended video in seconds. This value must be greater than the original video's duration.

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the video extension task.

**Examples:**

```typescript
// Example: Extend a video to 30 seconds
const taskId = await klingai.videoExtension({
  videoUrl: 'https://example.com/path/to/your/short-video.mp4',
  duration: 30
});
console.log('Video extension task started with ID:', taskId);
```