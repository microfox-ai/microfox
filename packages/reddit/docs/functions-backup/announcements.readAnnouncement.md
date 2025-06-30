## Function: `readAnnouncement`

Part of the `announcements` section. Marks one or more announcements as read.

**Parameters:**

- `params`: object
  - An object containing the announcement IDs to mark as read.
  - `ids`: string - A comma-separated list of announcement fullnames to mark as read.

**Return Value:**

- `Promise<void>`: A promise that resolves when the announcements have been successfully marked as read.

**Usage Example:**

```typescript
// Example: Mark specific announcements as read
const announcementIdsToRead = 'ann_1,ann_2';
await redditSdk.api.announcements.readAnnouncement({ ids: announcementIdsToRead });
console.log('Announcements marked as read.');
``` 