---
title: newModmail.getModmailSubreddits
---

# `newModmail.getModmailSubreddits`

This endpoint is used to get a list of subreddits that use the new modmail and are moderated by the current user.

## GET `/api/v1/mod/conversations/subreddits`

### Response

The endpoint returns a `Promise<GetModmailSubredditsResponse>`.

```typescript
interface ModmailSubreddit {
  id: string;
  name: string; // display name
  subscribers: number;
  active: number;
  url: string;
  community_icon: string;
  key_color: string;
}

interface GetModmailSubredditsResponse {
  subreddits: Record<string, ModmailSubreddit>;
}
```

### Example

```typescript
const response = await reddit.newModmail.getModmailSubreddits();
```
