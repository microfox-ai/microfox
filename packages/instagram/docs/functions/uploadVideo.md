## Function: `uploadVideo`

Uploads a video to a media container.

**Parameters:**

- `containerId`: string - The ID of the media container.
- `videoFile`: File - The video file to upload.
- `offset`: number - The starting offset for the upload.

**Return Value:**

- `Promise<any>` - The upload response data.

**Examples:**

```typescript
const uploadResponse = await instagramSDK.uploadVideo(
  '<containerId>',
  new File([''], 'video.mp4'),
  0,
);
```
