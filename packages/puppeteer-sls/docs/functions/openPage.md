# openPage

Opens a new page in a browser instance and navigates to a URL. This function is the entry point for most scraping tasks.

## Signature

```typescript
function openPage(
  options: OpenPageOptions,
): Promise<{ browser: Browser; page: Page }>;
```

### Parameters (`OpenPageOptions`)

- `url` (string, required): The URL to navigate to.
- `defaultViewport` (object, optional): Viewport dimensions (`{ width: number; height: number; }`).
- `headless` (boolean, optional): Whether to run in headless mode. Defaults to `false`.
- `isLocal` (boolean, optional): Set to `true` when running on your local machine. Defaults to `false`.

### Returns

A `Promise` that resolves to an object containing the Puppeteer `browser` and `page` instances.

## Example

```typescript
import { openPage } from '@microfox/puppeteer-sls';

async function main() {
  const { browser, page } = await openPage({
    url: 'https://example.com',
    isLocal: true,
    headless: true,
  });

  console.log('Page title:', await page.title());

  await browser.close();
}

main();
```
