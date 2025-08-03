## Function: `createMediaContainer`

Creates a media container for uploading media.

**Parameters:**

- `igId` (string, required): The Instagram Business Account ID.
- `params` (object, required):
  - `image_url` (string, optional): The URL of the image to upload.
  - `video_url` (string, optional): The URL of the video to upload.
  - `media_type` (MediaType, required): The type of media. Possible values: 'IMAGE', 'VIDEO', 'REELS', 'STORIES', 'CAROUSEL'.
  - `is_carousel_item` (boolean, optional): Whether the media is a carousel item.
  - `upload_type` (string, optional): The upload type. Currently only 'resumable' is supported.

**Return Value:**

- `Promise<object>`:
  - `id` (string): The ID of the created media container.

**Examples:**

```typescript
const container = await sdk.createMediaContainer('<igId>', {
  image_url: '<imageUrl>',
  media_type: 'IMAGE',
});
console.log(container.id);
```
