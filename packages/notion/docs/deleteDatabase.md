## Function: `deleteDatabase`

Deletes a database from Notion.

**Purpose:**
Removes a database from a workspace.

**Parameters:**

- `databaseId`: string (required). The ID of the database to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the database has been deleted.

**Examples:**

```typescript
// Example: Deleting a database
await notion.deleteDatabase("some-database-id");
```