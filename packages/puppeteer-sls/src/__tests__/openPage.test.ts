import { describe, it, expect } from 'vitest';
import { openPage } from '../functions/openPage';

describe(
  'openPage',
  () => {
    it('should open a page and navigate to the URL', async () => {
      // TODO: Replace with a real URL for testing
      const options = {
        url: 'https://example.com',
        isLocal: true,
        headless: true,
      };
      const { browser, page } = await openPage(options);

      expect(browser).toBeDefined();
      expect(page).toBeDefined();
      expect(page.url()).toBe('https://example.com/');

      if (browser) {
        await browser.close();
      }
    });
  },
  { timeout: 50000 },
);
