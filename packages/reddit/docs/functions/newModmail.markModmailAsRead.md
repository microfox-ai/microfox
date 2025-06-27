---
title: newModmail.markModmailAsRead
---

# `newModmail.markModmailAsRead`

This endpoint is used to mark modmail conversations as read.

## POST `/api/v1/mod/conversations/read`

### Parameters

| Name              | Type   | Description                                 |
| ----------------- | ------ | ------------------------------------------- |
| `conversationIds` | string | A comma-separated list of conversation IDs. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.markModmailAsRead({
  conversationIds: 'g3a2b,g3a2c',
});
```
