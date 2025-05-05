## Function: `createPage`

Creates a new page in Notion.

**Purpose:**
Creates a new page within a database or other parent in Notion.

**Parameters:**

- `parentId`: string (required). The ID of the parent database or page.
- `properties`: Record<string, unknown> (required). The properties of the new page.

**Return Value:**

- `Promise<Page>`: A promise that resolves to the created Page object.
  - `id`: string. Unique identifier for the page.
  - `created_time`: string. Timestamp when the page was created.
  - `last_edited_time`: string. Timestamp when the page was last edited.
  - `created_by`: object. User who created the page.
    - `id`: string. Unique identifier for the user.
  - `last_edited_by`: object. User who last edited the page.
    - `id`: string. Unique identifier for the user.
  - `cover`: object | null. Cover image for the page.
  - `icon`: object | null. Icon for the page.
  - `parent`: object. Parent of the page (database or another page).
    - `type`: "database_id" | "page_id" | "workspace".
    - `database_id`: string (optional).
    - `page_id`: string (optional).
  - `archived`: boolean. Whether the page is archived.
  - `properties`: Record<string, unknown>. Page properties.
  - `url`: string. URL of the page.

**Examples:**

```typescript
// Example: Creating a page
const newPage = await notion.createPage("some-parent-id", { title: [{ type: "text", text: { content: "New Page Title" } }] });
console.log(newPage);
```