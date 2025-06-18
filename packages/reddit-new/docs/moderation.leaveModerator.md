---
title: moderation.leaveModerator
---

# `moderation.leaveModerator`

This endpoint is used to leave as a moderator of a subreddit.

## POST `/api/leavemoderator`

### Parameters

| Name | Type   | Description          |
| ---- | ------ | -------------------- |
| `id` | string | Fullname of a thing. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.moderation.leaveModerator({
  id: 't5_2qizd',
});
```
