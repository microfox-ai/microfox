# Webpage Content Extraction

These functions help you extract content from a webpage in various formats.

## `extractHTML`

Extracts the full HTML content of a page.

### Signature

```typescript
function extractHTML(page: Page): Promise<string>;
```

## `extractToMarkdown`

Extracts the `<body>`'s content and converts it to Markdown.

### Signature

```typescript
function extractToMarkdown(page: Page): Promise<string>;
```

## `extractWebpage`

A convenience wrapper that opens a URL and can extract text, Markdown, and HTML content. Note that this function opens its own browser instance. For more efficient, multi-step scraping, use `extractHTML` and `extractToMarkdown` directly with a `page` object from `openPage`.

### Signature

```typescript
function extractWebpage(options: ExtractWebpageContentOptions): Promise<{
  content: string;
  browser: Browser;
  markdown?: string;
  html?: string;
  page: Page;
}>;
```

### Parameters (`ExtractWebpageContentOptions`)

- Inherits all options from `openPage`.
- `toMarkdown` (boolean, optional): If `true`, returns Markdown content.
- `toHTML` (boolean, optional): If `true`, returns full HTML content.

### Example (Standalone `extractWebpage`)

```typescript
import { extractWebpage } from '@microfox/puppeteer-sls';

async function main() {
  const { content, markdown, browser } = await extractWebpage({
    url: 'https://example.com',
    toMarkdown: true,
    isLocal: true,
    headless: true,
  });
  console.log('Text Content:', content);
  console.log('Markdown Content:', markdown);
  await browser.close();
}

main();
```

Refer to `usage.md` for examples of using `extractHTML` and `extractToMarkdown` with a shared `page` object.
