## Function: `updateCalendarInList`

Updates an existing calendar on the user's calendar list. This method allows modifying properties of a calendar that the user has already added to their list.

**Purpose:**
To modify attributes of a specific calendar in the user's calendar list, such as its color or notification settings.

**Parameters:**
- `calendarId` (string, required): The calendar identifier. To retrieve calendar IDs call the `listCalendarList` method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
- `calendarListEntry` (object, required): A `CalendarListEntry` object containing the fields to update. Only the fields present in the request body will be updated.
  - `CalendarListEntry` (object): Refer to the `CalendarListEntry` type definition for its detailed structure. The `id` field within this object must match the `calendarId` path parameter.
- `colorRgbFormat` (optional string): Whether to use true RGB values for colors returned with the API. Optional. The default is False.
  If `true`, colors will be provided as RGB strings (e.g., `"#RRGGBB"`). Otherwise, colors will be provided as a standard Google Calendar color name (e.g., `"blue"`).

**Return Value:**
- A `Promise` that resolves to an updated `CalendarListEntry` object.
- `CalendarListEntry` (object): The updated calendar list entry. Refer to the `CalendarListEntry` type definition for its detailed structure.

**Examples:**
```typescript
// Example 1: Update calendar color
const calendarIdToUpdate = 'examplecalendar@group.calendar.google.com';
const updatedEntryDetails: Partial<CalendarListEntry> = {
  backgroundColor: '#0088aa', // New background color
  foregroundColor: '#ffffff'  // New foreground color
};

const updatedCalendarEntry = await sdk.updateCalendarInList(
  calendarIdToUpdate,
  updatedEntryDetails as CalendarListEntry // Cast as CalendarListEntry, ensure 'id' is not set here or matches
);
console.log('Updated calendar entry:', updatedCalendarEntry);

// Example 2: Update notification settings for a calendar
const calendarIdForNotifications = 'primary';
const notificationSettings: Partial<CalendarListEntry> = {
  notificationSettings: {
    notifications: [
      { type: 'eventCreation', method: 'email' },
      { type: 'eventChange', method: 'email' }
    ]
  }
};

const calendarWithNewNotifications = await sdk.updateCalendarInList(
  calendarIdForNotifications,
  notificationSettings as CalendarListEntry
);
console.log('Calendar with updated notifications:', calendarWithNewNotifications);

// Example 3: Update calendar using colorRgbFormat
const calendarIdRgb = 'anothercalendar@group.calendar.google.com';
const entryDetailsRgb: Partial<CalendarListEntry> = {
  summaryOverride: 'My Favorite Calendar (RGB)'
};

const updatedCalendarRgb = await sdk.updateCalendarInList(
  calendarIdRgb,
  entryDetailsRgb as CalendarListEntry,
  "true" // colorRgbFormat
);
console.log('Updated calendar entry (RGB):', updatedCalendarRgb);
```