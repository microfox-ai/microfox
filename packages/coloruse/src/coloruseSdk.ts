import { ColorRgbUtility, RGB } from './colorUtility';

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

export class ColorPicker {
  async extractPaletteFromImageData(
    imageData: Uint8ClampedArray | string | ArrayBuffer,
    options: {
      deltaEThreshold?: number;
      paletteSize?: number;
      enableLogs?: boolean;
    } = { enableLogs: false }
  ): Promise<ExtractedPalette> {
    const {
      deltaEThreshold = 0.5,
      paletteSize = 12,
      enableLogs = false,
    } = options;
    const logs: string[] = [];

    const log = (message: string) => {
      if (enableLogs) {
        logs.push(message);
      }
    };

    let palette: string[] = [];
    let dominantColor: string | undefined = undefined;
    let secondaryColor: string | undefined = undefined;
    let accentColor: string | undefined = undefined;
    let accessibility: AccessibilityInfo | undefined = undefined;

    try {
      log(
        `Starting palette extraction. Options: deltaEThreshold=${deltaEThreshold}, paletteSize=${paletteSize}`
      );

      let imageDataArray: Uint8ClampedArray;
      if (typeof imageData === 'string') {
        if (imageData.startsWith('http')) {
          log(`Input is an image URL. Fetching: ${imageData}`);
          const response = await fetch(encodeURI(imageData.trim()));
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          if (!response.body) {
            throw new Error('Response body is null');
          }
          const chunks = [];
          for await (const chunk of response.body) {
            chunks.push(chunk);
          }
          const imageBuffer = Buffer.concat(chunks);
          imageDataArray = new Uint8ClampedArray(imageBuffer);
          log('Successfully fetched and converted image to Uint8ClampedArray.');
        } else {
          log('Input is a base64 string. Decoding...');
          const buffer = Buffer.from(imageData, 'base64');
          imageDataArray = new Uint8ClampedArray(buffer);
          log(
            `Decoded base64 string to Uint8ClampedArray of length ${imageDataArray.length}.`
          );
        }
      } else if (imageData instanceof ArrayBuffer) {
        log('Input is an ArrayBuffer. Converting...');
        imageDataArray = new Uint8ClampedArray(imageData);
        log('Converted ArrayBuffer to Uint8ClampedArray.');
      } else {
        imageDataArray = imageData;
      }

      let rgbArray = ColorRgbUtility.buildRgb(imageDataArray, 5);
      log(`Built RGB array of ${rgbArray.length} sample pixels.`);

      let quantColors = ColorRgbUtility.quantization(rgbArray, 0);
      log(`Quantized colors down to ${quantColors.length} primary colors.`);

      let orderedByColor = ColorRgbUtility.orderByLuminance(quantColors);
      log('Sorted quantized colors by luminance.');

      const distinctColors: RGB[] = [];
      if (orderedByColor.length > 0) {
        distinctColors.push(orderedByColor[0]);
        const labCache = [ColorRgbUtility.rgbToLab(orderedByColor[0])];

        for (let i = 1; i < orderedByColor.length; i++) {
          if (distinctColors.length >= paletteSize) {
            log(`Reached target palette size of ${paletteSize}. Stopping.`);
            break;
          }
          const currentLab = ColorRgbUtility.rgbToLab(orderedByColor[i]);
          let isDistinct = true;

          for (const existingLab of labCache) {
            if (
              ColorRgbUtility.deltaE(currentLab, existingLab) < deltaEThreshold
            ) {
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
      log(
        `Filtered down to ${distinctColors.length} perceptually distinct colors.`
      );

      palette = distinctColors.map(ColorRgbUtility.rgbToHex);
      log(`Final palette generated: [${palette.join(', ')}]`);

      if (palette.length > 0) {
        const paletteRgb = palette.map((hex) => ({
          hex,
          rgb: ColorRgbUtility.hexToRgb(hex)!,
        }));
        const paletteHsl = paletteRgb.map((c) => ({
          ...c,
          hsl: ColorRgbUtility.rgbToHsl(c.rgb),
        }));

        const getVibrancy = (hsl: { h: number; s: number; l: number }) =>
          hsl.s * (1 - Math.abs(hsl.l - 0.5));
        paletteHsl.sort((a, b) => getVibrancy(b.hsl) - getVibrancy(a.hsl));
        const dominantInfo = paletteHsl[0];
        dominantColor = dominantInfo.hex;
        log(`Selected most vibrant color as dominantColor: ${dominantColor}`);

        const remainingColorsHsl = paletteHsl.filter(
          (c) => c.hex !== dominantColor
        );

        const dominantLuminance = dominantInfo.hsl.l;
        const remainingByLuminance = [...remainingColorsHsl].sort(
          (a, b) => b.hsl.l - a.hsl.l
        );
        const remainingBySaturation = [...remainingColorsHsl].sort(
          (a, b) => a.hsl.s - b.hsl.s
        );

        if (dominantLuminance > 0.65) {
          log(`Dominant color is BRIGHT.`);
          secondaryColor = remainingByLuminance[0]?.hex;
          log(`-> Secondary (brightest remaining): ${secondaryColor}`);
        } else if (dominantLuminance < 0.35) {
          log(`Dominant color is DARK.`);
          secondaryColor = remainingBySaturation[0]?.hex;
          log(`-> Secondary (most muted): ${secondaryColor}`);
        } else {
          log(`Dominant color is MUTED.`);
          secondaryColor = remainingBySaturation[0]?.hex;
          log(`-> Secondary (most muted): ${secondaryColor}`);
        }

        const accentCandidates = paletteHsl.filter(
          (c) => c.hex !== dominantColor && c.hex !== secondaryColor
        );

        if (accentCandidates.length > 0) {
          const candidatesWithScores = accentCandidates.map((c) => ({
            ...c,
            vibrancyScore: c.hsl.s * (1 - Math.abs(c.hsl.l - 0.5)),
            contrastWithDominant: ColorRgbUtility.getContrastRatio(
              c.rgb,
              dominantInfo.rgb
            ),
          }));

          candidatesWithScores.sort((a, b) => {
            const aHasGoodContrast = a.contrastWithDominant >= 3.0;
            const bHasGoodContrast = b.contrastWithDominant >= 3.0;

            if (aHasGoodContrast && !bHasGoodContrast) return -1;
            if (!aHasGoodContrast && bHasGoodContrast) return 1;

            return b.vibrancyScore - a.vibrancyScore;
          });

          accentColor = candidatesWithScores[0]?.hex;
          log(
            `-> Accent (most striking with good contrast): ${accentColor} (vibrancy: ${candidatesWithScores[0]?.vibrancyScore.toFixed(3)}, contrast: ${candidatesWithScores[0]?.contrastWithDominant.toFixed(2)})`
          );
        }

        const dominantRgb = ColorRgbUtility.hexToRgb(dominantColor);
        if (dominantRgb) {
          const black = { r: 0, g: 0, b: 0 };
          const white = { r: 255, g: 255, b: 255 };
          const contrastWithBlack = ColorRgbUtility.getContrastRatio(
            dominantRgb,
            black
          );
          const contrastWithWhite = ColorRgbUtility.getContrastRatio(
            dominantRgb,
            white
          );

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
          log(
            `Accessibility color is ${
              accessibility.color
            } with contrast ${accessibility.contrastRatio.toFixed(2)}.`
          );
        }
      }
    } catch (e: any) {
      log(`ERROR during palette extraction: ${e.message || 'Unknown error'}`);
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
}
