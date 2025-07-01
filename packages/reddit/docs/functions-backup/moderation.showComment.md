---
title: moderation.showComment
---

# `moderation.showComment`

This endpoint is used to show a comment.

## POST `/api/show_comment`

### Parameters

| Name | Type   | Description          |
| ---- | ------ | -------------------- |
| `id` | string | Fullname of a thing. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.moderation.showComment({
  id: 't1_h9z1y9c',
});
```
