## Function: `updatePage`

Updates an existing page in Notion.

**Purpose:**
Modifies the properties of a specific page.

**Parameters:**

- `pageId`: string (required). The ID of the page to update.
- `properties`: Record<string, unknown> (required). The properties to update on the page.

**Return Value:**

- `Promise<Page>`: A promise that resolves to the updated Page object.
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
// Example: Updating a page's properties
const updatedPage = await notion.updatePage("some-page-id", { title: [{ type: "text", text: { content: "Updated Page Title" } }] });
console.log(updatedPage);
```