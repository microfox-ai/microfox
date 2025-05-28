## Function: `uploadFile`

Uploads a file to Slack.

**Purpose:**
Shares a file in a Slack channel or conversation.

**Parameters:**

- `file`: object<FileUpload>
  - An object containing the file upload details.

**Return Value:**

- `Promise<FileUploadResponse>`: A promise that resolves to the Slack API response.

**FileUpload Type:**

```typescript
export interface FileUpload {
  channels?: string; // Comma-separated channel IDs (optional)
  content?: string; // File content as string (optional)
  filename?: string; // Filename (optional)
  filetype?: string; // File type identifier (optional)
  initial_comment?: string; // Initial comment (optional)
  thread_ts?: string; // Thread timestamp (optional)
  title?: string; // File title (optional)
}
```

**FileUploadResponse Type:**

```typescript
export interface FileUploadResponse {
  ok: boolean; // Success indicator
  file?: {
    id: string;
    // ... other file details
  };
  error?: string; // Error message
  // ... other optional fields
}
```

**Examples:**

```typescript
// Example: Uploading a file from text content
const uploadResponse = await sdk.uploadFile({
  channels: 'channel_id_1,channel_id_2...',
  content: 'This is the file content.',
  filename: 'example.txt',
  filetype: 'txt',
  title: 'Example File',
});
```
