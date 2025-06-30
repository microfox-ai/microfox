## Function: `getWikiPage`

Retrieves the content of a specific wiki page.

**Parameters:**

- `subreddit` (string): The subreddit where the wiki page exists.
- `page` (string): The name of the wiki page.

**Return Value:**

- `Promise<WikiPage>`: A promise that resolves to an object containing the wiki page content.

**WikiPage Type:**

```typescript
export interface WikiPage {
  may_revise: boolean; // Whether the user can revise the page
  revision_date: number; // The date of the last revision
  content_md: string; // The content of the page in markdown format
  content_html: string; // The content of the page in HTML format
  // revision_by: User; // The user who made the last revision
}
```

**Usage Examples:**

```typescript
// Get the content of a wiki page
const wikiPage = await reddit.api.wiki.getWikiPage({
  subreddit: 'learnprogramming',
  page: 'index',
});
console.log(wikiPage.content_md);
```
