# extractLinks & extractLinksFromUrl

Extracts hyperlink data from a webpage.

## `extractLinks`

Extracts all links (`<a>` tags) from an already opened Puppeteer `page`.

### Signature

```typescript
function extractLinks(page: Page): Promise<ExtractedLink[]>;
```

### Parameters

- `page` (Page, required): An active Puppeteer `Page` object.

### Returns

A `Promise` that resolves to an array of `ExtractedLink` objects.

```typescript
type ExtractedLink = {
  href: string;
  displayName: string;
  type: 'statix' | 'webpage';
  inPageLink: boolean;
  externalLink: boolean;
  internalLink: boolean;
  staticType?: 'video' | 'image' | 'file' | 'other';
  fileExtension?: string;
};
```

## `extractLinksFromUrl`

A convenience wrapper that opens a URL, extracts links, and closes the browser.

### Signature

```typescript
function extractLinksFromUrl(
  options: ExtractLinksOptions,
): Promise<ExtractedLink[]>;
```

### Parameters (`ExtractLinksOptions`)

Inherits all options from `openPage`.

### Example (Standalone)

```typescript
import { extractLinksFromUrl } from '@microfox/puppeteer-sls';

async function main() {
  const links = await extractLinksFromUrl({
    url: 'https://developers.pinterest.com/docs/api/v5/introduction',
    isLocal: true,
    headless: true,
  });
  console.log(links);
}

main();
```

Refer to the main `usage.md` for using `extractLinks` efficiently.
