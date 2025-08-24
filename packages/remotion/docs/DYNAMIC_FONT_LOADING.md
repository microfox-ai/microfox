# Dynamic Font Loading in @microfox/remotion

## Overview

The `@microfox/remotion` package now includes comprehensive dynamic font loading capabilities that allow you to load Google Fonts on-demand in your Remotion compositions. This feature provides better performance, reduced bundle size, and improved user experience.

## Features

- **Dynamic Google Font Loading**: Load fonts only when needed
- **Font Caching**: Prevent duplicate font loading requests
- **Loading States**: Visual indicators during font loading
- **Error Handling**: Graceful fallbacks when fonts fail to load
- **Multiple Weights & Subsets**: Support for various font configurations
- **Performance Optimization**: Font preloading and display strategies
- **TypeScript Support**: Full type safety for font configurations

## Quick Start

### Basic Usage

```typescript
import { TextAtom } from '@microfox/remotion';

const MyComposition = () => (
  <TextAtom
    data={{
      text: "Hello World",
      font: {
        family: "Inter",
        weights: ["400", "700"],
        subsets: ["latin"],
        display: "swap",
        preload: true,
      },
      fallbackFonts: ["Arial", "sans-serif"],
    }}
  />
);
```

### Advanced Usage with Loading States

```typescript
import { TextAtomWithFonts } from '@microfox/remotion';

const MyComposition = () => (
  <TextAtomWithFonts
    data={{
      text: "Dynamic Font Example",
      font: {
        family: "Roboto",
        weights: ["300", "400", "500", "700"],
        subsets: ["latin", "latin-ext"],
      },
      loadingState: {
        showLoadingIndicator: true,
        loadingText: "Loading font...",
        loadingStyle: {
          color: "#666",
          fontStyle: "italic",
        },
      },
      errorState: {
        showErrorIndicator: true,
        errorText: "Font failed to load",
        errorStyle: {
          color: "#ff6b6b",
          fontStyle: "italic",
        },
      },
    }}
  />
);
```

## API Reference

### Font Configuration

```typescript
interface FontConfig {
  family: string; // Font family name (e.g., "Inter", "Roboto")
  weights?: string[]; // Font weights to load (e.g., ["400", "700"])
  subsets?: string[]; // Character subsets (e.g., ["latin", "latin-ext"])
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean; // Whether to preload the font
}
```

### TextAtom Data Interface

```typescript
interface TextAtomData {
  text: string; // Text content to display
  style?: React.CSSProperties; // Additional CSS styles
  className?: string; // CSS class name
  font?: FontConfig; // Font configuration
  fallbackFonts?: string[]; // Fallback font families
  loadingState?: LoadingState; // Loading state configuration
  errorState?: ErrorState; // Error state configuration
}
```

### Loading State Configuration

```typescript
interface LoadingState {
  showLoadingIndicator?: boolean; // Show loading indicator
  loadingText?: string; // Custom loading text
  loadingStyle?: React.CSSProperties; // Loading text styles
}
```

### Error State Configuration

```typescript
interface ErrorState {
  showErrorIndicator?: boolean; // Show error indicator
  errorText?: string; // Custom error text
  errorStyle?: React.CSSProperties; // Error text styles
}
```

## Hooks

### useFontLoader

A comprehensive hook for managing font loading state and operations.

```typescript
import { useFontLoader } from '@microfox/remotion';

const MyComponent = () => {
  const {
    loadFont,
    loadMultipleFonts,
    isFontReady,
    areFontsReady,
    getFontError,
    clearErrors,
    loadedFonts,
    loadingFonts,
    errorFonts,
  } = useFontLoader({
    onLoad: (family) => console.log(`Font ${family} loaded`),
    onError: (family, error) => console.error(`Font ${family} failed:`, error),
  });

  // Load a single font
  useEffect(() => {
    loadFont('Inter', {
      weights: ['400', '700'],
      subsets: ['latin'],
    });
  }, [loadFont]);

  // Load multiple fonts
  useEffect(() => {
    loadMultipleFonts([
      { family: 'Inter', options: { weights: ['400', '700'] } },
      { family: 'Roboto', options: { weights: ['400', '500'] } },
    ]);
  }, [loadMultipleFonts]);

  return (
    <div>
      {isFontReady('Inter') ? 'Inter is ready' : 'Loading Inter...'}
    </div>
  );
};
```

### useFont

A simplified hook for loading a single font with automatic loading.

```typescript
import { useFont } from '@microfox/remotion';

const MyComponent = () => {
  const { isLoaded, error, isReady } = useFont('Inter', {
    weights: ['400', '700'],
    subsets: ['latin'],
  });

  if (error) {
    return <div>Font loading failed: {error.message}</div>;
  }

  return (
    <div style={{ fontFamily: isReady ? 'Inter, sans-serif' : 'sans-serif' }}>
      {isLoaded ? 'Font loaded!' : 'Loading font...'}
    </div>
  );
};
```

## Utilities

### Font Utilities

```typescript
import {
  loadGoogleFont,
  loadMultipleFonts,
  getFontFamilyCSS,
  preloadCommonFonts,
  isFontLoaded,
  clearFontCache,
} from '@microfox/remotion';

// Load a single font
await loadGoogleFont('Inter', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

// Load multiple fonts
await loadMultipleFonts([
  { family: 'Inter', options: { weights: ['400', '700'] } },
  { family: 'Roboto', options: { weights: ['400', '500'] } },
]);

// Get CSS font-family value
const fontFamily = getFontFamilyCSS('Inter', ['Arial', 'sans-serif']);
// Returns: "Inter, Arial, sans-serif"

// Preload common fonts
await preloadCommonFonts();

// Check if font is loaded
const isLoaded = isFontLoaded('Inter');

// Clear font cache
clearFontCache();
```

