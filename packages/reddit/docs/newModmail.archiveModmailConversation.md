---
title: newModmail.archiveModmailConversation
---

# `newModmail.archiveModmailConversation`

This endpoint is used to archive a modmail conversation.

## POST `/api/v1/mod/conversations/{conversation_id}/archive`

### Path Parameters

| Name              | Type   | Description                                    |
| ----------------- | ------ | ---------------------------------------------- |
| `conversation_id` | string | The ID of the modmail conversation to archive. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.archiveModmailConversation({
  conversation_id: 'g3a2b',
});
```
