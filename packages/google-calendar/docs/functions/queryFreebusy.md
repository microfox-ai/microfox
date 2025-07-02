## Function: `queryFreebusy`

Retrieves the free/busy information for a set of calendars within a given time range. This allows checking for available time slots without accessing the full details of the events.

**Purpose:**
To determine when specified calendars are busy or free, commonly used for scheduling purposes, finding meeting availability, or resource booking.

**Parameters:**
- `freeBusyRequest`: `FreeBusyRequest` (required) - An object defining the parameters for the free/busy query.
  - `FreeBusyRequest`: An object with the following properties:
    - `timeMin`: `string` (required) - The start of the interval for the query, as an RFC3339 timestamp.
    - `timeMax`: `string` (required) - The end of the interval for the query, as an RFC3339 timestamp.
    - `timeZone`: `string` (optional) - The IANA time zone name in which `timeMin` and `timeMax` are to be interpreted. If not specified, UTC is assumed.
    - `groupExpansionMax`: `string` (optional) - The maximum number of members whose free/busy data to return if a group ID is specified in `items`.
    - `calendarExpansionMax`: `string` (optional) - The maximum number of calendars for which to return free/busy data if a calendar that refers to other calendars (e.g., a resource calendar) is specified in `items`.
    - `items`: `array<object>` (required) - A list of calendars and/or groups to query. Each object in the array must have an `id` property.
      - `id`: `string` - The identifier of a calendar or group to query. For calendars, this is the calendar ID (e.g., 'primary', 'user@example.com', 'calendarId@group.calendar.google.com').

**Return Value:**
- `Promise<FreeBusyResponse>`: A promise that resolves to a `FreeBusyResponse` object containing the aggregated free/busy data.
  - `FreeBusyResponse`: An object with the following key properties:
    - `kind`: `string` - Typically "calendar#freeBusy".
    - `timeMin`: `string` - The start of the interval covered by this response (RFC3339 timestamp).
    - `timeMax`: `string` - The end of the interval covered by this response (RFC3339 timestamp).
    - `calendars`: `object` - An object where each key is a calendar ID from the request, and the value is an object containing:
      - `busy`: `array<object>` - A list of busy time intervals. Each interval object has `start` and `end` properties (RFC3339 timestamps).
      - `errors`: `array<object>` (optional) - A list of errors encountered while querying this calendar, each with `domain` and `reason`.
    - `groups`: `object` (optional) - Similar to `calendars`, but for group IDs, if groups were queried.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Query free/busy for two calendars for the next 24 hours
async function checkAvailabilityForToday() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const requestBody = {
    timeMin: now.toISOString(),
    timeMax: tomorrow.toISOString(),
    timeZone: 'America/New_York',
    items: [
      { id: 'primary' },
      { id: 'user2@example.com' }
    ]
  };

  try {
    const response = await sdk.queryFreebusy(requestBody);
    console.log('Free/Busy Information:');
    for (const calendarId in response.calendars) {
      console.log(`Calendar: ${calendarId}`);
      const calendarInfo = response.calendars[calendarId];
      if (calendarInfo.errors) {
        console.log('  Errors:', calendarInfo.errors);
      }
      if (calendarInfo.busy && calendarInfo.busy.length > 0) {
        calendarInfo.busy.forEach(slot => {
          console.log(`  Busy from ${slot.start} to ${slot.end}`);
        });
      } else {
        console.log('  Completely free during this period.');
      }
    }
  } catch (error) {
    console.error('Error querying free/busy:', error);
  }
}

// Example 2: Query free/busy for a specific work week
async function checkWorkWeekAvailability() {
  const requestBody = {
    timeMin: '2024-10-07T00:00:00Z', // Monday morning UTC
    timeMax: '2024-10-11T23:59:59Z', // Friday evening UTC
    items: [{ id: 'team-resource-calendar@example.com' }]
  };

  try {
    const response = await sdk.queryFreebusy(requestBody);
    const calendarId = 'team-resource-calendar@example.com';
    console.log(`Busy slots for ${calendarId}:`);
    response.calendars[calendarId].busy.forEach(slot => {
      console.log(`  - Start: ${slot.start}, End: ${slot.end}`);
    });
  } catch (error) {
    console.error('Error querying free/busy:', error);
  }
}
```