/**
 * Color extraction helpers for use in Puppeteer and other contexts
 * Accepts imageData (Uint8ClampedArray) and returns palette, dominantColor, secondaryColor, and accentColor as hex strings
 *
 * The algorithm follows these steps:
 * 1. Sample pixels from image data for performance
 * 2. Use Median Cut quantization to reduce colors to manageable palette
 * 3. Sort by luminance for predictable filtering
 * 4. Filter out perceptually similar colors using CIELAB Delta E
 * 5. Select dominant, secondary, and accent colors based on vibrancy and contrast rules
 */

export interface AccessibilityInfo {
  color: string; // Hex color that provides best contrast with dominant color
  contrastRatio: number; // WCAG contrast ratio (should be >= 4.5 for AA compliance)
}

export interface ExtractedPalette {
  palette: string[]; // Array of distinct hex colors from the image
  dominantColor: string | undefined; // Most vibrant/striking color in the palette
  secondaryColor: string | undefined; // Complementary color based on dominant characteristics
  accentColor?: string | undefined; // Median appearance color with good contrast and luminance
  accessibility?: AccessibilityInfo; // Best contrast color for accessibility
  logs?: string[]; // Debug logs showing the extraction process
}

export function extractPaletteFromImageData(
  imageData: Uint8ClampedArray,
  options: {
    deltaEThreshold?: number; // Threshold for CIELAB Delta E color similarity (default: 4)
    paletteSize?: number; // Maximum number of colors in final palette (default: 12)
  } = {},
): ExtractedPalette {
  const { deltaEThreshold = 0.5, paletteSize = 12 } = options;
  const logs: string[] = [];

  // --- Color science helper functions ---
  /**
   * Converts hex color string to RGB object
   * @param hex - Hex color string (e.g., "#FF0000" or "FF0000")
   * @returns RGB object or null if invalid hex
   */
  const hexToRgb = (
    hex: string,
  ): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };
  /**
   * Calculates relative luminance of an RGB color (WCAG 2.1 formula)
   * Used for contrast ratio calculations
   * @param rgb - RGB color object
   * @returns Luminance value between 0 and 1
   */
  const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  /**
   * Calculates contrast ratio between two RGB colors (WCAG 2.1 formula)
   * @param rgb1 - First RGB color
   * @param rgb2 - Second RGB color
   * @returns Contrast ratio (1:1 = no contrast, 21:1 = maximum contrast)
   */
  const getContrastRatio = (
    rgb1: { r: number; g: number; b: number },
    rgb2: { r: number; g: number; b: number },
  ): number => {
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };
  /**
   * Converts RGB color to HSL (Hue, Saturation, Lightness)
   * Used for color analysis and vibrancy calculations
   * @param rgb - RGB color object
   * @returns HSL object with h (0-360), s (0-1), l (0-1)
   */
  const rgbToHsl = (rgb: { r: number; g: number; b: number }) => {
    // Make r, g, and b fractions of 1
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    // Find greatest and smallest channel values
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    // Calculate hue (0-360 degrees)
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Calculate lightness (0-1, where 0 is black, 1 is white)
    l = (cmax + cmin) / 2;

    // Calculate saturation (0-1, where 0 is grayscale, 1 is fully saturated)
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
  };
  /**
   * Converts RGB color to CIELAB color space
   * Used for perceptual color difference calculations (Delta E)
   * @param rgb - RGB color object
   * @returns LAB object with l (lightness), a (green-red), b (blue-yellow)
   */
  const rgbToLab = (rgb: { r: number; g: number; b: number }) => {
    let r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
    // Gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    // Convert to XYZ color space
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    // Normalize to D65 illuminant
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    // Convert to LAB
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return { l: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
  };

  /**
   * Calculates CIELAB Delta E (perceptual color difference)
   * Used to determine if two colors are perceptually similar
   * @param labA - First LAB color
   * @param labB - Second LAB color
   * @returns Delta E value (0 = identical, higher = more different)
   */
  const deltaE = (
    labA: { l: number; a: number; b: number },
    labB: { l: number; a: number; b: number },
  ) => {
    const deltaL = labA.l - labB.l;
    const deltaA = labA.a - labB.a;
    const deltaB = labA.b - labB.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  };

  /**
   * Converts RGB color to hex string
   * @param pixel - RGB color object
   * @returns Hex color string (e.g., "#FF0000")
   */
  const rgbToHex = (pixel: { r: number; g: number; b: number }) => {
    const componentToHex = (c: number) => {
      const hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    };
    return (
      '#' +
      componentToHex(pixel.r) +
      componentToHex(pixel.g) +
      componentToHex(pixel.b)
    ).toUpperCase();
  };

  /**
   * Extracts RGB values from image data with sampling for performance
   * @param imageData - Raw image pixel data (RGBA format)
   * @param sampleRate - How many pixels to skip (higher = faster but less accurate)
   * @returns Array of RGB color objects
   */
  const buildRgb = (imageData: Uint8ClampedArray, sampleRate: number = 5) => {
    const rgbValues = [];
    // Sample pixels for performance, iterating by sampleRate * 4 (RGBA = 4 bytes per pixel)
    for (let i = 0; i < imageData.length; i += sampleRate * 4) {
      rgbValues.push({
        r: imageData[i], // Red channel
        g: imageData[i + 1], // Green channel
        b: imageData[i + 2], // Blue channel
        // Note: Alpha channel (i + 3) is ignored
      });
    }
    return rgbValues;
  };

  /**
   * Finds the color channel (R, G, or B) with the largest range
   * Used by Median Cut quantization algorithm
   * @param rgbValues - Array of RGB colors
   * @returns Channel name with biggest range ('r', 'g', or 'b')
   */
  const findBiggestColorRange = (
    rgbValues: { r: number; g: number; b: number }[],
  ) => {
    let rMin = Number.MAX_VALUE,
      gMin = Number.MAX_VALUE,
      bMin = Number.MAX_VALUE;
    let rMax = Number.MIN_VALUE,
      gMax = Number.MIN_VALUE,
      bMax = Number.MIN_VALUE;

    // Find min/max values for each channel
    rgbValues.forEach(pixel => {
      rMin = Math.min(rMin, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      bMin = Math.min(bMin, pixel.b);
      rMax = Math.max(rMax, pixel.r);
      gMax = Math.max(gMax, pixel.g);
      bMax = Math.max(bMax, pixel.b);
    });

    // Calculate ranges and return channel with largest range
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) return 'r';
    if (biggestRange === gRange) return 'g';
    return 'b';
  };

  /**
   * Median Cut quantization algorithm
   * Recursively splits color space to create a palette of representative colors
   * @param rgbValues - Array of RGB colors to quantize
   * @param depth - Current recursion depth (0-5)
   * @returns Array of quantized RGB colors
   */
  const quantization = (
    rgbValues: { r: number; g: number; b: number }[],
    depth: number,
  ): { r: number; g: number; b: number }[] => {
    const MAX_DEPTH = 5; // Maximum recursion depth for performance

    // Base case: stop recursion or return average color
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev.r += curr.r;
          prev.g += curr.g;
          prev.b += curr.b;
          return prev;
        },
        { r: 0, g: 0, b: 0 },
      );
      // Calculate average color
      color.r = Math.round(color.r / rgbValues.length);
      color.g = Math.round(color.g / rgbValues.length);
      color.b = Math.round(color.b / rgbValues.length);
      return [color];
    }

    // Find channel with biggest range and sort by it
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

    // Split at median and recurse
    const mid = Math.floor(rgbValues.length / 2);
    return [
      ...quantization(rgbValues.slice(0, mid), depth + 1),
      ...quantization(rgbValues.slice(mid), depth + 1),
    ];
  };

  /**
   * Sorts colors by luminance (brightness) in descending order
   * @param rgbValues - Array of RGB colors
   * @returns Sorted array (brightest first)
   */
  const orderByLuminance = (
    rgbValues: { r: number; g: number; b: number }[],
  ) => {
    const calculateLuminance = (p: { r: number; g: number; b: number }) =>
      0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b; // Standard luminance formula
    return rgbValues.sort(
      (p1, p2) => calculateLuminance(p2) - calculateLuminance(p1),
    );
  };
  // --- End helpers ---

  // Initialize result variables
  let palette: string[] = [];
  let dominantColor: string | undefined = undefined;
  let secondaryColor: string | undefined = undefined;
  let accentColor: string | undefined = undefined;
  let accessibility: AccessibilityInfo | undefined = undefined;

  try {
    logs.push(
      `Starting palette extraction. Options: deltaEThreshold=${deltaEThreshold}, paletteSize=${paletteSize}`,
    );

    // Step 1: Build a list of RGB values from the image data, sampling for performance
    let rgbArray = buildRgb(imageData, 5);
    logs.push(`Built RGB array of ${rgbArray.length} sample pixels.`);

    // Step 2: Reduce the number of colors to a manageable palette using Median Cut quantization
    let quantColors = quantization(rgbArray, 0);
    logs.push(`Quantized colors down to ${quantColors.length} primary colors.`);

    // Step 3: Sort the palette by luminance (brightness) to handle filtering predictably
    let orderedByColor = orderByLuminance(quantColors);
    logs.push('Sorted quantized colors by luminance.');

    // Step 4: Filter out colors that are too perceptually similar using CIELAB Delta E
    const distinctColors: { r: number; g: number; b: number }[] = [];
    if (orderedByColor.length > 0) {
      distinctColors.push(orderedByColor[0]); // Always include the first (brightest) color
      const labCache = [rgbToLab(orderedByColor[0])]; // Cache LAB values for performance

      for (let i = 1; i < orderedByColor.length; i++) {
        if (distinctColors.length >= paletteSize) {
          logs.push(`Reached target palette size of ${paletteSize}. Stopping.`);
          break;
        }
        const currentLab = rgbToLab(orderedByColor[i]);
        let isDistinct = true;

        // Check against all previously accepted distinct colors
        for (const existingLab of labCache) {
          if (deltaE(currentLab, existingLab) < deltaEThreshold) {
            isDistinct = false;
            break; // Color is too similar, skip it
          }
        }

        if (isDistinct) {
          distinctColors.push(orderedByColor[i]);
          labCache.push(currentLab);
        }
      }
    }
    logs.push(
      `Filtered down to ${distinctColors.length} perceptually distinct colors.`,
    );

    // Step 5: Convert the final list of distinct RGB colors to hex strings
    palette = distinctColors.map(rgbToHex);
    logs.push(`Final palette generated: [${palette.join(', ')}]`);

    // Step 6: Select dominant, secondary, and accent colors based on vibrancy and contrast rules
    if (palette.length > 0) {
      // Convert palette to RGB and HSL for analysis
      const paletteRgb = palette.map(hex => ({ hex, rgb: hexToRgb(hex)! }));
      const paletteHsl = paletteRgb.map(c => ({ ...c, hsl: rgbToHsl(c.rgb) }));

      // a) Find the most "striking" color as dominant (highest vibrancy score)
      const getVibrancy = (hsl: { h: number; s: number; l: number }) =>
        hsl.s * (1 - Math.abs(hsl.l - 0.5)); // Higher for balanced saturation/luminance
      paletteHsl.sort((a, b) => getVibrancy(b.hsl) - getVibrancy(a.hsl));
      const dominantInfo = paletteHsl[0];
      dominantColor = dominantInfo.hex;
      logs.push(
        `Selected most vibrant color as dominantColor: ${dominantColor}`,
      );

      // Create a pool of remaining colors (excluding dominant)
      const remainingColorsHsl = paletteHsl.filter(
        c => c.hex !== dominantColor,
      );

      // b) Classify the dominant color and apply rules for secondary color selection
      const dominantLuminance = dominantInfo.hsl.l;
      const remainingByLuminance = [...remainingColorsHsl].sort(
        (a, b) => b.hsl.l - a.hsl.l,
      ); // Brightest first
      const remainingBySaturation = [...remainingColorsHsl].sort(
        (a, b) => a.hsl.s - b.hsl.s,
      ); // Muted first

      // Select secondary color based on dominant color characteristics
      if (dominantLuminance > 0.65) {
        // --- Dominant is BRIGHT ---
        logs.push(`Dominant color is BRIGHT.`);
        secondaryColor = remainingByLuminance[0]?.hex; // Next brightest
        logs.push(`-> Secondary (brightest remaining): ${secondaryColor}`);
      } else if (dominantLuminance < 0.35) {
        // --- Dominant is DARK ---
        logs.push(`Dominant color is DARK.`);
        secondaryColor = remainingBySaturation[0]?.hex; // Most muted
        logs.push(`-> Secondary (most muted): ${secondaryColor}`);
      } else {
        // --- Dominant is MUTED/MID-TONE ---
        logs.push(`Dominant color is MUTED.`);
        secondaryColor = remainingBySaturation[0]?.hex; // Most muted
        logs.push(`-> Secondary (most muted): ${secondaryColor}`);
      }

      // c) Select accent color with good contrast, luminance, and median appearance
      // Filter out dominant and secondary colors to find median appearance
      const accentCandidates = paletteHsl.filter(
        c => c.hex !== dominantColor && c.hex !== secondaryColor,
      );

      if (accentCandidates.length > 0) {
        // Calculate vibrancy score for each candidate (saturation * luminance balance)
        const candidatesWithScores = accentCandidates.map(c => ({
          ...c,
          vibrancyScore: c.hsl.s * (1 - Math.abs(c.hsl.l - 0.5)), // Higher for balanced saturation/luminance
          contrastWithDominant: getContrastRatio(c.rgb, dominantInfo.rgb),
        }));

        // Sort by vibrancy score (most striking first) and ensure good contrast
        candidatesWithScores.sort((a, b) => {
          // Prioritize good contrast with dominant color (minimum 3:1 ratio)
          const aHasGoodContrast = a.contrastWithDominant >= 3.0;
          const bHasGoodContrast = b.contrastWithDominant >= 3.0;

          if (aHasGoodContrast && !bHasGoodContrast) return -1;
          if (!aHasGoodContrast && bHasGoodContrast) return 1;

          // If both have good contrast, sort by vibrancy
          return b.vibrancyScore - a.vibrancyScore;
        });

        // Select the most striking color with good contrast as accent
        accentColor = candidatesWithScores[0]?.hex;
        logs.push(
          `-> Accent (most striking with good contrast): ${accentColor} (vibrancy: ${candidatesWithScores[0]?.vibrancyScore.toFixed(3)}, contrast: ${candidatesWithScores[0]?.contrastWithDominant.toFixed(2)})`,
        );
      }

      // d) Calculate accessibility color (best contrast option: black or white)
      const dominantRgb = hexToRgb(dominantColor);
      if (dominantRgb) {
        const black = { r: 0, g: 0, b: 0 };
        const white = { r: 255, g: 255, b: 255 };
        const contrastWithBlack = getContrastRatio(dominantRgb, black);
        const contrastWithWhite = getContrastRatio(dominantRgb, white);

        // Choose the color with higher contrast ratio
        if (contrastWithBlack > contrastWithWhite) {
          accessibility = {
            color: '#000000',
            contrastRatio: contrastWithBlack,
          };
        } else {
          accessibility = {
            color: '#FFFFFF',
            contrastRatio: contrastWithWhite,
          };
        }
        logs.push(
          `Accessibility color is ${
            accessibility.color
          } with contrast ${accessibility.contrastRatio.toFixed(2)}.`,
        );
      }
    }
  } catch (e: any) {
    logs.push(
      `ERROR during palette extraction: ${e.message || 'Unknown error'}`,
    );
    // ignore errors, leave colors undefined
  }
  return {
    palette,
    dominantColor,
    secondaryColor,
    accentColor,
    accessibility,
    logs,
  };
}
