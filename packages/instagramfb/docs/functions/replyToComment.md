## Function: `replyToComment`

Replies to a given comment.

**Parameters:**

- `igCommentId` (string, required): The ID of the comment to reply to.
- `message` (string, required): The text of the reply.

**Return Value:**

- `Promise<object>`:
  - `id` (string): The ID of the new reply comment.

**Examples:**

```typescript
const reply = await sdk.replyToComment('<igCommentId>', '<message>');
console.log(reply.id);
```
