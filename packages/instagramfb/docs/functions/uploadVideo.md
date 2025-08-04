## Function: `uploadVideo`

Uploads a video to a media container.

**Parameters:**

- `igMediaContainerId` (string, required): The ID of the media container.
- `videoFile` (Blob, required): The video file to upload.
- `offset` (number, required): The starting offset for the upload.
- `fileSize` (number, required): The total size of the video file.

**Return Value:**

- `Promise<any>`: The response from the API.

**Examples:**

```typescript
const response = await sdk.uploadVideo(
  '<igMediaContainerId>',
  new Blob([]),
  0,
  1024,
);
console.log(response);
```
