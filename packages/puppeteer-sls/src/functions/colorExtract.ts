// Color extraction helpers for use in Puppeteer and other contexts
// Accepts imageData (Uint8ClampedArray) and returns palette, dominantColor, secondaryColor as hex strings

export interface AccessibilityInfo {
  color: string;
  contrastRatio: number;
}

export interface ExtractedPalette {
  palette: string[];
  dominantColor: string | undefined;
  secondaryColor: string | undefined;
  accentColor?: string | undefined;
  accessibility?: AccessibilityInfo;
  logs?: string[];
}

export function extractPaletteFromImageData(
  imageData: Uint8ClampedArray,
  options: {
    deltaEThreshold?: number;
    paletteSize?: number;
  } = {},
): ExtractedPalette {
  const { deltaEThreshold = 4, paletteSize = 12 } = options;
  const logs: string[] = [];
  // --- Color science helpers ---
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
  const getLuminance = (rgb: { r: number; g: number; b: number }): number => {
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

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

    // Calculate hue
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
  };
  const rgbToLab = (rgb: { r: number; g: number; b: number }) => {
    let r = rgb.r / 255,
      g = rgb.g / 255,
      b = rgb.b / 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    let z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    return { l: 116 * y - 16, a: 500 * (x - y), b: 200 * (y - z) };
  };

  const deltaE = (
    labA: { l: number; a: number; b: number },
    labB: { l: number; a: number; b: number },
  ) => {
    const deltaL = labA.l - labB.l;
    const deltaA = labA.a - labB.a;
    const deltaB = labA.b - labB.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  };

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

  const buildRgb = (imageData: Uint8ClampedArray, sampleRate: number = 5) => {
    const rgbValues = [];
    // Sample pixels for performance, iterating by sampleRate * 4
    for (let i = 0; i < imageData.length; i += sampleRate * 4) {
      rgbValues.push({
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      });
    }
    return rgbValues;
  };
  const findBiggestColorRange = (
    rgbValues: { r: number; g: number; b: number }[],
  ) => {
    let rMin = Number.MAX_VALUE,
      gMin = Number.MAX_VALUE,
      bMin = Number.MAX_VALUE;
    let rMax = Number.MIN_VALUE,
      gMax = Number.MIN_VALUE,
      bMax = Number.MIN_VALUE;
    rgbValues.forEach(pixel => {
      rMin = Math.min(rMin, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      bMin = Math.min(bMin, pixel.b);
      rMax = Math.max(rMax, pixel.r);
      gMax = Math.max(gMax, pixel.g);
      bMax = Math.max(bMax, pixel.b);
    });
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) return 'r';
    if (biggestRange === gRange) return 'g';
    return 'b';
  };
  const quantization = (
    rgbValues: { r: number; g: number; b: number }[],
    depth: number,
  ): { r: number; g: number; b: number }[] => {
    const MAX_DEPTH = 5; // Increased depth for more initial colors
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
      color.r = Math.round(color.r / rgbValues.length);
      color.g = Math.round(color.g / rgbValues.length);
      color.b = Math.round(color.b / rgbValues.length);
      return [color];
    }
    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);
    const mid = Math.floor(rgbValues.length / 2);
    return [
      ...quantization(rgbValues.slice(0, mid), depth + 1),
      ...quantization(rgbValues.slice(mid), depth + 1),
    ];
  };
  const orderByLuminance = (
    rgbValues: { r: number; g: number; b: number }[],
  ) => {
    const calculateLuminance = (p: { r: number; g: number; b: number }) =>
      0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    return rgbValues.sort(
      (p1, p2) => calculateLuminance(p2) - calculateLuminance(p1),
    );
  };
  // --- End helpers ---
  let palette: string[] = [];
  let dominantColor: string | undefined = undefined;
  let secondaryColor: string | undefined = undefined;
  let accentColor: string | undefined = undefined;
  let accessibility: AccessibilityInfo | undefined = undefined;
  try {
    logs.push(
      `Starting palette extraction. Options: deltaEThreshold=${deltaEThreshold}, paletteSize=${paletteSize}`,
    );
    // 1. Build a list of RGB values from the image data, sampling for performance.
    let rgbArray = buildRgb(imageData, 5);
    logs.push(`Built RGB array of ${rgbArray.length} sample pixels.`);

    // 2. Reduce the number of colors to a manageable palette using Median Cut.
    let quantColors = quantization(rgbArray, 0);
    logs.push(`Quantized colors down to ${quantColors.length} primary colors.`);

    // 3. Sort the palette by luminance (brightness) to handle filtering predictably.
    let orderedByColor = orderByLuminance(quantColors);
    logs.push('Sorted quantized colors by luminance.');

    // 4. Filter out colors that are too perceptually similar using CIELAB Delta E.
    const distinctColors: { r: number; g: number; b: number }[] = [];
    if (orderedByColor.length > 0) {
      distinctColors.push(orderedByColor[0]);
      const labCache = [rgbToLab(orderedByColor[0])];

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
            break;
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

    // 5. Convert the final list of distinct RGB colors to hex strings.
    palette = distinctColors.map(rgbToHex);
    logs.push(`Final palette generated: [${palette.join(', ')}]`);

    // 6. Select dominant, secondary, and accent colors based on the new rules.
    if (palette.length > 0) {
      const paletteRgb = palette.map(hex => ({ hex, rgb: hexToRgb(hex)! }));
      const paletteHsl = paletteRgb.map(c => ({ ...c, hsl: rgbToHsl(c.rgb) }));

      // a) Find the most "striking" color as dominant.
      const getVibrancy = (hsl: { h: number; s: number; l: number }) =>
        hsl.s * (1 - Math.abs(hsl.l - 0.5));
      paletteHsl.sort((a, b) => getVibrancy(b.hsl) - getVibrancy(a.hsl));
      const dominantInfo = paletteHsl[0];
      dominantColor = dominantInfo.hex;
      logs.push(
        `Selected most vibrant color as dominantColor: ${dominantColor}`,
      );

      // Create a pool of remaining colors
      const remainingColorsHsl = paletteHsl.filter(
        c => c.hex !== dominantColor,
      );

      // b) Classify the dominant color and apply rules.
      const dominantLuminance = dominantInfo.hsl.l;
      const remainingByLuminance = [...remainingColorsHsl].sort(
        (a, b) => b.hsl.l - a.hsl.l,
      ); // Brightest first
      const remainingBySaturation = [...remainingColorsHsl].sort(
        (a, b) => a.hsl.s - b.hsl.s,
      ); // Muted first

      if (dominantLuminance > 0.65) {
        // --- Dominant is BRIGHT ---
        logs.push(`Dominant color is BRIGHT.`);
        secondaryColor = remainingByLuminance[0]?.hex; // Next brightest
        accentColor =
          remainingByLuminance[remainingByLuminance.length - 1]?.hex; // Darkest
        logs.push(
          `-> Secondary (brightest remaining): ${secondaryColor}, Accent (darkest remaining): ${accentColor}`,
        );
      } else if (dominantLuminance < 0.35) {
        // --- Dominant is DARK ---
        logs.push(`Dominant color is DARK.`);
        secondaryColor = remainingBySaturation[0]?.hex; // Most muted
        accentColor = remainingByLuminance[0]?.hex; // Brightest
        logs.push(
          `-> Secondary (most muted): ${secondaryColor}, Accent (brightest remaining): ${accentColor}`,
        );
      } else {
        // --- Dominant is MUTED/MID-TONE ---
        logs.push(`Dominant color is MUTED.`);
        secondaryColor = remainingBySaturation[0]?.hex; // Most muted
        accentColor =
          remainingByLuminance[remainingByLuminance.length - 1]?.hex; // Darkest
        logs.push(
          `-> Secondary (most muted): ${secondaryColor}, Accent (darkest remaining): ${accentColor}`,
        );
      }

      // c) Accessibility color remains the highest contrast option (black or white).
      const dominantRgb = hexToRgb(dominantColor);
      if (dominantRgb) {
        const black = { r: 0, g: 0, b: 0 };
        const white = { r: 255, g: 255, b: 255 };
        const contrastWithBlack = getContrastRatio(dominantRgb, black);
        const contrastWithWhite = getContrastRatio(dominantRgb, white);

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
