## Function: `getEvent`

Retrieves detailed information about a specific event from the specified calendar.

**Purpose:**
To fetch the details of a calendar event, such as its summary, description, start and end times, attendees, and location.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar containing the event. Typically 'primary' for the user's primary calendar, or the calendar's specific ID.
- `eventId`: `string` (required) - The identifier of the event to retrieve.
- `params`: `object` (optional) - An object containing additional query parameters.
  - `maxAttendees`: `string` (optional) - The maximum number of attendees to include in the response. If not specified, the default number is returned by the API.
  - `timeZone`: `string` (optional) - The IANA time zone name in which to interpret `timeMin` and `timeMax` if they were provided (though not directly in this function's parameters, they are relevant for event representation). It also affects how event times are displayed if they are not timezone-specific.

**Return Value:**
- `Promise<Event>`: A promise that resolves to an `Event` object containing the details of the retrieved event.
  - `Event`: An object representing a calendar event. Key properties include:
    - `id`: `string` - The event's unique identifier.
    - `summary`: `string` - The title or summary of the event.
    - `description`: `string` (optional) - A detailed description of the event.
    - `location`: `string` (optional) - The geographical location of the event.
    - `start`: `EventDateTime` (object) - The start time of the event. Contains `date` (for all-day events) or `dateTime` (for timed events) and `timeZone`.
    - `end`: `EventDateTime` (object) - The end time of the event. Contains `date` or `dateTime` and `timeZone`.
    - `attendees`: `array<object>` (optional) - A list of attendees, each with properties like `email`, `displayName`, `responseStatus`.
    - `organizer`: `object` (optional) - The organizer of the event, with properties like `email`, `displayName`.
    - `status`: `string` - The event's status (e.g., "confirmed", "tentative", "cancelled").
    - `htmlLink`: `string` - A link to the event in the Google Calendar UI.
    - (Other properties as defined by the Google Calendar API for an event resource)

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Get an event with minimal parameters
async function fetchEventDetails() {
  try {
    const event = await sdk.getEvent('primary', 'specificEventId');
    console.log('Event Summary:', event.summary);
    console.log('Start Time:', event.start.dateTime || event.start.date);
  } catch (error) {
    console.error('Error fetching event:', error);
  }
}

// Example 2: Get an event with optional parameters
async function fetchEventWithMaxAttendees() {
  try {
    const event = await sdk.getEvent('primary', 'anotherEventId', {
      maxAttendees: '10',
      timeZone: 'America/New_York'
    });
    console.log('Event Details:', event);
    if (event.attendees) {
      console.log(`Fetched up to ${event.attendees.length} attendees.`);
    }
  } catch (error) {
    console.error('Error fetching event:', error);
  }
}
```