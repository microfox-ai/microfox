# ColorPicker

The `ColorPicker` class provides methods to extract color palettes from images.

## Methods

### `extractPaletteFromImageData(imageData, options)`

Extracts a color palette from image data.

**Parameters:**

- `imageData` (Uint8ClampedArray | string | ArrayBuffer): The image data to process. This can be raw pixel data, a URL to an image, or a base64 encoded image string.
- `options` (object): Optional configuration.
  - `deltaEThreshold` (number): The perceptual difference threshold for including colors in the palette. Default: `4`.
  - `paletteSize` (number): The maximum number of colors in the palette. Default: `12`.

**Returns:**

- `Promise<ExtractedPalette>`: An object containing the extracted palette and related information.

**`ExtractedPalette` Object:**

- `palette` (string[]): An array of hex color strings.
- `dominantColor` (string | undefined): The most prominent color in the palette.
- `secondaryColor` (string | undefined): The second most prominent color.
- `accentColor` (string | undefined): A color that contrasts well with the dominant and secondary colors.
- `accessibility` (AccessibilityInfo | undefined): Information about the best color for text against the dominant color.
  - `color` (string): The suggested text color (`#000000` or `#FFFFFF`).
  - `contrastRatio` (number): The contrast ratio.
- `logs` (string[]): Logs generated during the extraction process.

**Example:**

```typescript
import { ColorPicker } from '@microfox/coloruse';

const picker = new ColorPicker();
const imageUrl = 'https://i.imgur.com/8JUXtpx.jpeg'; // Example image URL

async function extract() {
  try {
    const result = await picker.extractPaletteFromImageData(imageUrl, {
      paletteSize: 10,
    });
    console.log('Dominant color:', result.dominantColor);
    console.log('Palette:', result.palette);
    console.log('Suggested text color:', result.accessibility?.color);
    console.log('Contrast ratio:', result.accessibility?.contrastRatio);
  } catch (error) {
    console.error('Error extracting palette:', error);
  }
}

extract();
```
