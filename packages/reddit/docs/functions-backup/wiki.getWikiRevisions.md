## Function: `getWikiRevisions` and `getWikiPageRevisions`

Retrieves a listing of wiki page revisions for a subreddit.

- `getWikiRevisions`: Retrieves revisions for all wiki pages in the subreddit.
- `getWikiPageRevisions`: Retrieves revisions for a specific wiki page.

**Parameters:**

- `subreddit` (string): The subreddit to retrieve wiki revisions from.
- `page` (string, optional): The name of a specific wiki page to retrieve revisions for. Required for `getWikiPageRevisions`.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `show` (string, optional): Can be 'all'.
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.

**Return Value:**

- `Promise<WikiRevisionListing>`: A promise that resolves to a listing of wiki page revisions.

**WikiRevisionListing Type:**

```typescript
export interface WikiRevisionListing {
  kind: 'Listing';
  data: {
    after: string | null;
    before: string | null;
    dist: number | null;
    children: {
      kind: 'WikiPageRevision';
      data: WikiRevision;
    }[];
  };
}
```

**WikiRevision Type:**

```typescript
export interface WikiRevision {
  timestamp: number;
  reason: string | null;
  page: string;
  id: string;
  // author: User; // The author of the revision
}
```

**Usage Examples:**

```typescript
// Get all wiki revisions for a subreddit
const revisions = await reddit.api.wiki.getWikiRevisions({
  subreddit: 'learnprogramming',
  limit: 25,
});
console.log(revisions.data.children);

// Get revisions for a specific wiki page
const pageRevisions = await reddit.api.wiki.getWikiPageRevisions({
  subreddit: 'learnprogramming',
  page: 'index',
  limit: 10,
});
console.log(pageRevisions.data.children);
```
