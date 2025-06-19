---
title: newModmail.getModmailConversations
---

# `newModmail.getModmailConversations`

This endpoint is used to get a list of modmail conversations.

## GET `/api/v1/mod/conversations`

### Query Parameters

| Name     | Type   | Description                                                                                                                                                                                      |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `after`  | string | An optional Modmail Conversation ID to fetch conversations after.                                                                                                                                |
| `entity` | string | A comma-delimited list of subreddit names.                                                                                                                                                       |
| `limit`  | number | An optional limit for the number of conversations to return (1-100).                                                                                                                             |
| `sort`   | string | An optional sort order for the conversations. One of: `recent`, `mod`, `user`, `unread`.                                                                                                         |
| `state`  | string | An optional state to filter conversations by. One of: `all`, `appeals`, `notifications`, `inbox`, `filtered`, `inprogress`, `mod`, `archived`, `default`, `highlighted`, `join_requests`, `new`. |

### Response

The endpoint returns a `Promise<GetConversationsResponse>`.

```typescript
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

interface GetConversationsResponse {
  viewerId: string;
  conversations: Record<string, ModmailConversation>;
}
```

### Example

```typescript
const response = await reddit.newModmail.getModmailConversations({
  entity: 'test',
  limit: 50,
});
```
