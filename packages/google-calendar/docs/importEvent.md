## Function: `importEvent`

Imports an event into the specified calendar. This method allows for greater control over event creation, including setting properties like the event's original iCalendar UID.

**Purpose:**
To add an event to a calendar, often used when migrating events from other systems or when needing to specify iCalendar-specific properties.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar into which the event will be imported. Typically 'primary' for the user's primary calendar, or the calendar's specific ID.
- `event`: `Event` (required) - An `Event` object representing the event to be imported. The structure of this object should conform to the Google Calendar API's event resource schema.
  - `Event`: An object representing a calendar event. Key properties for import include:
    - `summary`: `string` - The title of the event.
    - `description`: `string` (optional) - A description of the event.
    - `start`: `EventDateTime` (object) - The start time/date of the event.
    - `end`: `EventDateTime` (object) - The end time/date of the event.
    - `iCalUID`: `string` (optional but often used with import) - The original iCalendar UID of the event.
    - (Other properties like `location`, `attendees`, `reminders`, `conferenceData` etc.)
- `params`: `object` (optional) - An object containing additional query parameters.
  - `conferenceDataVersion`: `string` (optional) - Version of the conference data supported by the client. 
    - `"0"`: Unspecified conference data is supported.
    - `"1"`: Conference data is supported (default).
  - `supportsAttachments`: `string` (optional) - Whether the client supports attachments with this event. 
    - `"true"`: Client supports attachments.
    - `"false"`: Client does not support attachments (default).

**Return Value:**
- `Promise<Event>`: A promise that resolves to an `Event` object representing the newly imported event, including its server-assigned ID and other details.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Import a basic event
async function importBasicEvent() {
  const newEvent = {
    summary: 'Team Meeting (Imported)',
    start: { dateTime: '2024-09-15T10:00:00-07:00', timeZone: 'America/Los_Angeles' },
    end: { dateTime: '2024-09-15T11:00:00-07:00', timeZone: 'America/Los_Angeles' },
    iCalUID: 'unique-event-uid-for-import@example.com' // Important for idempotent imports
  };
  try {
    const importedEvent = await sdk.importEvent('primary', newEvent);
    console.log('Event imported successfully:', importedEvent.id);
  } catch (error) {
    console.error('Error importing event:', error);
  }
}

// Example 2: Import an event with conference data and attachment support indicated
async function importAdvancedEvent() {
  const eventWithConference = {
    summary: 'Project Sync (Imported)',
    start: { date: '2024-09-20' }, // All-day event
    end: { date: '2024-09-21' },   // All-day event, ends before this date
    conferenceData: {
      createRequest: {
        requestId: 'random-request-id-for-conference',
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };
  try {
    const importedEvent = await sdk.importEvent('primary', eventWithConference, {
      conferenceDataVersion: '1',
      supportsAttachments: 'true'
    });
    console.log('Advanced event imported:', importedEvent.id);
    if (importedEvent.conferenceData && importedEvent.conferenceData.entryPoints) {
      console.log('Conference Link:', importedEvent.conferenceData.entryPoints[0].uri);
    }
  } catch (error) {
    console.error('Error importing event:', error);
  }
}
```