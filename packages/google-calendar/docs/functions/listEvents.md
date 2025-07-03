## Function: `listEvents`

Retrieves a list of events from the specified calendar. This function supports numerous query parameters for filtering, sorting, and paginating the results.

**Purpose:**
To fetch multiple events from a calendar, for example, to display a daily, weekly, or monthly view, or to search for specific events based on criteria.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar from which to list events. Typically 'primary' or a specific calendar ID.
- `params`: `object` (optional) - An object containing query parameters to customize the event list.
  - `iCalUID`: `string` (optional) - Specifies an event ID in the iCalendar format to retrieve a specific event.
  - `maxAttendees`: `string` (optional) - Maximum number of attendees to include in the response for each event.
  - `maxResults`: `string` (optional) - Maximum number of events to return. Default is 250, maximum is 2500.
  - `orderBy`: `string` (optional) - The order of the events returned in the result. 
    - `"startTime"`: Order by start time (default for recurring events expanded with `singleEvents=true`).
    - `"updated"`: Order by last modification time (default for non-expanded recurring events).
  - `pageToken`: `string` (optional) - Token specifying the next page of results.
  - `privateExtendedProperty`: `string` (optional) - Extended property (private) query, e.g., `"propName=value"` or `"propName=value1,propName=value2"`.
  - `q`: `string` (optional) - Free text search query terms to find events that match these terms in any field, except for extended properties.
  - `sharedExtendedProperty`: `string` (optional) - Extended property (shared) query.
  - `showDeleted`: `string` (optional) - Whether to include deleted events. Default is `false`.
  - `showHiddenInvitations`: `string` (optional) - Whether to show hidden invitations. Default is `false`.
  - `singleEvents`: `string` (optional) - Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Default is `false`.
  - `syncToken`: `string` (optional) - Token obtained from a previous `listEvents` call to perform an incremental sync.
  - `timeMax`: `string` (optional) - Upper bound (exclusive) for an event's start time to filter by, as an RFC3339 timestamp.
  - `timeMin`: `string` (optional) - Lower bound (inclusive) for an event's end time to filter by, as an RFC3339 timestamp.
  - `timeZone`: `string` (optional) - IANA time zone name. Affects `timeMin` and `timeMax` interpretation.
  - `updatedMin`: `string` (optional) - Lower bound for an event's last modification time (inclusive) to filter by, as an RFC3339 timestamp.

**Return Value:**
- `Promise<Events>`: A promise that resolves to an `Events` object containing a list of `Event` objects and pagination/sync information.
  - `Events`: An object typically containing:
    - `items`: `array<Event>` - An array of `Event` objects matching the query.
    - `nextPageToken`: `string` (optional) - Token to retrieve the next page of results.
    - `nextSyncToken`: `string` (optional) - Token to use for incremental synchronization on the next request.
    - `summary`, `description`, `timeZone`, etc. - Metadata about the calendar or event list.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: List upcoming events for the next 7 days
async function listUpcomingWeekEvents() {
  const timeMin = new Date().toISOString();
  const timeMaxDate = new Date();
  timeMaxDate.setDate(timeMaxDate.getDate() + 7);
  const timeMax = timeMaxDate.toISOString();
  try {
    const eventsResult = await sdk.listEvents('primary', {
      timeMin: timeMin,
      timeMax: timeMax,
      singleEvents: 'true', // Expand recurring events
      orderBy: 'startTime',
      maxResults: '15'
    });
    console.log('Upcoming events:');
    eventsResult.items.forEach(event => {
      console.log(`- ${event.summary} on ${event.start.dateTime || event.start.date}`);
    });
    if (eventsResult.nextPageToken) {
      console.log('More events available. Next page token:', eventsResult.nextPageToken);
    }
  } catch (error) {
    console.error('Error listing events:', error);
  }
}

// Example 2: Search for events with a specific query term
async function searchEvents() {
  try {
    const eventsResult = await sdk.listEvents('primary', {
      q: 'Budget Review',
      maxResults: '5'
    });
    console.log('Events matching "Budget Review":');
    eventsResult.items.forEach(event => {
      console.log(`- ${event.summary} (ID: ${event.id})`);
    });
  } catch (error) {
    console.error('Error searching events:', error);
  }
}

// Example 3: Incremental sync using syncToken
async function syncEvents(syncToken?: string) {
  try {
    const params = syncToken ? { syncToken } : { timeMin: new Date().toISOString() }; // Initial full sync if no token
    const eventsResult = await sdk.listEvents('primary', params);
    console.log('Synced events:', eventsResult.items.length);
    // Process eventsResult.items
    // Store eventsResult.nextSyncToken for the next sync
    const newSyncToken = eventsResult.nextSyncToken;
    console.log('New sync token:', newSyncToken);
    return newSyncToken;
  } catch (error) {
    console.error('Error syncing events:', error);
    if (error.message.includes('410')) { // Full sync required
      console.log('Sync token invalid, performing full sync.');
      return syncEvents(); // Call without syncToken for a full sync
    }
  }
}
```