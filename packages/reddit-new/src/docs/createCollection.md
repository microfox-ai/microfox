## Function: `createCollection`

Part of the `collections` section. Creates a new collection in a subreddit.

**Parameters:**

- `params`: object
  - An object containing the details for the new collection.
  - `title`: string - The title for the new collection (max 300 characters).
  - `sr_fullname`: string - The fullname of the subreddit to create the collection in.
  - `description`: string (optional) - The description for the new collection (max 500 characters).
  - `display_layout`: 'TIMELINE' | 'GALLERY' (optional) - The display layout for the collection.

**Return Value:**

- `Promise<Collection>`: A promise that resolves to the newly created collection object.

**Collection Type:**

```typescript
export interface Collection {
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
  [key: string]: any;
}
```

**Usage Example:**

```typescript
// Example: Create a new collection
const subredditFullname = 't5_subredditId';
const newCollection = await redditSdk.api.collections.createCollection({
  title: 'My Awesome New Collection',
  sr_fullname: subredditFullname,
  description: 'A collection of the most awesome posts.',
  display_layout: 'GALLERY',
});

console.log(`Created collection: ${newCollection.title} (ID: ${newCollection.collection_id})`);
``` 