## Function: `getCollection`

Part of the `collections` section. Gets a collection by its ID.

**Parameters:**

- `params`: object
  - An object containing the collection ID and an option to include posts.
  - `collection_id`: string - The UUID of the collection.
  - `include_links`: boolean (optional) - Whether to include the full post objects in the response.

**Return Value:**

- `Promise<CollectionWithLinks>`: A promise that resolves to the collection object. If `include_links` is true, the `links` property will contain an array of `Post` objects.

**CollectionWithLinks Type:**

```typescript
export interface CollectionWithLinks {
  collection_id: string; // The UUID of the collection.
  title: string; // The title of the collection.
  description: string; // The description of the collection.
  author_name: string; // The author's username.
  author_id: string; // The author's fullname.
  created_at_utc: number; // The UTC timestamp of when the collection was created.
  display_layout: 'TIMELINE' | 'GALLERY'; // The display layout of the collection.
  last_update_utc: number; // The UTC timestamp of the last update.
  link_ids: string[]; // A list of post fullnames in the collection.
  permalink: string; // The permalink of the collection.
  subreddit_id: string; // The fullname of the subreddit.
  post_count: number; // The number of posts in the collection.
  links?: Post[]; // The full post objects within the collection. Only present if include_links is true.
  [key: string]: any;
}
```

**Post Type:**

The `Post` object is a large and complex type. Please refer to the official Reddit API documentation or the `postSchema` in the source code for a detailed definition.

**Usage Example:**

```typescript
// Example: Get a collection without the full post objects
const collectionId = 'some-uuid-string';
const collection = await redditSdk.api.collections.getCollection({
  collection_id: collectionId,
});
console.log(collection.title);

// Example: Get a collection with the full post objects
const collectionWithPosts = await redditSdk.api.collections.getCollection({
  collection_id: collectionId,
  include_links: true,
});
collectionWithPosts.links?.forEach(post => {
    console.log(post.title);
});
``` 