# Color Utility

A collection of utility classes for color conversion, manipulation, and analysis.

## `ColorRgbUtility`

Provides static methods for working with RGB colors.

### `hexToRgb(hex: string): RGB | null`

Converts a hex color string to an RGB object.

**Example:**

```typescript
const rgb = ColorRgbUtility.hexToRgb('#FF5733');
// rgb is { r: 255, g: 87, b: 51 }
```

### `getLuminance(rgb: RGB): number`

Calculates the relative luminance of an RGB color.

**Example:**

```typescript
const luminance = ColorRgbUtility.getLuminance({ r: 255, g: 87, b: 51 });
// luminance is 0.392
```

### `getContrastRatio(rgb1: RGB, rgb2: RGB): number`

Calculates the contrast ratio between two RGB colors.

**Example:**

```typescript
const ratio = ColorRgbUtility.getContrastRatio(
  { r: 255, g: 255, b: 255 },
  { r: 0, g: 0, b: 0 }
);
// ratio is 21
```

### `rgbToHsl(rgb: RGB): HSL`

Converts an RGB color to HSL.

**Example:**

```typescript
const hsl = ColorRgbUtility.rgbToHsl({ r: 255, g: 87, b: 51 });
// hsl is { h: 11, s: 1, l: 0.6 }
```

### `rgbToLab(rgb: RGB): LAB`

Converts an RGB color to LAB color space.

**Example:**

```typescript
const lab = ColorRgbUtility.rgbToLab({ r: 255, g: 87, b: 51 });
// lab is { l: 62.9, a: 62.8, b: 58.9 }
```

### `deltaE(labA: LAB, labB: LAB): number`

Calculates the perceptual difference between two LAB colors.

**Example:**

```typescript
const lab1 = { l: 62.9, a: 62.8, b: 58.9 };
const lab2 = { l: 63.2, a: -3.8, b: 67.7 };
const diff = ColorRgbUtility.deltaE(lab1, lab2);
// diff is 67.1
```

### `rgbToHex(pixel: RGB): string`

Converts an RGB color to a hex string.

**Example:**

```typescript
const hex = ColorRgbUtility.rgbToHex({ r: 255, g: 87, b: 51 });
// hex is '#FF5733'
```

### `hslToRgb(hsl: HSL): RGB`

Converts an HSL color to RGB.

**Example:**

```typescript
const rgb = ColorRgbUtility.hslToRgb({ h: 11, s: 1, l: 0.6 });
// rgb is { r: 255, g: 87, b: 51 }
```

### `orderByLuminance(rgbValues: RGB[]): RGB[]`

Sorts an array of RGB colors by luminance.

**Example:**

```typescript
const colors = [
  { r: 0, g: 0, b: 0 },
  { r: 255, g: 255, b: 255 },
];
const sorted = ColorRgbUtility.orderByLuminance(colors);
// sorted is [{r:255,g:255,b:255}, {r:0,g:0,b:0}]
```

## `ColHexUtility`

Provides static methods for working with hex color strings.

### `getContrastColor(hex: string, options: object): string`

Finds the best contrasting color for a given hex color.

**Example:**

```typescript
const contrast = ColHexUtility.getContrastColor('#FF5733');
// contrast is '#000000'
```

### `getVibrantColor(hex: string): string`

Increases the saturation of a hex color.

**Example:**

```typescript
const vibrant = ColHexUtility.getVibrantColor('#9A9A9A');
// vibrant is '#B47FFF'
```

### `getMutedColor(hex: string): string`

Decreases the saturation of a hex color.

**Example:**

```typescript
const muted = ColHexUtility.getMutedColor('#FF5733');
// muted is '#C07E6D'
```

### `getAccentColor(hex: string): string`

Finds a complementary color.

**Example:**

```typescript
const accent = ColHexUtility.getAccentColor('#FF5733');
// accent is '#33DBFF'
```
