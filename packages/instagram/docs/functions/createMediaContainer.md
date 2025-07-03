## Function: `createMediaContainer`

Creates a media container on Instagram, which can then be used to publish media.

**Purpose:**

This function initiates the media creation process. It creates a container that holds the media data and returns the container ID. You can then use the container ID to upload the actual media content and publish the post.

**Parameters:**

- `accountId`: string - The ID of the Instagram account.
- `mediaData`: object - The media data.
  - `image_url`: string (optional) - URL of the image to be published.
  - `video_url`: string (optional) - URL of the video to be published.
  - `media_type`: enum - Type of media. Possible values: 'IMAGE', 'VIDEO', 'REELS', 'STORIES', 'CAROUSEL'.
  - `caption`: string (optional) - Caption for the media.
  - `location_id`: string (optional) - ID of the location to tag.
  - `user_tags`: array<object> (optional) - Array of user tags.
    - `username`: string - Username of the user to tag.
    - `x`: number - X coordinate of the tag.
    - `y`: number - Y coordinate of the tag.
  - `is_carousel_item`: boolean (optional) - Whether this media is part of a carousel.
  - `children`: array<string> (optional) - Array of media IDs for carousel posts.

**Return Value:**

- `Promise<string>` - The ID of the created media container.

**Examples:**

```typescript
// Example 1: Create a media container for a single image
const containerId = await instagramSDK.createMediaContainer('<accountId>', {
  image_url: 'https://example.com/image.jpg',
  media_type: 'IMAGE',
  caption: 'My image caption',
});

// Example 2: Create a media container for a video
const containerId = await instagramSDK.createMediaContainer('<accountId>', {
  video_url: 'https://example.com/video.mp4',
  media_type: 'VIDEO',
  caption: 'My video caption',
});
```
