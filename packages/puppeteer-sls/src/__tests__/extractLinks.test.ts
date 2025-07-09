import { describe, it, expect } from 'vitest';
import { extractLinksFromUrl } from '../functions/extractLinks';

describe(
  'extractLinksFromUrl',
  () => {
    it('should extract links from a given URL', async () => {
      // TODO: Replace with a real URL for testing
      const options = {
        url: 'https://developers.pinterest.com/docs/api/v5/introduction',
        isLocal: true,
        headless: true,
      };
      const links = await extractLinksFromUrl(options);

      console.log(links);
      expect(Array.isArray(links)).toBe(true);
      if (links.length > 0) {
        const link = links[0];
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('displayName');
        expect(link).toHaveProperty('type');
        expect(link).toHaveProperty('inPageLink');
        expect(link).toHaveProperty('externalLink');
        expect(link).toHaveProperty('internalLink');
      }
    });
  },
  { timeout: 50000 },
);
