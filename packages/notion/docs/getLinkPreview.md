## Function: `getLinkPreview`

Gets a link preview (unfurl) for a given URL.

**Purpose:**
Retrieves metadata and preview information for a URL.

**Parameters:**

- `url`: string (required). The URL to unfurl.

**Return Value:**

- `Promise<LinkPreview>`: A promise that resolves to a LinkPreview object.
  - `url`: string. URL of the previewed link.
  - `title`: string. Title of the previewed page.
  - `description`: string | undefined. Description of the previewed page.
  - `icon`: string | undefined. Icon URL for the previewed page.
  - `og_image`: string | undefined. Open Graph image URL for the previewed page.

**Examples:**

```typescript
// Example: Getting a link preview
const preview = await notion.getLinkPreview("https://www.example.com");
console.log(preview);
```