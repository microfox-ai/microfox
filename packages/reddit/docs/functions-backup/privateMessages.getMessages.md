## Function: `getMessages`

Part of the `privateMessages` section. Get private messages from the user's inbox, unread messages, or sent messages.

**Parameters:**

- `where` (string): The location to get messages from. One of: 'inbox', 'unread', 'sent'.
- `after` (string, optional): Return items after this fullname.
- `before` (string, optional): Return items before this fullname.
- `count` (number, optional): The number of items already seen in this listing.
- `limit` (number, optional): The maximum number of items to return in this slice of the listing.
- `show` (string, optional): Optional parameter for listings. Can be "all".
- `sr_detail` (boolean, optional): Optional parameter to expand subreddit details.
- `mark` (string, optional): Can be 'true' or 'false'.
- `max_replies` (number, optional): The maximum number of replies to return.
- `mid` (string, optional): The ID of a message.

**Return Value:**

- `Promise<Listing<Message>>`: A promise that resolves to a listing of messages.

**Message Type:**

```typescript
export interface Message {
  author?: Redditor; // The author of the message.
  body?: string; // The body of the message, as Markdown.
  body_html?: string; // The body of the message, as HTML.
  created_utc?: number; // Time the message was created, represented in Unix Time.
  dest?: Redditor; // The recipient of the message.
  id?: string; // The ID of the message.
  name?: string; // The full ID of the message, prefixed with t4_.
  subject?: string; // The subject of the message.
  was_comment?: boolean; // Whether or not the message was a comment reply.
  parent_id?: string; // Fullname of the parent, or null if not a reply to a message.
  replies?: Listing<Message>; // A Listing of Message objects.
}
```

**Usage Examples:**

```typescript
// 1. Get the 25 most recent messages from the inbox
const inboxMessages = await reddit.api.privateMessages.getMessages({
  where: 'inbox',
  limit: 25,
});
console.log(inboxMessages);
```

```typescript
// 2. Get unread messages and mark them as read in the process
const unreadMessages = await reddit.api.privateMessages.getMessages({
  where: 'unread',
  mark: 'true',
});
console.log(unreadMessages);
```

```typescript
// 3. Get the 10 most recent sent messages
const sentMessages = await reddit.api.privateMessages.getMessages({
  where: 'sent',
  limit: 10,
});
console.log(sentMessages);
```
