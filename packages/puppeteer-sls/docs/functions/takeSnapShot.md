# takeSnapShot

Opens a page, takes a screenshot, uploads it to an S3-compatible space, and returns the public URL.

**Note:** This function always opens and closes its own browser instance and is intended for single-use operations.

## Signature

```typescript
function takeSnapShot(
  options: TakeSnapShotOptions,
): Promise<string | undefined>;
```

### Parameters (`TakeSnapShotOptions`)

- Inherits all options from `openPage`.
- `fileName` (string, required): The file name for the screenshot in S3.
- `quality` (number, optional): For JPEG screenshots, image quality from 0-100.
- `encoding` (string, optional): `'base64'` or `'binary'`. Defaults to `'binary'`.
- `s3Config` (S3SpaceConfig, required): Configuration for your S3-compatible storage.

### Example

```typescript
import { takeSnapShot } from '@microfox/puppeteer-sls';

async function main() {
  const imageUrl = await takeSnapShot({
    url: 'https://example.com',
    fileName: 'example-screenshot.png',
    s3Config: {
      bucket: 'your-bucket-name',
      region: 'your-region',
      endpoint: 'https://your-s3-endpoint.com',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    },
    isLocal: true,
    headless: true,
  });

  console.log('Screenshot URL:', imageUrl);
}

main();
```
