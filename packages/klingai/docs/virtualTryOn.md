## Function: `virtualTryOn`

Performs a virtual try-on by applying a specified item to a person in a source image or video. The function requires either an image or a video of the person and the ID of the item to be "tried on."

**Purpose:**
To allow users to visualize how clothing or accessories would look on them, commonly used in e-commerce and fashion applications.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for the virtual try-on. At least one of `imageUrl` or `videoUrl` must be provided.
  - **`imageUrl`** (string, optional): The publicly accessible URL of the image of the person.
  - **`videoUrl`** (string, optional): The publicly accessible URL of the video of the person.
  - **`itemId`** (string, required): The unique identifier of the item (e.g., a piece of clothing, accessory) to be tried on.

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the virtual try-on task.

**Examples:**

```typescript
// Example 1: Virtual try-on with a source image
const taskId1 = await klingai.virtualTryOn({
  imageUrl: 'https://example.com/path/to/person-image.jpg',
  itemId: 'dress-blue-001'
});
console.log('Virtual try-on task started with ID:', taskId1);

// Example 2: Virtual try-on with a source video
const taskId2 = await klingai.virtualTryOn({
  videoUrl: 'https://example.com/path/to/person-video.mp4',
  itemId: 'sunglasses-aviator-005'
});
console.log('Virtual try-on task started with ID:', taskId2);
```