## Function: `upload`

Uploads media to X (formerly Twitter).

**Purpose:**
Uploads a media file to X, which can then be attached to a tweet.

**Parameters:**

- `buffer`: Buffer - The media file as a Buffer object. **Required**.
- `mimeType`: string - The MIME type of the media file (e.g., "image/jpeg", "video/mp4"). **Required**.

**Return Value:**

- `Promise<MediaUploadResponse>` - A promise that resolves to the media upload response.
  - `media_id`: number (optional) - The media ID as a number.
  - `media_id_string`: string - The media ID as a string.
  - `size`: number (optional) - The size of the media file in bytes.
  - `expires_after_secs`: number (optional) - The number of seconds until the uploaded media expires.
  - `image`: object (optional) - Image information (if applicable).
    - `image_type`: string (optional) - The type of the image.
    - `w`: number (optional) - The width of the image.
    - `h`: number (optional) - The height of the image.

**Examples:**

```typescript
// Example: Upload an image
const imageBuffer = fs.readFileSync('path/to/image.jpg');
const uploadResponse = await x.media.upload(imageBuffer, 'image/jpeg');
```
