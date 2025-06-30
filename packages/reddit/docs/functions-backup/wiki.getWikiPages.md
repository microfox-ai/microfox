## Function: `getWikiPages`

Retrieves a list of wiki pages in a specific subreddit.

**Parameters:**

- `subreddit` (string): The subreddit to retrieve wiki pages from.

**Return Value:**

- `Promise<WikiPageList>`: A promise that resolves to an object containing a list of wiki page names.

**WikiPageList Type:**

```typescript
export interface WikiPageList {
  kind: 'WikiPageList';
  data: {
    pages: string[]; // An array of wiki page names
  };
}
```

**Usage Examples:**

```typescript
// Get all wiki pages for a subreddit
const wikiPages = await reddit.api.wiki.getWikiPages({
  subreddit: 'learnprogramming',
});
console.log(wikiPages.data.pages);
```
