# Efficient Web Scraping with Puppeteer-SLS

The `@microfox/puppeteer-sls` package is designed for modularity, allowing you to perform multiple web scraping tasks within a single browser session. This avoids the overhead of launching a new Puppeteer instance for every operation, making your scripts faster and more efficient.

The core pattern involves three steps:

1.  Initialize the browser and open a page using `openPage`.
2.  Pass the returned `page` object to other extraction functions (`extractLinks`, `extractImages`, `extractToMarkdown`, etc.).
3.  Close the browser when you're done.

## Example: Combining Functions

Here’s how you can open a single webpage and extract links, images, and content without re-initializing Puppeteer:

```typescript
import {
  openPage,
  extractLinks,
  extractImages,
  extractToMarkdown,
  extractHTML,
} from '@microfox/puppeteer-sls';
import { Page } from 'puppeteer-core';

// Helper to extract plain text, as an example of a custom extraction.
async function extractText(page: Page) {
  return page.evaluate(() => document.body.innerText);
}

async function scrapeWebsite(url: string) {
  // 1. Open the page once
  const { browser, page } = await openPage({
    url,
    isLocal: true,
    headless: true,
  });

  try {
    // 2. Reuse the 'page' object for multiple extractions
    const links = await extractLinks(page);
    console.log('Extracted Links (first 5):', links.slice(0, 5));

    const images = await extractImages(page);
    console.log('Extracted Images (first 2):', images.slice(0, 2));

    const textContent = await extractText(page);
    console.log(
      'Extracted Text (first 200 chars):',
      textContent.substring(0, 200),
    );

    const markdownContent = await extractToMarkdown(page);
    console.log(
      'Extracted Markdown (first 200 chars):',
      markdownContent.substring(0, 200),
    );

    const htmlContent = await extractHTML(page);
    console.log(
      'Extracted HTML (first 200 chars):',
      htmlContent.substring(0, 200),
    );
  } catch (error) {
    console.error('An error occurred during scraping:', error);
  } finally {
    // 3. Close the browser when all operations are complete
    if (browser) {
      await browser.close();
    }
  }
}

// Usage
scrapeWebsite('https://developers.pinterest.com/docs/api/v5/introduction');
```
