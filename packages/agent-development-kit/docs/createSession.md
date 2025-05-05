## Function: `createSession`

Creates a new session.

**Purpose:**
Starts a new session for agent interactions.

**Parameters:**
- `appName`: string, required. The name of the application creating the session.
- `userId`: string, optional. The ID of the user creating the session.

**Return Value:**
- `Promise<Session>`: A promise that resolves to the created Session object.
  - `id`: string. Unique identifier for the session.
  - `state`: Record<string, unknown>. Current state of the session.
  - `events`: array<Event>. List of events in the session.
    - `id`: string. Unique identifier for the event.
    - `timestamp`: Date. Timestamp of when the event occurred.
    - `author`: string. Author of the event.
    - `actions`: array<unknown>. Actions associated with the event.

**Examples:**
```typescript
// Example 1: Minimal usage
const session = await adk.createSession("myApp");

// Example 2: With userId
const session = await adk.createSession("myApp", "user123");
```