# extractImages & extractImagesFromURL

Extracts image data from a webpage.

## `extractImages`

Extracts all images from an already opened Puppeteer `page`. This is efficient when you are performing multiple operations on the same page.

### Signature

```typescript
function extractImages(page: Page): Promise<ExtractedImage[]>;
```

### Parameters

- `page` (Page, required): An active Puppeteer `Page` object.

### Returns

A `Promise` that resolves to an array of `ExtractedImage` objects.

```typescript
interface ExtractedImage {
  src: string | null;
  srcset: string | null;
  responsiveImages: { url: string; size: string }[] | null;
  alt: string | null;
}
```

## `extractImagesFromURL`

A convenience function that opens a URL, extracts images, and closes the browser. Use this for single-use scraping tasks.

### Signature

```typescript
function extractImagesFromURL(
  options: OpenPageOptions,
): Promise<ExtractedImage[]>;
```

### Parameters (`OpenPageOptions`)

Inherits all options from `openPage`.

### Example (Standalone)

```typescript
import { extractImagesFromURL } from '@microfox/puppeteer-sls';

async function main() {
  const images = await extractImagesFromURL({
    url: 'https://www.pinterest.com/search/pins/?q=cyberpunk',
    isLocal: true,
    headless: true,
  });
  console.log(images);
}

main();
```

See the main `usage.md` for an example of how to use `extractImages` as part of a larger scraping flow.
