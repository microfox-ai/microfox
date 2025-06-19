---
title: newModmail.highlightModmailConversation
---

# `newModmail.highlightModmailConversation`

This endpoint is used to highlight a modmail conversation.

## POST `/api/v1/mod/conversations/{conversation_id}/highlight`

### Path Parameters

| Name              | Type   | Description                                      |
| ----------------- | ------ | ------------------------------------------------ |
| `conversation_id` | string | The ID of the modmail conversation to highlight. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.highlightModmailConversation({
  conversation_id: 'g3a2b',
});
```
