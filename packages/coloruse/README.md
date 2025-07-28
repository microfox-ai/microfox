# Coloruse

A TypeScript SDK for extracting and manipulating colors from images.

## Installation

```bash
npm install @microfox/coloruse
```

## Quick Start

```typescript
import { ColorPicker } from '@microfox/coloruse';

// Initialize the Color Picker
const colorPicker = new ColorPicker();

// Extract palette from an image URL
const { palette, dominantColor } =
  await colorPicker.extractPaletteFromImageData(
    'https://example.com/image.png'
  );

console.log('Palette:', palette);
console.log('Dominant Color:', dominantColor);
```

## API Reference

- [ColorPicker](./docs/ColorPicker.md) - For extracting color palettes from images.
- [ColorUtility](./docs/ColorUtility.md) - For color conversions and manipulations.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT
