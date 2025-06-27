## Function: `uploadSrImg`

Part of the `subreddits` section. Upload an image to a subreddit's stylesheet, or as a header, icon, or banner.

**Note:** This endpoint expects a `multipart/form-data` request for the file upload, which may require special handling not provided by the default SDK request method. The `file` parameter should be a file object.

**Parameters:**

- `subreddit` (string): The subreddit to upload the image to.
- `file`: The image file to upload (max 500 KiB).
- `name` (string, optional): The name for the image in the stylesheet.
- `upload_type` (string, optional): The type of upload. One of: 'img', 'header', 'icon', 'banner'.
- `img_type` (string, optional): The type of image: 'png' or 'jpg'.
- `header` (number, optional): Whether this is a header image (1 for true, 0 for false).
- `formid` (string, optional): A form ID.

**Return Value:**

- `Promise<any>`: A promise that resolves with the result of the upload.

**Usage Examples:**

```typescript
// The 'file' parameter needs to be a file object, and the request must be multipart/form-data.

const formData = new FormData();
formData.append('subreddit', 'test');
formData.append('name', 'new-image');
formData.append('upload_type', 'img');
formData.append('img_type', 'png');
// formData.append('file', fileInput.files[0]);

// The actual call would depend on how file uploads are implemented in the SDK.
// e.g. await reddit.api.subreddits.uploadSrImg(formData);
```
