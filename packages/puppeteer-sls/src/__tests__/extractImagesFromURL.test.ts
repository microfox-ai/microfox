import { describe, it, expect } from 'vitest';
import { extractImagesFromURL } from '../functions/extractImages';

describe(
  'extractImagesFromURL',
  () => {
    it('should extract images from a given URL', async () => {
      const options = {
        url: 'https://uk.pinterest.com/search/pins/?q=anime%20cyberpunk%20running&rs=typed',
        isLocal: true,
        headless: true,
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
  },
  { timeout: 50000 },
);
