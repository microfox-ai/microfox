---
title: newModmail.createModmailConversation
---

# `newModmail.createModmailConversation`

This endpoint is used to create a new modmail conversation.

## POST `/api/v1/mod/conversations`

### Parameters

| Name             | Type    | Description                                                                                          |
| ---------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `body`           | string  | The initial message body of the conversation.                                                        |
| `isAuthorHidden` | boolean | Optional. If `true`, the author's username will be hidden.                                           |
| `srName`         | string  | The name of the subreddit to create the conversation in.                                             |
| `subject`        | string  | The subject of the conversation (max 100 characters).                                                |
| `to`             | string  | The username of the user to start the conversation with. Can be `null` for internal mod discussions. |

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
const response = await reddit.newModmail.createModmailConversation({
  srName: 'test',
  subject: 'Hello!',
  body: 'This is a test message.',
  to: 'someuser',
});
```