## Best Practices

### 1. Font Selection

- Choose fonts that are commonly available and load quickly
- Use `display: 'swap'` for better performance
- Preload critical fonts using `preload: true`

### 2. Performance Optimization

```typescript
// Preload fonts at composition start
useEffect(() => {
  preloadCommonFonts();
}, []);

// Use font weights efficiently
const fontConfig = {
  family: 'Inter',
  weights: ['400', '700'], // Only load needed weights
  subsets: ['latin'], // Only load needed subsets
  display: 'swap', // Better performance
  preload: true, // Preload for critical fonts
};
```

### 3. Error Handling

```typescript
const MyComponent = () => {
  const { isLoaded, error } = useFont('Inter');

  if (error) {
    // Fallback to system fonts
    return (
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        Fallback text
      </div>
    );
  }

  return (
    <div style={{ fontFamily: isLoaded ? 'Inter, sans-serif' : 'sans-serif' }}>
      {isLoaded ? 'Inter font' : 'System font'}
    </div>
  );
};
```

### 4. Loading States

```typescript
const MyComponent = () => {
  const { isLoaded } = useFont('Inter');

  return (
    <div style={{
      opacity: isLoaded ? 1 : 0.8,
      transition: 'opacity 0.3s ease-in-out',
    }}>
      {isLoaded ? 'Font loaded' : 'Loading font...'}
    </div>
  );
};
```

## Examples

### Example 1: Basic Text with Google Font

```typescript
import { TextAtom } from '@microfox/remotion';

const BasicExample = () => (
  <TextAtom
    data={{
      text: "Welcome to Microfox",
      font: {
        family: "Inter",
        weights: ["400", "700"],
        subsets: ["latin"],
        display: "swap",
        preload: true,
      },
      style: {
        fontSize: "48px",
        fontWeight: 700,
        color: "#333",
      },
    }}
  />
);
```

### Example 2: Multiple Font Weights

```typescript
const MultipleWeightsExample = () => (
  <div>
    <TextAtom
      data={{
        text: "Light Text",
        font: {
          family: "Roboto",
          weights: ["300", "400", "500", "700"],
          subsets: ["latin", "latin-ext"],
        },
        style: { fontWeight: 300, fontSize: "24px" },
      }}
    />
    <TextAtom
      data={{
        text: "Bold Text",
        font: {
          family: "Roboto",
          weights: ["300", "400", "500", "700"],
          subsets: ["latin", "latin-ext"],
        },
        style: { fontWeight: 700, fontSize: "24px" },
      }}
    />
  </div>
);
```

### Example 3: Advanced with Loading States

```typescript
const AdvancedExample = () => (
  <TextAtomWithFonts
    data={{
      text: "Advanced Font Example",
      font: {
        family: "Open Sans",
        weights: ["400", "600", "700"],
        subsets: ["latin"],
        display: "swap",
        preload: true,
      },
      fallbackFonts: ["Arial", "Helvetica", "sans-serif"],
      loadingState: {
        showLoadingIndicator: true,
        loadingText: "Loading Open Sans...",
        loadingStyle: {
          color: "#666",
          fontStyle: "italic",
          fontSize: "14px",
        },
      },
      errorState: {
        showErrorIndicator: true,
        errorText: "Using fallback font",
        errorStyle: {
          color: "#ff6b6b",
          fontStyle: "italic",
          fontSize: "14px",
        },
      },
      style: {
        fontSize: "32px",
        lineHeight: 1.4,
        textAlign: "center",
      },
    }}
  />
);
```

## Troubleshooting

### Common Issues

1. **Font not loading**: Check if the font name is correct and available on Google Fonts
2. **Performance issues**: Use `display: 'swap'` and preload critical fonts
3. **Bundle size**: Only load the weights and subsets you need
4. **Network errors**: Implement proper error handling and fallbacks

### Debug Mode

Enable debug logging to troubleshoot font loading issues:

```typescript
const { loadFont } = useFontLoader({
  onLoad: (family) => console.log(`✅ Font ${family} loaded successfully`),
  onError: (family, error) => console.error(`❌ Font ${family} failed:`, error),
});
```

## Migration Guide

### From Static Font Loading

**Before:**

```typescript
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

const MyComponent = () => (
  <div style={{ fontFamily }}>Text</div>
);
```

**After:**

```typescript
import { TextAtom } from '@microfox/remotion';

const MyComponent = () => (
  <TextAtom
    data={{
      text: "Text",
      font: {
        family: "Inter",
        weights: ["400", "700"],
        subsets: ["latin"],
      },
    }}
  />
);
```

## Performance Considerations

- **Font Caching**: Fonts are cached to prevent duplicate loading
- **Lazy Loading**: Fonts are loaded only when needed
- **Preloading**: Critical fonts can be preloaded for better performance
- **Display Strategies**: Use appropriate display strategies for your use case
- **Bundle Size**: Only load required weights and subsets

## Browser Support

The dynamic font loading feature works in all modern browsers that support:

- ES6 Modules
- Dynamic imports
- CSS Font Loading API
- Remotion's font loading capabilities

## Contributing

When contributing to the font loading feature:

1. Follow the existing code patterns
2. Add comprehensive TypeScript types
3. Include error handling
4. Add tests for new functionality
5. Update documentation
6. Consider performance implications
