## Function: `getUpdate`

Retrieves a specific update from a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread.
- `updateId` (string): The ID of the update to retrieve.

**Return Value:**

- `Promise<LiveUpdate>`: A promise that resolves to the live update object.

**LiveUpdate Type:**

```typescript
export interface LiveUpdate {
  id: string; // The ID of the update
  body: string; // The markdown-formatted body of the update
  author: string; // The username of the author of the update
  created_at: number; // The time the update was created
}
```

**Usage Examples:**

```typescript
// Get a specific update from a live thread
const liveUpdate = await reddit.api.liveThreads.getUpdate({
  threadId: 'some_thread_id',
  updateId: 'some_update_id',
});
console.log(liveUpdate);
```
