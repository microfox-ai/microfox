// Dynamic font loading utilities for Remotion
// Note: This utility provides a framework for font loading
// Specific font loading should be done using @remotion/google-fonts/{FontName}

export interface FontConfig {
  family: string;
  weights?: string[];
  subsets?: string[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
}

export interface FontLoadingOptions {
  subsets?: string[];
  weights?: string[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  preload?: boolean;
}

// Cache for loaded fonts to prevent duplicate loading
const loadedFonts = new Set<string>();

/**
 * Load a Google Font dynamically using dynamic imports
 * @param fontFamily - The font family name (e.g., 'Inter', 'Roboto')
 * @param options - Font loading options
 * @returns Promise that resolves when font is loaded
 */
export const loadGoogleFont = async (
  fontFamily: string,
  options: FontLoadingOptions = {}
): Promise<void> => {
  const fontKey = `${fontFamily}-${JSON.stringify(options)}`;

  if (loadedFonts.has(fontKey)) {
    return Promise.resolve();
  }

  try {
    // Dynamic import of the specific font package
    const fontPackage = await import(`@remotion/google-fonts/${fontFamily}`);

    if (fontPackage.loadFont) {
      await fontPackage.loadFont('normal', {
        subsets: options.subsets || ['latin'],
        weights: options.weights || ['400'],
        display: options.display || 'swap',
        preload: options.preload !== false,
      });
    }

    loadedFonts.add(fontKey);
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily}:`, error);
    // Fallback to system fonts
  }
};

/**
 * Load multiple fonts in parallel
 * @param fonts - Array of font configurations
 * @returns Promise that resolves when all fonts are loaded
 */
export const loadMultipleFonts = async (
  fonts: Array<{ family: string; options?: FontLoadingOptions }>
): Promise<void> => {
  const loadPromises = fonts.map(({ family, options }) =>
    loadGoogleFont(family, options)
  );

  await Promise.all(loadPromises);
};

/**
 * Get font family CSS value
 * @param fontFamily - The font family name
 * @param fallback - Fallback font families
 * @returns CSS font-family value
 */
export const getFontFamilyCSS = (
  fontFamily: string,
  fallback: string[] = ['sans-serif']
): string => {
  return `${fontFamily}, ${fallback.join(', ')}`;
};

/**
 * Preload common fonts for better performance
 */
export const preloadCommonFonts = async (): Promise<void> => {
  const commonFonts = [
    { family: 'Inter', options: { weights: ['400', '500', '600', '700'] } },
    { family: 'Roboto', options: { weights: ['400', '500', '700'] } },
    { family: 'Open Sans', options: { weights: ['400', '600', '700'] } },
    { family: 'Lato', options: { weights: ['400', '700'] } },
  ];

  await loadMultipleFonts(commonFonts);
};

/**
 * Check if a font is already loaded
 * @param fontFamily - The font family name
 * @param options - Font loading options
 * @returns boolean indicating if font is loaded
 */
export const isFontLoaded = (
  fontFamily: string,
  options: FontLoadingOptions = {}
): boolean => {
  const fontKey = `${fontFamily}-${JSON.stringify(options)}`;
  return loadedFonts.has(fontKey);
};

/**
 * Clear font cache (useful for testing or memory management)
 */
export const clearFontCache = (): void => {
  loadedFonts.clear();
};
