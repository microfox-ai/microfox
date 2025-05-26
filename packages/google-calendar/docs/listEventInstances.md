## Function: `listEventInstances`

Retrieves a list of instances for a given recurring event. This is useful for finding all occurrences of a repeating event within a specific date range.

**Purpose:**
To get all individual occurrences (instances) of a recurring event, for example, to display them in a list or on a calendar view for a specific period.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar containing the recurring event. Typically 'primary' or a specific calendar ID.
- `eventId`: `string` (required) - The identifier of the recurring event for which to list instances.
- `params`: `object` (optional) - An object containing additional query parameters to filter and paginate the results.
  - `maxAttendees`: `string` (optional) - The maximum number of attendees to include in the response for each instance.
  - `maxResults`: `string` (optional) - The maximum number of instances to return. Default is 250, maximum is 2500.
  - `originalStart`: `string` (optional) - The original start time of the instance in RFC3339 format. Use this to retrieve a specific instance if its start time has been modified.
  - `pageToken`: `string` (optional) - Token specifying the next page of results to return.
  - `showDeleted`: `string` (optional) - Whether to include deleted instances (instances that were part of the recurrence pattern but have been individually deleted). Default is `false`.
  - `timeMax`: `string` (optional) - The end of the time window for event instances, as an RFC3339 timestamp. If not specified, the API has a default limit.
  - `timeMin`: `string` (optional) - The start of the time window for event instances, as an RFC3339 timestamp. If not specified, the API has a default limit.
  - `timeZone`: `string` (optional) - The IANA time zone name in which to interpret `timeMin` and `timeMax`.

**Return Value:**
- `Promise<Events>`: A promise that resolves to an `Events` object. This object contains a list of `Event` instances and pagination information.
  - `Events`: An object typically containing:
    - `items`: `array<Event>` - An array of `Event` objects, where each object represents an instance of the recurring event. Each instance will have its own `start` and `end` times.
    - `nextPageToken`: `string` (optional) - Token to retrieve the next page of results. Present if more instances are available.
    - `summary`, `description`, `timeZone`, etc. - Metadata about the collection of events.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: List instances of a recurring event for the next month
async function listUpcomingInstances() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  try {
    const eventInstances = await sdk.listEventInstances('primary', 'recurringEventId', {
      timeMin: now.toISOString(),
      timeMax: nextMonth.toISOString(),
      maxResults: '10'
    });
    console.log(`Found ${eventInstances.items.length} instances:`);
    eventInstances.items.forEach(instance => {
      console.log(`- ${instance.summary} at ${instance.start.dateTime || instance.start.date}`);
    });
    if (eventInstances.nextPageToken) {
      console.log('More instances available. Next page token:', eventInstances.nextPageToken);
    }
  } catch (error) {
    console.error('Error listing event instances:', error);
  }
}

// Example 2: List instances showing deleted ones
async function listAllInstancesIncludingDeleted() {
  try {
    const eventInstances = await sdk.listEventInstances('primary', 'anotherRecurringEventId', {
      showDeleted: 'true',
      timeZone: 'Europe/Berlin'
    });
    console.log('Event instances (including deleted):');
    eventInstances.items.forEach(instance => {
      console.log(`- ${instance.summary} (Status: ${instance.status})`);
    });
  } catch (error) {
    console.error('Error listing event instances:', error);
  }
}
```