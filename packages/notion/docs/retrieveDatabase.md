## Function: `retrieveDatabase`

Retrieves a database from Notion.

**Purpose:**
Fetches a database object from the Notion API based on its ID.

**Parameters:**

- `databaseId`: string (required). Unique identifier for the database.

**Return Value:**

- `Promise<Database>`: A promise that resolves to a Database object.
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
// Example: Retrieving a database
const database = await notion.retrieveDatabase("some-database-id");
console.log(database);
```