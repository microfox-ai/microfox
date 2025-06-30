## Function: `getWidgetImageUploadLease`

Gets an S3 upload lease for a widget image.

This is the first step in uploading an image for a widget. The lease provides a URL and fields needed to upload the image file to Reddit's S3 bucket.

**Parameters:**

- `subreddit` (string): The subreddit where the widget exists.
- `filepath` (string): The name and extension of the image file (e.g., `image.png`).
- `mimetype` (string): The MIME type of the image (`image/jpeg` or `image/png`).

**Return Value:**

- `Promise<S3LeaseResponse>`: A promise that resolves to an object containing the S3 upload lease.

**S3LeaseResponse Type:**

```typescript
export interface S3LeaseResponse {
  action: string; // The URL to POST the image file to.
  fields: {
    name: string;
    value: string;
  }[]; // A list of hidden form fields to include in the POST request.
  [key: string]: any;
}
```

**Usage Example:**

```typescript
// Example: Get an upload lease for a new widget image
const lease = await reddit.api.widgets.getWidgetImageUploadLease({
  subreddit: 'learnprogramming',
  filepath: 'my-widget-image.png',
  mimetype: 'image/png',
});

console.log('Upload URL:', lease.action);
console.log('Upload Fields:', lease.fields);

// You would then use this information to upload the file, for example,
// by creating a FormData object and POSTing it to the `action` URL.
```
