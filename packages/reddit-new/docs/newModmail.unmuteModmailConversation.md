---
title: newModmail.unmuteModmailConversation
---

# `newModmail.unmuteModmailConversation`

This endpoint is used to unmute a modmail conversation.

## POST `/api/v1/mod/conversations/{conversation_id}/unmute`

### Path Parameters

| Name              | Type   | Description                                   |
| ----------------- | ------ | --------------------------------------------- |
| `conversation_id` | string | The ID of the modmail conversation to unmute. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.unmuteModmailConversation({
  conversation_id: 'g3a2b',
});
```
