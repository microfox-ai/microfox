## Function: `getSubredditCollections`

Part of the `collections` section. Retrieves all collections for a given subreddit.

**Parameters:**

- `params`: object
  - An object containing the subreddit identifier.
  - `sr_fullname`: string - The fullname of the subreddit.

**Return Value:**

- `Promise<Collection[]>`: A promise that resolves to an array of collection objects belonging to the subreddit.

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
// Example: Get all collections for a subreddit
const subredditFullname = 't5_subredditId';
const collections = await redditSdk.api.collections.getSubredditCollections({
  sr_fullname: subredditFullname,
});

collections.forEach(collection => {
  console.log(`Found collection: ${collection.title} (ID: ${collection.collection_id})`);
});
``` 