---
title: newModmail.modmailBulkRead
---

# `newModmail.modmailBulkRead`

This endpoint is used to mark modmail conversations as read in bulk.

## POST `/api/v1/mod/conversations/bulk/read`

### Parameters

| Name     | Type   | Description                                                                                                                                                                                        |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entity` | string | A comma-delimited list of subreddit names.                                                                                                                                                         |
| `state`  | string | The state of the conversations to mark as read. One of: `all`, `appeals`, `notifications`, `inbox`, `filtered`, `inprogress`, `mod`, `archived`, `default`, `highlighted`, `join_requests`, `new`. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.modmailBulkRead({
  entity: 'test',
  state: 'all',
});
```
