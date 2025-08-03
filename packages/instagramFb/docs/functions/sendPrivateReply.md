## Function: `sendPrivateReply`

Sends a private reply to a comment.

**Parameters:**

- `appUsersIgId` (string, required): The Instagram ID of the app user.
- `commentId` (string, required): The ID of the comment to reply to.
- `message` (string, required): The text of the private reply.

**Return Value:**

- `Promise<object>`:
  - `recipient_id` (string): The Instagram-scoped ID of the recipient.
  - `message_id` (string): The ID of the sent message.

**Examples:**

```typescript
const reply = await sdk.sendPrivateReply(
  '<appUsersIgId>',
  '<commentId>',
  '<message>',
);
console.log(reply.message_id);
```
