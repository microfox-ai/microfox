## Function: `createComment`

Creates a new comment on a page in Notion.

**Purpose:**
Adds a comment to a specific page.

**Parameters:**

- `pageId`: string (required). The ID of the page to comment on.
- `content`: string (required). The text content of the comment.

**Return Value:**

- `Promise<Comment>`: A promise that resolves to the created Comment object.
  - `id`: string. Unique identifier for the comment.
  - `parent`: object. Parent of the comment (page or block).
    - `type`: "page_id" | "block_id".
    - `page_id`: string (optional).
    - `block_id`: string (optional).
  - `discussion_id`: string. ID of the discussion thread.
  - `created_time`: string. Timestamp when the comment was created.
  - `last_edited_time`: string. Timestamp when the comment was last edited.
  - `created_by`: object. User who created the comment.
    - `id`: string. Unique identifier for the user.
  - `rich_text`: array<object>. Content of the comment.
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

**Examples:**

```typescript
// Example: Creating a comment
const newComment = await notion.createComment("some-page-id", "This is a new comment");
console.log(newComment);
```