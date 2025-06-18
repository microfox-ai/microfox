## Function: `hideAnnouncement`

Part of the `announcements` section. Hides one or more announcements.

**Parameters:**

- `params`: object
  - An object containing the announcement IDs to hide.
  - `ids`: string - A comma-separated list of announcement fullnames to hide.

**Return Value:**

- `Promise<void>`: A promise that resolves when the announcements have been successfully hidden.

**Usage Example:**

```typescript
// Example: Hide specific announcements
const announcementIdsToHide = 'ann_1,ann_2';
await redditSdk.api.announcements.hideAnnouncement({ ids: announcementIdsToHide });
console.log('Announcements hidden.');
``` 