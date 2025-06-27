## Function: `getWikiPageSettings`

Retrieves the settings for a specific wiki page.

**Parameters:**

- `subreddit` (string): The subreddit where the wiki page exists.
- `page` (string): The name of the wiki page.

**Return Value:**

- `Promise<WikiPageSettings>`: A promise that resolves to an object containing the wiki page settings.

**WikiPageSettings Type:**

```typescript
export interface WikiPageSettings {
  permlevel: number; // The permission level for the page
  listed: boolean; // Whether the page is listed on the wiki index
  editors: any[]; // A list of users who are editors of the page
}
```

**Usage Examples:**

```typescript
// Get the settings for a wiki page
const settings = await reddit.api.wiki.getWikiPageSettings({
  subreddit: 'learnprogramming',
  page: 'index',
});
console.log(settings);
```
