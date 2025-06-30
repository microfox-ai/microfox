## Function: `unreadAnnouncement`

Part of the `announcements` section. Marks one or more announcements as unread.

**Parameters:**

- `params`: object
  - An object containing the announcement IDs to mark as unread.
  - `ids`: string - A comma-separated list of announcement fullnames to mark as unread.

**Return Value:**

- `Promise<void>`: A promise that resolves when the announcements have been successfully marked as unread.

**Usage Example:**

```typescript
// Example: Mark specific announcements as unread
const announcementIdsToUnread = 'ann_1,ann_2';
await redditSdk.api.announcements.unreadAnnouncement({ ids: announcementIdsToUnread });
console.log('Announcements marked as unread.');
``` 