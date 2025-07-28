import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from '../src/coloruseSdk';

// Mocking fetch for tests

describe('ColorPicker', () => {
  it('should extract a palette from an image URL', async () => {
    const picker = new ColorPicker();
    const mockImageData = new ArrayBuffer(8);

    const result = await picker.extractPaletteFromImageData(
      'https://i.pinimg.com/736x/d1/f6/42/d1f642531c6ca000ead1444124a69f32.jpg'
    );

    //console.log(result);
    expect(result.palette).toBeInstanceOf(Array);
    expect(result.dominantColor).toBeDefined();
    expect(result.secondaryColor).toBeDefined();
    expect(result.accentColor).toBeDefined();
    expect(result.accessibility).toBeDefined();
  });
});
