---
title: newModmail.markModmailAsUnread
---

# `newModmail.markModmailAsUnread`

This endpoint is used to mark modmail conversations as unread.

## POST `/api/v1/mod/conversations/unread`

### Parameters

| Name              | Type   | Description                                 |
| ----------------- | ------ | ------------------------------------------- |
| `conversationIds` | string | A comma-separated list of conversation IDs. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.markModmailAsUnread({
  conversationIds: 'g3a2b,g3a2c',
});
```
