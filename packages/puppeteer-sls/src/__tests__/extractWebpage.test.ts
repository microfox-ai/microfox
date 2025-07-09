import { describe, it, expect } from 'vitest';
import { extractWebpage } from '../functions/extractWebpage';

describe(
  'extractWebpage',
  () => {
    it('should extract content from a given URL', async () => {
      // TODO: Replace with a real URL for testing
      const options = {
        url: 'https://example.com',
        isLocal: true,
        headless: true,
        toMarkdown: true,
        toHTML: true,
      };
      const { content, browser, markdown, html, page } =
        await extractWebpage(options);

      expect(content).toBeTypeOf('string');
      expect(markdown).toBeTypeOf('string');
      expect(html).toBeTypeOf('string');
      expect(browser).toBeDefined();
      expect(page).toBeDefined();

      if (browser) {
        await browser.close();
      }
    });
  },
  { timeout: 50000 },
);
