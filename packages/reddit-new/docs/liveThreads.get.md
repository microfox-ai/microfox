## Function: `get`

Retrieves one or more live threads by their fullnames or IDs.

**Parameters:**

- `names` (string): A comma-delimited list of live thread fullnames or IDs.

**Return Value:**

- `Promise<Listing<LiveThread>>`: A promise that resolves to a listing of live thread objects.

**LiveThread Type:**

```typescript
export interface LiveThread {
  id: string; // The ID of the live thread
  title: string; // The title of the live thread
  description?: string; // The description of the live thread
  nsfw?: boolean; // Whether the live thread is NSFW
  resources?: string; // The resources section of the live thread
  created_at: number; // The time the thread was created
  state: 'live' | 'complete'; // The state of the thread
}
```

**Usage Examples:**

```typescript
// Get a single live thread by ID
const liveThread = await reddit.api.liveThreads.get({
  names: 'some_thread_id',
});
console.log(liveThread);

// Get multiple live threads by ID
const liveThreads = await reddit.api.liveThreads.get({
  names: 'some_thread_id,another_thread_id',
});
console.log(liveThreads);
```
