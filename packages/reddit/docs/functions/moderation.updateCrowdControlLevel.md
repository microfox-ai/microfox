---
title: moderation.updateCrowdControlLevel
---

# `moderation.updateCrowdControlLevel`

This endpoint is used to update the crowd control level for a post.

## POST `/api/update_crowd_control_level`

### Parameters

| Name    | Type   | Description                                                                                                                            |
| ------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `id`    | string | Fullname of a post.                                                                                                                    |
| `level` | number | The crowd control level. Must be an integer between 0 and 3 (inclusive).<br/>`0`: Off<br/>`1`: Lenient<br/>`2`: Medium<br/>`3`: Strict |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.moderation.updateCrowdControlLevel({
  id: 't3_q4i94j',
  level: 2,
});
```
