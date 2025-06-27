---
title: moderation.unignoreReports
---

# `moderation.unignoreReports`

This endpoint is used to unignore reports on a thing.

## POST `/api/unignore_reports`

### Parameters

| Name | Type   | Description          |
| ---- | ------ | -------------------- |
| `id` | string | Fullname of a thing. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.moderation.unignoreReports({
  id: 't3_q4i94j',
});
```
