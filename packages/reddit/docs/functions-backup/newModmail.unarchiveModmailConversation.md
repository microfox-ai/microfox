---
title: newModmail.unarchiveModmailConversation
---

# `newModmail.unarchiveModmailConversation`

This endpoint is used to unarchive a modmail conversation.

## POST `/api/v1/mod/conversations/{conversation_id}/unarchive`

### Path Parameters

| Name              | Type   | Description                                      |
| ----------------- | ------ | ------------------------------------------------ |
| `conversation_id` | string | The ID of the modmail conversation to unarchive. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.unarchiveModmailConversation({
  conversation_id: 'g3a2b',
});
```
