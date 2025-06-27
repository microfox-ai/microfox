## Function: `readAllAnnouncements`

Part of the `announcements` section. Marks all announcements as read.

**Parameters:**

This function does not take any parameters.

**Return Value:**

- `Promise<void>`: A promise that resolves when all announcements have been successfully marked as read.

**Usage Example:**

```typescript
// Example: Mark all announcements as read
await redditSdk.api.announcements.readAllAnnouncements();
console.log('All announcements marked as read.');
``` 