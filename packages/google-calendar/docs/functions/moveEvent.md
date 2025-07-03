## Function: `moveEvent`

Moves an existing event from a specified source calendar to a destination calendar.

**Purpose:**
To transfer an event between calendars, for example, from a personal calendar to a shared team calendar, or vice-versa. This operation typically preserves most event details but assigns it a new ID in the destination calendar.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the source calendar from which the event will be moved. Typically 'primary' or a specific calendar ID.
- `eventId`: `string` (required) - The identifier of the event to be moved.
- `destination`: `string` (required) - The identifier of the destination calendar to which the event will be moved. Typically 'primary' or a specific calendar ID.
- `sendUpdates`: `string` (optional) - Specifies whether to send notifications about the move to attendees. Valid values are:
  - `"all"`: Send notifications to all attendees.
  - `"externalOnly"`: Send notifications only to attendees external to the calendar's domain.
  - `"none"`: Do not send any notifications. (Default)

**Return Value:**
- `Promise<Event>`: A promise that resolves to an `Event` object representing the event in its new location (the destination calendar). This event object will have a new ID.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Move an event to the primary calendar without sending updates
async function moveEventToPrimary() {
  const sourceCalendarId = 'work@example.com';
  const eventIdToMove = 'eventToMoveFromWorkCalendar';
  const destinationCalendarId = 'primary';
  try {
    const movedEvent = await sdk.moveEvent(sourceCalendarId, eventIdToMove, destinationCalendarId);
    console.log(`Event moved successfully. New Event ID: ${movedEvent.id} in calendar ${destinationCalendarId}`);
  } catch (error) {
    console.error('Error moving event:', error);
  }
}

// Example 2: Move an event to a shared calendar and notify all attendees
async function moveEventToSharedAndNotify() {
  const sourceCalendarId = 'primary';
  const eventIdToMove = 'personalEventToShare';
  const destinationCalendarId = 'team-calendar@example.com';
  try {
    const movedEvent = await sdk.moveEvent(sourceCalendarId, eventIdToMove, destinationCalendarId, 'all');
    console.log(`Event moved to ${destinationCalendarId} and attendees notified. New ID: ${movedEvent.id}`);
  } catch (error) {
    console.error('Error moving event:', error);
  }
}
```