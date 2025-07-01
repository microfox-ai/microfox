---
title: newModmail.getModmailConversationMessages
---

# `newModmail.getModmailConversationMessages`

This endpoint is used to get the messages of a modmail conversation.

## GET `/api/v1/mod/conversations/{conversation_id}/messages`

### Path Parameters

| Name              | Type   | Description                         |
| ----------------- | ------ | ----------------------------------- |
| `conversation_id` | string | The ID of the modmail conversation. |

### Response

The endpoint returns a `Promise<GetConversationResponse>`.

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

interface GetConversationResponse {
  conversation: ModmailConversation;
  messages: Record<string, ModmailMessage>;
  modActions: any[]; // This is not documented well
  user: any; // This is not documented well
}
```

### Example

```typescript
const response = await reddit.newModmail.getModmailConversationMessages({
  conversation_id: 'g3a2b',
});
```
