import { describe, it, expect } from 'vitest';
import { ColorRgbUtility, ColHexUtility } from '../src/colorUtility';

describe('ColorRgbUtility', () => {
  it('should convert hex to rgb', () => {
    const rgb = ColorRgbUtility.hexToRgb('#ffffff');
    expect(rgb).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('should convert rgb to hex', () => {
    const hex = ColorRgbUtility.rgbToHex({ r: 255, g: 255, b: 255 });
    expect(hex).toBe('#FFFFFF');
  });
});

describe('ColHexUtility', () => {
  it('should return black for light colors', () => {
    const color = ColHexUtility.getContrastColor('#ffffff');
    expect(color).toBe('#000000');
  });

  it('should return white for dark colors', () => {
    const color = ColHexUtility.getContrastColor('#000000');
    expect(color).toBe('#FFFFFF');
  });
});
