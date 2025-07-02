## Function: `report`

Reports a live thread.

**Parameters:**

- `threadId` (string): The ID of the live thread to report.
- `type` ('spam' | 'vote-manipulation' | 'personal-information' | 'sexualizing-minors' | 'site-breaking'): The type of report.

**Return Value:**

- `Promise<void>`: A promise that resolves when the thread has been reported.

**Usage Examples:**

```typescript
// Report a live thread for spam
await reddit.api.liveThreads.report({
  threadId: 'some_thread_id',
  type: 'spam',
});
console.log('Live thread has been reported.');
```
