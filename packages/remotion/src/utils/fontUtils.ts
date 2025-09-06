// Dynamic font loading utilities for Remotion
// Note: This utility provides a framework for font loading
// Specific font loading should be done using @remotion/google-fonts/{FontName}
//
// IMPORTANT: Make sure the font you're trying to load is available in @remotion/google-fonts
// Font names are automatically normalized (spaces to hyphens, lowercase)
// For example: "WaterBrush" becomes "waterbrush", "Open Sans" becomes "open-sans"
// Use isFontAvailable() to check if a font is supported before loading

import { getAvailableFonts } from '@remotion/google-fonts';

const availableFonts = getAvailableFonts();

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

// Key map for loaded fonts - stores fontFamily CSS values directly
const loadedFonts = new Map<string, string>();

/**
 * Load a Google Font dynamically using dynamic imports
 * @param fontFamily - The font family name (e.g., 'Inter', 'Roboto')
 * @param options - Font loading options
 * @returns Promise that resolves with the fontFamily CSS value
 */
export const loadGoogleFont = async (
  fontFamily: string,
  options: FontLoadingOptions = {}
): Promise<string> => {
  // Validate input
  if (!fontFamily || typeof fontFamily !== 'string' || fontFamily === '') {
    console.warn('Invalid fontFamily provided:', fontFamily);
    return 'sans-serif';
  }

  const fontKey = `${fontFamily}-${JSON.stringify(options)}`;

  // Return cached fontFamily if already loaded
  if (loadedFonts.has(fontKey)) {
    return loadedFonts.get(fontKey)!;
  }

  try {
    // Normalize font family name for import path
    // Convert spaces to hyphens and ensure proper casing

    console.log('availableFonts', availableFonts);
    // Dynamic import of the specific font package
    const thisFont = availableFonts.find(
      (font) => font.importName === fontFamily
    );

    console.log('thisFont', thisFont);

    if (thisFont?.load) {
      const fontPackage = await thisFont.load();

      const allFontStuff = fontPackage.loadFont('normal', {
        subsets: options.subsets || ['latin'],
        weights: options.weights || ['400'],
      });

      console.log('loadedFontFamily', allFontStuff.fontFamily);

      await allFontStuff.waitUntilDone();

      // Store the fontFamily CSS value in the map
      loadedFonts.set(fontKey, allFontStuff.fontFamily);
      return allFontStuff.fontFamily;
    } else {
      throw new Error(
        `Font Package @remotion/google-fonts/${fontFamily} does not have loadFont method`
      );
    }
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily}:`, error);

    // Try alternative import paths for common font naming variations
    try {
      const alternativeNames = [
        fontFamily.toLowerCase().replace(/\s+/g, ''),
        fontFamily.toLowerCase().replace(/\s+/g, '-'),
        fontFamily.toLowerCase().replace(/\s+/g, '_'),
      ];

      for (const altName of alternativeNames) {
        if (altName === fontFamily.toLowerCase().replace(/\s+/g, '-')) {
          continue; // Already tried this
        }

        try {
          const altFontPackage = await import(
            `@remotion/google-fonts/${altName}`
          );
          if (altFontPackage.loadFont) {
            const { fontFamily: loadedFontFamily } =
              await altFontPackage.loadFont('normal', {
                subsets: options.subsets || ['latin'],
                weights: options.weights || ['400'],
                display: options.display || 'swap',
                preload: options.preload !== false,
              });

            loadedFonts.set(fontKey, loadedFontFamily);
            return loadedFontFamily;
          }
        } catch (altError) {
          // Continue to next alternative
          continue;
        }
      }
    } catch (altError) {
      // All alternatives failed, continue to fallback
    }

    // Fallback to system fonts
    const fallbackFontFamily = `"${fontFamily}"`;
    loadedFonts.set(fontKey, fallbackFontFamily);
    return fallbackFontFamily;
  }
};

/**
 * Load multiple fonts in parallel
 * @param fonts - Array of font configurations
 * @returns Promise that resolves with a map of font family names to CSS values
 */
export const loadMultipleFonts = async (
  fonts: Array<{ family: string; options?: FontLoadingOptions }>
): Promise<Map<string, string>> => {
  const loadPromises = fonts.map(async ({ family, options }) => {
    const fontFamily = await loadGoogleFont(family, options);
    return { family, fontFamily };
  });

  const results = await Promise.all(loadPromises);
  const fontMap = new Map<string, string>();

  results.forEach(({ family, fontFamily }) => {
    fontMap.set(family, fontFamily);
  });

  return fontMap;
};

/**
 * Get font family CSS value from cache
 * @param fontFamily - The font family name
 * @param options - Font loading options
 * @returns CSS font-family value or undefined if not loaded
 */
export const getLoadedFontFamily = (
  fontFamily: string,
  options: FontLoadingOptions = {}
): string | undefined => {
  const fontKey = `${fontFamily}-${JSON.stringify(options)}`;
  return loadedFonts.get(fontKey);
};

/**
 * Preload common fonts for better performance
 */
export const preloadCommonFonts = async (): Promise<Map<string, string>> => {
  const commonFonts = [
    { family: 'Inter', options: { weights: ['400', '500', '600', '700'] } },
    { family: 'Roboto', options: { weights: ['400', '500', '700'] } },
    { family: 'Open Sans', options: { weights: ['400', '600', '700'] } },
    { family: 'Lato', options: { weights: ['400', '700'] } },
  ];

  return await loadMultipleFonts(commonFonts);
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

/**
 * Get all loaded fonts
 * @returns Map of loaded fonts
 */
export const getLoadedFonts = (): Map<string, string> => {
  return new Map(loadedFonts);
};

/**
 * Check if a font is available in @remotion/google-fonts
 * @param fontFamily - The font family name to check
 * @returns Promise that resolves to boolean indicating if font is available
 */
export const isFontAvailable = async (fontFamily: string): Promise<boolean> => {
  if (!fontFamily || typeof fontFamily !== 'string') {
    return false;
  }

  try {
    const normalizedFontName = fontFamily
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase();

    const fontPackage = await import(
      `@remotion/google-fonts/${normalizedFontName}`
    );
    return !!fontPackage.loadFont;
  } catch (error) {
    return false;
  }
};

/**
 * Get normalized font name for import
 * @param fontFamily - The font family name
 * @returns Normalized font name suitable for import
 */
export const getNormalizedFontName = (fontFamily: string): string => {
  if (!fontFamily || typeof fontFamily !== 'string') {
    return '';
  }

  return fontFamily.trim().replace(/\s+/g, '-').toLowerCase();
};
