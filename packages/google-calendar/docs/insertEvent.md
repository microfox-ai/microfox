## Function: `insertEvent`

Creates and inserts a new event into the specified calendar.

**Purpose:**
To add a new event to a user's calendar with specified details like summary, start/end times, attendees, etc.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar where the event will be inserted. Typically 'primary' for the user's primary calendar, or the calendar's specific ID.
- `event`: `Event & { end: EventDateTime; start: EventDateTime; }` (required) - An `Event` object representing the event to be created. The `start` and `end` properties are mandatory for `insertEvent`.
  - `Event`: An object representing a calendar event. Key properties for insertion include:
    - `summary`: `string` (optional) - The title of the event.
    - `description`: `string` (optional) - A description of the event.
    - `start`: `EventDateTime` (required object) - The start time/date of the event. Must contain either `date` (for all-day events, YYYY-MM-DD) or `dateTime` (for timed events, RFC3339 format), and optionally `timeZone`.
    - `end`: `EventDateTime` (required object) - The end time/date of the event. Must contain either `date` or `dateTime`, and optionally `timeZone`.
    - `attendees`: `array<object>` (optional) - List of attendees, each with an `email` property.
    - `location`: `string` (optional) - Location of the event.
    - `reminders`: `object` (optional) - Event reminders, e.g., `{ useDefault: false, overrides: [{ method: 'popup', minutes: 10 }] }`.
    - `conferenceData`: `object` (optional) - Conference details, e.g., for creating a Google Meet link.
    - (Other properties as defined by the Google Calendar API for an event resource)
  - `EventDateTime`: An object with `date` or `dateTime`, and `timeZone`.
- `params`: `object` (optional) - An object containing additional query parameters.
  - `conferenceDataVersion`: `string` (optional) - Version of the conference data supported. `"0"` or `"1"` (default).
  - `maxAttendees`: `string` (optional) - Maximum number of attendees to return in the response if attendees are being processed.
  - `sendUpdates`: `string` (optional) - Whether to send notifications to attendees. Valid values: `"all"`, `"externalOnly"`, `"none"` (default).
  - `supportsAttachments`: `string` (optional) - Whether client supports attachments. `"true"` or `"false"` (default).

**Return Value:**
- `Promise<Event>`: A promise that resolves to an `Event` object representing the newly created event, including its server-assigned ID and other details.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Insert a simple timed event
async function createTimedEvent() {
  const newEvent = {
    summary: 'Project Meeting',
    location: 'Conference Room A',
    description: 'Discuss project milestones.',
    start: {
      dateTime: '2024-10-01T10:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: '2024-10-01T11:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
    attendees: [
      { email: 'user1@example.com' },
      { email: 'user2@example.com' },
    ],
  };
  try {
    const createdEvent = await sdk.insertEvent('primary', newEvent, { sendUpdates: 'all' });
    console.log('Event created successfully:', createdEvent.id);
    console.log('HTML Link:', createdEvent.htmlLink);
  } catch (error) {
    console.error('Error inserting event:', error);
  }
}

// Example 2: Insert an all-day event with conference data
async function createAllDayEventWithMeet() {
  const newEvent = {
    summary: 'Company Offsite',
    start: { date: '2024-11-15' }, // All-day event
    end: { date: '2024-11-16' },   // All-day event, ends before this date
    conferenceData: {
      createRequest: {
        requestId: 'some-unique-string-for-this-request',
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };
  try {
    const createdEvent = await sdk.insertEvent('primary', newEvent, {
      conferenceDataVersion: '1',
    });
    console.log('All-day event created:', createdEvent.id);
    if (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints) {
      console.log('Google Meet Link:', createdEvent.conferenceData.entryPoints[0].uri);
    }
  } catch (error) {
    console.error('Error inserting event:', error);
  }
}
```