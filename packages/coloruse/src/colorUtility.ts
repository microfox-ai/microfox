export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };
export type LAB = { l: number; a: number; b: number };

export class ColorRgbUtility {
  static hexToRgb(hex: string): RGB | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static getLuminance(rgb: RGB): number {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  static getContrastRatio(rgb1: RGB, rgb2: RGB): number {
    const lum1 = this.getLuminance(rgb1);
    const lum2 = this.getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  static rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    return { h, s, l };
  }

  static rgbToLab(rgb: RGB): LAB {
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
  }

  static deltaE(labA: LAB, labB: LAB): number {
    const deltaL = labA.l - labB.l;
    const deltaA = labA.a - labB.a;
    const deltaB = labA.b - labB.b;
    return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
  }

  static rgbToHex(pixel: RGB): string {
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
  }

  static buildRgb(imageData: Uint8ClampedArray, sampleRate: number = 5): RGB[] {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += sampleRate * 4) {
      rgbValues.push({
        r: imageData[i],
        g: imageData[i + 1],
        b: imageData[i + 2],
      });
    }
    return rgbValues;
  }

  private static findBiggestColorRange(rgbValues: RGB[]): keyof RGB {
    let rMin = Number.MAX_VALUE,
      gMin = Number.MAX_VALUE,
      bMin = Number.MAX_VALUE;
    let rMax = Number.MIN_VALUE,
      gMax = Number.MIN_VALUE,
      bMax = Number.MIN_VALUE;

    rgbValues.forEach((pixel) => {
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
  }

  static quantization(rgbValues: RGB[], depth: number): RGB[] {
    const MAX_DEPTH = 5;

    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev, curr) => {
          prev.r += curr.r;
          prev.g += curr.g;
          prev.b += curr.b;
          return prev;
        },
        { r: 0, g: 0, b: 0 }
      );
      color.r = Math.round(color.r / rgbValues.length);
      color.g = Math.round(color.g / rgbValues.length);
      color.b = Math.round(color.b / rgbValues.length);
      return [color];
    }

    const componentToSortBy = this.findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

    const mid = Math.floor(rgbValues.length / 2);
    return [
      ...this.quantization(rgbValues.slice(0, mid), depth + 1),
      ...this.quantization(rgbValues.slice(mid), depth + 1),
    ];
  }

  static hslToRgb(hsl: HSL): RGB {
    const { h, s, l } = hsl;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h / 360 + 1 / 3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, h / 360 - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  static orderByLuminance(rgbValues: RGB[]): RGB[] {
    const calculateLuminance = (p: RGB) =>
      0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    return rgbValues.sort(
      (p1, p2) => calculateLuminance(p2) - calculateLuminance(p1)
    );
  }
}

export class ColHexUtility {
  static getHex(rgb: RGB): string {
    return `#${rgb.r.toString(16)}${rgb.g.toString(16)}${rgb.b.toString(16)}`;
  }

  static getHexFromHsl(hsl: HSL): string {
    return `#${hsl.h.toString(16)}${hsl.s.toString(16)}${hsl.l.toString(16)}`;
  }

  static getHexFromLab(lab: LAB): string {
    return `#${lab.l.toString(16)}${lab.a.toString(16)}${lab.b.toString(16)}`;
  }

  static hexToRgb(hex: string): RGB {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  }

  static hexToHsl(hex: string): HSL {
    return ColorRgbUtility.rgbToHsl(
      ColorRgbUtility.hexToRgb(hex) || { r: 0, g: 0, b: 0 }
    );
  }

  static hexToLab(hex: string): LAB {
    return ColorRgbUtility.rgbToLab(
      ColorRgbUtility.hexToRgb(hex) || { r: 0, g: 0, b: 0 }
    );
  }

  static getContrastRatio(hex1: string, hex2: string): number {
    return ColorRgbUtility.getContrastRatio(
      ColorRgbUtility.hexToRgb(hex1) || { r: 0, g: 0, b: 0 },
      ColorRgbUtility.hexToRgb(hex2) || { r: 0, g: 0, b: 0 }
    );
  }

  static getLuminance(hex: string): number {
    return ColorRgbUtility.getLuminance(
      ColorRgbUtility.hexToRgb(hex) || { r: 0, g: 0, b: 0 }
    );
  }

  static getBrightestColor(hexes: string[]): string {
    return hexes.reduce((max, hex) => {
      return this.getLuminance(hex) > this.getLuminance(max) ? hex : max;
    }, hexes[0]);
  }

  static getDarkestColor(hexes: string[]): string {
    return hexes.reduce((min, hex) => {
      return this.getLuminance(hex) < this.getLuminance(min) ? hex : min;
    }, hexes[0]);
  }

  static getContrastColor(
    hex: string,
    options: {
      fromPalette?: string[];
      deltaEThreshold?: number;
    } = {}
  ): string {
    const { fromPalette, deltaEThreshold } = options;

    const baseRgb = ColorRgbUtility.hexToRgb(hex);
    if (!baseRgb) {
      return '#FFFFFF'; // Default for invalid input hex
    }

    let paletteToUse = fromPalette;

    if (paletteToUse && deltaEThreshold && deltaEThreshold > 0) {
      const baseLab = ColorRgbUtility.rgbToLab(baseRgb);
      paletteToUse = paletteToUse.filter((colorHex) => {
        const candidateRgb = ColorRgbUtility.hexToRgb(colorHex);
        if (!candidateRgb) return false;
        const candidateLab = ColorRgbUtility.rgbToLab(candidateRgb);
        const delta = ColorRgbUtility.deltaE(baseLab, candidateLab);
        return delta >= deltaEThreshold;
      });
    }

    if (paletteToUse && paletteToUse.length > 0) {
      let bestContrastColor: string | null = null;
      let maxContrastRatio = -1;

      for (const colorHex of paletteToUse) {
        const candidateRgb = ColorRgbUtility.hexToRgb(colorHex);
        if (candidateRgb) {
          const ratio = ColorRgbUtility.getContrastRatio(baseRgb, candidateRgb);
          if (ratio > maxContrastRatio) {
            maxContrastRatio = ratio;
            bestContrastColor = colorHex;
          }
        }
      }
      if (bestContrastColor) {
        return bestContrastColor;
      }
    }

    const luminance = ColorRgbUtility.getLuminance(baseRgb);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  static getVibrantColor(hex: string): string {
    const hsl = this.hexToHsl(hex);
    hsl.s = Math.min(hsl.s * 1.5, 1);
    const rgb = ColorRgbUtility.hslToRgb(hsl);
    return ColorRgbUtility.rgbToHex(rgb);
  }

  static getMutedColor(hex: string): string {
    const hsl = this.hexToHsl(hex);
    hsl.s *= 0.5;
    const rgb = ColorRgbUtility.hslToRgb(hsl);
    return ColorRgbUtility.rgbToHex(rgb);
  }

  static getAccentColor(hex: string): string {
    const hsl = this.hexToHsl(hex);
    hsl.h = (hsl.h + 180) % 360;
    const rgb = ColorRgbUtility.hslToRgb(hsl);
    return ColorRgbUtility.rgbToHex(rgb);
  }
}
