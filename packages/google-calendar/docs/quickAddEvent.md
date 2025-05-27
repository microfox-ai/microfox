## Function: `quickAddEvent`

Creates an event on the specified calendar based on a single text string. Google Calendar's natural language processing attempts to parse the details (like title, date, time, and location) from this text.

**Purpose:**
To allow users to create events quickly by typing a phrase, similar to how they might in the Google Calendar interface (e.g., "Dinner with John tomorrow at 7pm at The Italian Place").

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar where the event will be added. Typically 'primary' or a specific calendar ID.
- `text`: `string` (required) - The natural language text describing the event. For example, "Appointment at Dr. Smith's office on June 3rd 10am-10:25am".
- `sendUpdates`: `string` (optional) - Specifies whether to send notifications about the creation of this event to attendees (if any are parsed from the text or default attendees exist for the calendar). Valid values are:
  - `"all"`: Send notifications to all attendees.
  - `"externalOnly"`: Send notifications only to attendees external to the calendar's domain.
  - `"none"`: Do not send any notifications. (Default)

**Return Value:**
- `Promise<Event>`: A promise that resolves to an `Event` object representing the newly created event, as parsed and created by Google Calendar. This includes its server-assigned ID and other details interpreted from the text.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Quick add an event without sending updates
async function quickCreateEvent() {
  const eventText = 'Team lunch next Friday at 1pm at The Cafe';
  try {
    const createdEvent = await sdk.quickAddEvent('primary', eventText);
    console.log('Event created successfully via Quick Add:', createdEvent.id);
    console.log('Summary:', createdEvent.summary);
    console.log('Start Time:', createdEvent.start.dateTime || createdEvent.start.date);
  } catch (error) {
    console.error('Error using Quick Add:', error);
  }
}

// Example 2: Quick add an event and attempt to send updates
async function quickCreateAndNotify() {
  const eventText = 'Project deadline review with sarah@example.com on Tuesday 3 PM';
  try {
    const createdEvent = await sdk.quickAddEvent('primary', eventText, 'all');
    console.log('Event created and notification attempt made:', createdEvent.id);
    if (createdEvent.attendees) {
      console.log('Attendees:', createdEvent.attendees.map(a => a.email).join(', '));
    }
  } catch (error) {
    console.error('Error using Quick Add:', error);
  }
}
```