## Function: `post`

Posts content to LinkedIn with flexible options.

**Purpose:**

Share various types of content on LinkedIn, including text, articles, and images, with options for visibility and draft status.

**Parameters:**

- `options`: `LinkedInPostOptions` (required)
  - `text`: `string` (required)
    - The text content of the post.
  - `visibility`: `"PUBLIC" | "CONNECTIONS"` (optional, default: `"PUBLIC"`)
    - The visibility setting for the post.
      - `"PUBLIC"`: Visible to everyone.
      - `"CONNECTIONS"`: Visible only to connections.
  - `mediaCategory`: `"NONE" | "ARTICLE" | "IMAGE"` (optional, default: `"NONE"`)
    - The category of media included in the post.
      - `"NONE"`: No media.
      - `"ARTICLE"`: An article link.
      - `"IMAGE"`: An image URL.
  - `media`: `array<LinkedInMediaContent>` (optional, default: `[]`)
    - An array of media objects included in the post.
      - `url`: `string` (required)
        - The URL of the media content.
      - `title`: `string` (optional)
        - The title of the media content.
      - `description`: `string` (optional)
        - The description of the media content.
      - `thumbnailUrl`: `string` (optional)
        - The URL of the thumbnail image for the media content.
  - `isDraft`: `boolean` (optional, default: `false`)
    - Whether the post should be saved as a draft.

**Return Value:**

- `Promise<LinkedInShareResponse>`
  - A promise that resolves to the LinkedIn share response.
    - `id`: `string`
      - The ID of the created post.
    - `activity`: `string`
      - The activity URL of the created post.

**Examples:**

```typescript
// Simple text post
await linkedinShare.post({ text: 'Hello LinkedIn!' });

// Article share
await linkedinShare.post({
  text: 'Check out this article!',
  mediaCategory: 'ARTICLE',
  media: [
    {
      url: 'https://example.com/article',
      title: 'Amazing Article',
      description: 'This is a must-read article',
    },
  ],
});

// Image share
await linkedinShare.post({
  text: 'Check out this image!',
  mediaCategory: 'IMAGE',
  media: [
    {
      url: 'https://example.com/image.jpg',
      title: 'My Image',
    },
  ],
});
```
