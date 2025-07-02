---
title: moderation.unsnoozeReports
---

# `moderation.unsnoozeReports`

This endpoint is used to unsnooze reports on a thing.

## POST `/api/unsnooze_reports`

### Parameters

| Name | Type   | Description          |
| ---- | ------ | -------------------- |
| `id` | string | Fullname of a thing. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.moderation.unsnoozeReports({
  id: 't3_q4i94j',
});
```
