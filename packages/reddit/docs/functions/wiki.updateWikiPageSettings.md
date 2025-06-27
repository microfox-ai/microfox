## Function: `updateWikiPageSettings`

Updates the settings for a specific wiki page.

**Parameters:**

- `subreddit` (string): The subreddit where the wiki page exists.
- `page` (string): The name of the wiki page.
- `listed` (boolean): Whether the page should be listed on the wiki index.
- `permlevel` (number): The permission level for the page.

**Return Value:**

- `Promise<WikiPageSettings>`: A promise that resolves to an object containing the updated wiki page settings.

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
// Update the settings for a wiki page
const newSettings = await reddit.api.wiki.updateWikiPageSettings({
  subreddit: 'learnprogramming',
  page: 'index',
  listed: true,
  permlevel: 2,
});
console.log(newSettings);
```
