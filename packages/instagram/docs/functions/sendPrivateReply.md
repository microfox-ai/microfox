## Function: `sendPrivateReply`

Sends a private reply to a comment.

**Parameters:**

- `userId`: string - The ID of the user to send the reply to.
- `replyData`: object - The reply data.
  - `recipient`: object - The recipient of the reply.
    - `comment_id`: string - The ID of the comment to reply to.
  - `message`: object - The message content.
    - `text`: string - The text content of the reply.

**Return Value:**

- `Promise<any>` - The response data.

**Examples:**

```typescript
const response = await instagramSDK.sendPrivateReply('<userId>', {
  recipient: { comment_id: '<commentId>' },
  message: { text: 'This is my private reply' },
});
```
