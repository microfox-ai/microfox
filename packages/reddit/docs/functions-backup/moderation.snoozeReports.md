---
title: moderation.snoozeReports
---

# `moderation.snoozeReports`

This endpoint is used to snooze reports on a thing.

## POST `/api/snooze_reports`

### Parameters

| Name     | Type   | Description                              |
| -------- | ------ | ---------------------------------------- |
| `id`     | string | Fullname of a thing.                     |
| `reason` | string | Optional. A reason for snoozing reports. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.moderation.snoozeReports({
  id: 't3_q4i94j',
  reason: 'Investigating',
});
```
