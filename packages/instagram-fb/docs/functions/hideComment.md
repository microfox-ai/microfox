## Function: `hideComment`

Hides or unhides a comment.

**Parameters:**

- `igCommentId` (string, required): The ID of the comment to hide or unhide.
- `hidden` (boolean, required): Whether to hide the comment (`true`) or unhide it (`false`).

**Return Value:**

- `Promise<any>`: The response from the API.

**Examples:**

```typescript
await sdk.hideComment('<igCommentId>', true);
```
