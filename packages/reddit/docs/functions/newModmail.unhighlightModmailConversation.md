---
title: newModmail.unhighlightModmailConversation
---

# `newModmail.unhighlightModmailConversation`

This endpoint is used to unhighlight a modmail conversation.

## DELETE `/api/v1/mod/conversations/{conversation_id}/highlight`

### Path Parameters

| Name              | Type   | Description                                        |
| ----------------- | ------ | -------------------------------------------------- |
| `conversation_id` | string | The ID of the modmail conversation to unhighlight. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.unhighlightModmailConversation({
  conversation_id: 'g3a2b',
});
```
