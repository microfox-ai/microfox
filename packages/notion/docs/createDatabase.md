## Function: `createDatabase`

Creates a new database in Notion.

**Purpose:**
Creates a new database within a given parent page.

**Parameters:**

- `parentId`: string (required). The ID of the parent page.
- `title`: string (required). The title of the new database.
- `properties`: Record<string, unknown> (required). The properties configuration for the database.

**Return Value:**

- `Promise<Database>`: A promise that resolves to the created Database object.
  - `id`: string. Unique identifier for the database.
  - `created_time`: string. Timestamp when the database was created.
  - `last_edited_time`: string. Timestamp when the database was last edited.
  - `icon`: object | null. Icon for the database.
  - `cover`: object | null. Cover image for the database.
  - `url`: string. URL of the database.
  - `title`: array<object>. Title of the database.
    - `type`: "text" | "mention" | "equation".
    - `text`: object (optional).
      - `content`: string.
      - `link`: object (optional).
        - `url`: string.
    - `annotations`: object (optional).
      - `bold`: boolean.
      - `italic`: boolean.
      - `strikethrough`: boolean.
      - `underline`: boolean.
      - `code`: boolean.
      - `color`: string.
    - `plain_text`: string.
    - `href`: string (optional).
  - `description`: array<object> | undefined. Description of the database. (Same structure as title)
  - `properties`: Record<string, object>. Database properties.
    - `[propertyName]`: object. Property configuration.
      - `id`: string.
      - `type`: "title" | "rich_text" | "number" | "select" | "multi_select" | "date" | "people" | "files" | "checkbox" | "url" | "email" | "phone_number" | "formula" | "relation" | "rollup" | "created_time" | "created_by" | "last_edited_time" | "last_edited_by".
      - `name`: string.

**Examples:**

```typescript
// Example: Creating a database
const newDatabase = await notion.createDatabase("some-parent-page-id", "My New Database", { Name: { type: "title", title: {} } });
console.log(newDatabase);
```