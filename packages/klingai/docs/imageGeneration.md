## Function: `imageGeneration`

Generates an image from a given text prompt. This function creates a static image that visually represents the provided text description.

**Purpose:**
To create custom images, illustrations, or art from text, enabling a wide range of creative applications.

**Parameters:**

- **`params`** (object, required): An object containing the parameters for the image generation.
  - **`prompt`** (string, required): A detailed description of the image to be generated. The prompt has a maximum length of 1000 characters.
  - **`style`** (string, optional): The artistic style to be applied to the generated image (e.g., 'photorealistic', 'cartoon', 'watercolor').

**Return Value:**

- **`Promise<string>`**: A promise that resolves to a unique identifier for the image generation task. This ID can be used to track the status and retrieve the final image.

**Examples:**

```typescript
// Example 1: Minimal usage with only the required prompt
const taskId1 = await klingai.imageGeneration({
  prompt: 'A cute red panda sitting on a tree branch'
});
console.log('Image generation task started with ID:', taskId1);

// Example 2: Full usage with a specified style
const taskId2 = await klingai.imageGeneration({
  prompt: 'A knight in shining armor fighting a dragon',
  style: 'fantasy'
});
console.log('Image generation task started with ID:', taskId2);
```