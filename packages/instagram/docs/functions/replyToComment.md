## Function: `replyToComment`

Replies to a comment.

**Parameters:**

- `commentId`: string - The ID of the comment to reply to.
- `replyData`: object - The reply data.
  - `message`: string - The text content of the reply.

**Return Value:**

- `Promise<string>` - The ID of the new reply.

**Examples:**

```typescript
const replyId = await instagramSDK.replyToComment('<commentId>', {
  message: 'This is my reply',
});
```
