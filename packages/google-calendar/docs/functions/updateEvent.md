## Function: `updateEvent`

Modifies an existing event in the specified calendar. Only the fields provided in the `event` object will be updated; other fields will remain unchanged (unless they are dependent on changed fields, e.g., `updated` timestamp).

**Purpose:**
To change details of an existing event, such as its summary, description, start/end times, attendees, location, or conference information.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar containing the event. Typically 'primary' or a specific calendar ID.
- `eventId`: `string` (required) - The identifier of the event to be updated.
- `event`: `Event` (required) - An `Event` object containing the fields to be updated. The structure should conform to the Google Calendar API's event resource schema. Any field included will be updated; fields not included will retain their current values.
  - `Event`: An object representing a calendar event. Properties that can be updated include:
    - `summary`: `string`
    - `description`: `string`
    - `start`: `EventDateTime` (object)
    - `end`: `EventDateTime` (object)
    - `attendees`: `array<object>`
    - `location`: `string`
    - `status`: `string` (e.g., "confirmed", "cancelled")
    - `reminders`: `object`
    - `conferenceData`: `object`
    - (And other modifiable event properties)
- `params`: `object` (optional) - An object containing additional query parameters.
  - `conferenceDataVersion`: `string` (optional) - Version of conference data support. `"0"` or `"1"` (default).
  - `maxAttendees`: `string` (optional) - Maximum number of attendees to return in the response.
  - `sendUpdates`: `string` (optional) - Whether to send notifications to attendees. Valid values: `"all"`, `"externalOnly"`, `"none"` (default).
  - `supportsAttachments`: `string` (optional) - Whether client supports attachments. `"true"` or `"false"` (default).

**Return Value:**
- `Promise<Event>`: A promise that resolves to an `Event` object representing the updated event, including its server-modified properties like the `updated` timestamp.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Update an event's summary and location
async function modifyEventDetails() {
  const eventIdToUpdate = 'existingEventId';
  const updatedEventData = {
    summary: 'Updated Project Meeting Title',
    location: 'Virtual Meeting Room',
  };
  try {
    const updatedEvent = await sdk.updateEvent('primary', eventIdToUpdate, updatedEventData, { sendUpdates: 'all' });
    console.log('Event updated successfully:', updatedEvent.id);
    console.log('New Summary:', updatedEvent.summary);
    console.log('New Location:', updatedEvent.location);
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

// Example 2: Reschedule an event (update start and end times)
async function rescheduleEvent() {
  const eventIdToReschedule = 'anotherEventId';
  const newTimes = {
    start: {
      dateTime: '2024-10-02T14:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: '2024-10-02T15:00:00-07:00',
      timeZone: 'America/Los_Angeles',
    },
  };
  try {
    const updatedEvent = await sdk.updateEvent('primary', eventIdToReschedule, newTimes, {
      sendUpdates: 'externalOnly',
      conferenceDataVersion: '1' // If managing conference data
    });
    console.log('Event rescheduled successfully. New start time:', updatedEvent.start.dateTime);
  } catch (error) {
    console.error('Error updating event:', error);
  }
}

// Example 3: Cancel an event by updating its status
async function cancelMyEvent() {
  const eventIdToCancel = 'eventToCancelId';
  const cancellationUpdate = {
    status: 'cancelled'
  };
  try {
    const updatedEvent = await sdk.updateEvent('primary', eventIdToCancel, cancellationUpdate, { sendUpdates: 'all' });
    console.log(`Event ${updatedEvent.id} status changed to: ${updatedEvent.status}`);
  } catch (error) {
    console.error('Error cancelling event:', error);
  }
}
```