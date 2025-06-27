---
title: newModmail.getModmailUnreadCount
---

# `newModmail.getModmailUnreadCount`

This endpoint is used to get the unread modmail conversation count by conversation state.

## GET `/api/v1/mod/conversations/unread/count`

### Response

The endpoint returns a `Promise<Record<string, number>>`. The keys are conversation states, and the values are the unread counts.

Possible states include: `"archived"`, `"highlighted"`, `"inprogress"`, `"join_requests"`, `"mod"`, `"new"`, `"notifications"`, `"appeals"`.

### Example

```typescript
const unreadCounts = await reddit.newModmail.getModmailUnreadCount();
```
