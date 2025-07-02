## Function: `getMessages`

Fetches a listing of private messages for the authenticated user from a specified location (e.g., inbox, unread, sent).

**Parameters:**

- `where`: "inbox" | "unread" | "sent" - The message box to retrieve messages from.
- `mark`: boolean (optional, default: false) - If `true`, marks messages as read.
- `after`: string (optional) - The fullname of an item to list after for pagination.
- `before`: string (optional) - The fullname of an item to list before for pagination.
- `count`: number (optional) - The number of items already seen in the listing.
- `limit`: number (optional, default: 25) - The maximum number of items to return.

**Return Type:**

- `Promise<ThingListing<Message>>`: A promise that resolves to a listing of `Message` objects.

**ThingListing<Message> Object Details:**

- `kind`: string (always 'Listing') - The type of the object.
- `data`: object - The main data payload.
  - `after`: string | null - The fullname of the next item in the list for pagination.
  - `before`: string | null - The fullname of the previous item in the list for pagination.
  - `dist`: number - The number of items in the listing.
  - `modhash`: string - A token for moderation actions.
  - `geo_filter`: string | null - The geofilter used for the request.
  - `children`: `Message[]` - An array of Message objects.

**Message Object Details:**

- `id`: string
- `subject`: string
- `was_comment`: boolean
- `author`: string
- `first_message`: number | null
- `first_message_name`: string | null
- `created`: number
- `created_utc`: number
- `dest`: string
- `body`: string
- `body_html`: string
- `name`: string
- `distinguished`: "moderator" | "admin" | "special" | null
- `new`: boolean
- `replies`: `ThingListing<Message>` | ""
- `parent_id`: string | null
- `subreddit`: string | null
- `score`: number
- `likes`: boolean | null
- `author_fullname`: string
- `context`: string
- `num_comments`: number | null
- `subreddit_name_prefixed`: string | null
- `type`: "comment" | "unknown"
- `associated_awarding_id`: string | null

**Usage Example:**

```typescript
// Get the first 10 messages from the inbox
const inboxMessages = await reddit.privateMessages.getMessages({ where: 'inbox', limit: 10 });

// Get unread messages and mark them as read
const unreadMessages = await reddit.privateMessages.getMessages({ where: 'unread', mark: true });
```  
