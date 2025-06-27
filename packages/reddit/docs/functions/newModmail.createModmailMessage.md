---
title: newModmail.createModmailMessage
---

# `newModmail.createModmailMessage`

This endpoint is used to create a new message in a modmail conversation.

## POST `/api/v1/mod/conversations/{conversation_id}/messages`

### Path Parameters

| Name              | Type   | Description                         |
| ----------------- | ------ | ----------------------------------- |
| `conversation_id` | string | The ID of the modmail conversation. |

### Parameters

| Name             | Type    | Description                                                          |
| ---------------- | ------- | -------------------------------------------------------------------- |
| `body`           | string  | The message body.                                                    |
| `isAuthorHidden` | boolean | Optional. If `true`, the author's username will be hidden.           |
| `isInternal`     | boolean | Optional. If `true`, the message will be an internal moderator note. |

### Response

The endpoint returns a `Promise<CreateConversationResponse>`.

```typescript
interface ModmailMessage {
  body: string;
  bodyMarkdown: string;
  author: {
    isMod: boolean;
    isAdmin: boolean;
    name: string;
    isOp: boolean;
    isParticipant: boolean;
    isHidden: boolean;
    id: string; // user id
    isApproved: boolean;
  };
  isInternal: boolean;
  date: string; // ISO 8601
  id: string;
}

interface ModmailConversation {
  id: string;
  isHighlighted: boolean;
  isInternal: boolean;
  lastModUpdate: string; // ISO 8601
  lastUpdated: string; // ISO 8601
  lastUserUpdate: string; // ISO 8601
  numMessages: number;
  objIds: { key: 'messages' | 'ModAction'; id: string }[];
  owner: {
    displayName: string;
    type: 'subreddit';
    id: string;
  }; // Subreddit
  participant: {
    id: string;
    name: string;
    isMod: boolean;
    isAdmin: boolean;
    isOp: boolean;
    isParticipant: boolean;
    isHidden: boolean;
    isApproved: boolean;
  }; // Redditor
  subject: string;
}

interface CreateConversationResponse {
  conversation: ModmailConversation;
  messages: Record<string, ModmailMessage>;
  modActions: any[]; // This is not documented well
}
```

### Example

```typescript
const response = await reddit.newModmail.createModmailMessage({
  conversation_id: 'g3a2b',
  body: 'This is a reply.',
});
```
