## Function: `getSession`

Retrieves a session by its ID.

**Purpose:**
Fetches an existing session from the backend.

**Parameters:**
- `sessionId`: string, required. The ID of the session to retrieve.

**Return Value:**
- `Promise<Session>`: A promise that resolves to the retrieved Session object.
  - `id`: string. Unique identifier for the session.
  - `state`: Record<string, unknown>. Current state of the session.
  - `events`: array<Event>. List of events in the session.
    - `id`: string. Unique identifier for the event.
    - `timestamp`: Date. Timestamp of when the event occurred.
    - `author`: string. Author of the event.
    - `actions`: array<unknown>. Actions associated with the event.

**Examples:**
```typescript
const session = await adk.getSession("sessionId123");
```