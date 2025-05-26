## Function: `deleteEvent`

Deletes an event from the specified calendar. If the event is recurring, this operation deletes the single instance or the entire series, depending on the API's default behavior for such events unless specified otherwise (though this SDK method doesn't directly expose instance deletion vs. series deletion for recurring events via a specific parameter beyond `eventId`).

**Purpose:**
To remove an event from a user's calendar. This is useful for managing event lifecycles, such as when an event is cancelled or no longer relevant.

**Parameters:**
- `calendarId`: `string` (required) - The identifier of the calendar from which the event will be deleted. Typically 'primary' for the user's primary calendar, or the calendar's specific ID.
- `eventId`: `string` (required) - The identifier of the event to be deleted.
- `sendUpdates`: `string` (optional) - Specifies whether to send notifications about the deletion to attendees. Valid values are:
  - `"all"`: Send notifications to all attendees.
  - `"externalOnly"`: Send notifications only to attendees external to the calendar's domain.
  - `"none"`: Do not send any notifications. (Default)

**Return Value:**
- `Promise<void>`: A promise that resolves when the event has been successfully deleted. It does not return any value upon successful completion.

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Delete an event without sending updates
async function deleteMyEvent() {
  try {
    await sdk.deleteEvent('primary', 'eventIdToDelete');
    console.log('Event deleted successfully.');
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}

// Example 2: Delete an event and notify all attendees
async function deleteEventAndNotify() {
  try {
    await sdk.deleteEvent('primary', 'anotherEventId', 'all');
    console.log('Event deleted and attendees notified.');
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}

// Example 3: Delete an event from a specific calendar ID
async function deleteEventFromSharedCalendar() {
  try {
    await sdk.deleteEvent('calendarId@group.calendar.google.com', 'sharedCalendarEventId', 'none');
    console.log('Event deleted from shared calendar.');
  } catch (error) {
    console.error('Error deleting event:', error);
  }
}
```