## Function: `search`

Searches Notion for pages and databases matching a query.

**Purpose:**
Performs a search across the workspace.

**Parameters:**

- `query`: string (required). The search query.

**Return Value:**

- `Promise<SearchResult[]>`: A promise that resolves to an array of SearchResult objects.
  - `object`: "page" | "database".
  - `id`: string.
  - `properties`: Record<string, unknown>.

**Examples:**

```typescript
// Example: Searching Notion
const results = await notion.search("My Query");
console.log(results);
```