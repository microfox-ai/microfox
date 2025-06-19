---
title: newModmail.muteModmailConversation
---

# `newModmail.muteModmailConversation`

This endpoint is used to mute a modmail conversation.

## POST `/api/v1/mod/conversations/{conversation_id}/mute`

### Path Parameters

| Name              | Type   | Description                                 |
| ----------------- | ------ | ------------------------------------------- |
| `conversation_id` | string | The ID of the modmail conversation to mute. |

### Parameters

| Name        | Type   | Description                                                                   |
| ----------- | ------ | ----------------------------------------------------------------------------- |
| `num_hours` | string | The number of hours to mute the conversation for. One of: `72`, `168`, `672`. |

### Response

The endpoint returns a `Promise<void>`.

### Example

```typescript
await reddit.newModmail.muteModmailConversation({
  conversation_id: 'g3a2b',
  num_hours: '72',
});
```
