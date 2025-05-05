## Function: `appendEvent`

Appends an event to a session.

**Purpose:**
Adds a new event to the session's event log.

**Parameters:**
- `sessionId`: string, required. The ID of the session.
- `event`: Event, required. The event to append.
  - `id`: string. Unique identifier for the event.
  - `timestamp`: Date. Timestamp of when the event occurred.
  - `author`: string. Author of the event.
  - `actions`: array<unknown>. Actions associated with the event.

**Return Value:**
- `Promise<void>`: A promise that resolves when the event has been appended.

**Examples:**
```typescript
const event = {
  id: "event456",
  timestamp: new Date(),
  author: "user123",
  actions: [],
};
await adk.appendEvent("sessionId123", event);
```