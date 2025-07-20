import { describe, it, expect } from 'vitest';
import { extractImagesFromURL } from '../functions/extractImages';
import { OpenPageOptions } from '../functions/openPage';

describe(
  'extractImagesFromURL',
  () => {
    it('should extract images from a given URL', async () => {
      const options = {
        url: 'https://in.pinterest.com/pin/40673202879773183/', //'https://www.midjourney.com/explore?tab=top_month',
        isLocal: true,
        headless: true,
        waitUntil: 'networkidle0' as const,
        deepExtract: false,
        enableColorExtraction: true,
      };
      const images = await extractImagesFromURL(options);
      console.log(images);
      expect(Array.isArray(images)).toBe(true);
      expect(images.length).toBeGreaterThan(0);
      images.forEach(image => {
        expect(image).toHaveProperty('alt');
        expect(image).toHaveProperty('src');
        expect(image).toHaveProperty('srcset');
        expect(image).toHaveProperty('responsiveImages');
        if (image.responsiveImages) {
          image.responsiveImages.forEach(responsiveImage => {
            expect(responsiveImage).toHaveProperty('url');
            expect(responsiveImage).toHaveProperty('size');
          });
        }
      });
    });
    // it('should extract background images when deepExtract is true', async () => {
    //   const options = {
    //     url: 'https://www.midjourney.com/explore',
    //     isLocal: true,
    //     headless: true,
    //     deepExtract: true,
    //     waitUntil: 'networkidle0',
    //   } as OpenPageOptions & { deepExtract?: boolean };
    //   const images = await extractImagesFromURL(options);
    //   console.log(images);
    //   expect(Array.isArray(images)).toBe(true);
    //   expect(images.length).toBeGreaterThan(0);
    //   const backgroundImages = images.filter(
    //     img => img.alt && img.alt.startsWith('Background image from'),
    //   );
    //   expect(backgroundImages.length).toBeGreaterThan(0);
    //   backgroundImages.forEach(image => {
    //     expect(image).toHaveProperty('alt');
    //     expect(image.src || image.srcset).not.toBeNull();
    //   });
    // });
  },
  { timeout: 50000 },
);
