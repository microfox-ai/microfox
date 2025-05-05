## Function: `deletePage`

Deletes a page from Notion.

**Purpose:**
Removes a page from a workspace.

**Parameters:**

- `pageId`: string (required). The ID of the page to delete.

**Return Value:**

- `Promise<void>`: A promise that resolves when the page has been deleted.

**Examples:**

```typescript
// Example: Deleting a page
await notion.deletePage("some-page-id");
```