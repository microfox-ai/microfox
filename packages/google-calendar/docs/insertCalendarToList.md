## Function: `insertCalendarToList`

Adds an existing calendar to the authenticated user's calendar list. This makes the calendar visible and accessible to the user through their Google Calendar interface.

**Purpose:**
To subscribe the user to an existing calendar or add a calendar they own (but is not yet in their list) to their calendar list, allowing them to view and interact with it.

**Parameters:**
- `calendarListEntry`: `CalendarListEntry` (required) - A `CalendarListEntry` object representing the calendar to be added. The most important field to provide in this object is `id`, which is the identifier of the calendar to add.
  The `CalendarListEntry` object structure (relevant fields for insertion):
  ```typescript
  interface CalendarListEntry {
    id: string; // Required. The identifier of the calendar to add.
    // Optional fields that can be set when adding:
    hidden?: boolean; // Whether the calendar should be hidden in the list. Default: false.
    selected?: boolean; // Whether the calendar should be selected to be displayed. Default: true.
    colorId?: string; // The color of the calendar (ID from colors endpoint).
    backgroundColor?: string; // The main color of the calendar (#RRGGBB).
    foregroundColor?: string; // The foreground color of the calendar (#RRGGBB).
    defaultReminders?: Array<{ method: string; minutes: number }>; // Default reminders for events on this calendar.
    notificationSettings?: {
      notifications: Array<{ type: string; method: string }>; // Notification settings.
    };
    // Fields like summary, description, accessRole are typically read-only when inserting
    // a calendar to the list, as they are properties of the calendar itself.
  }
  ```
- `colorRgbFormat`: string (optional) - Whether to use RRGGBB format for color properties (`backgroundColor`, `foregroundColor`). If `true`, the API returns colors in RRGGBB format. If `false` or not specified, colors are returned in the palette index format. This parameter only affects the response, not the input format for `backgroundColor` and `foregroundColor` which should always be RRGGBB if provided.

**Return Value:**
`Promise<CalendarListEntry>` - A promise that resolves to a `CalendarListEntry` object representing the newly added calendar in the user's list. This object will include all properties of the calendar as it appears in the list, potentially updated with server-side defaults or information.
An error is thrown if the operation fails, for example, if the calendar ID is invalid, the calendar does not exist, the user does not have permission to add it, or it's already in their list.

**Examples:**
```typescript
// Example 1: Add an existing public calendar to the user's list
async function addPublicHolidayCalendar() {
  const calendarToAdd: Pick<CalendarListEntry, 'id'> = {
    id: "en.usa#holiday@group.v.calendar.google.com", // Example: US Holidays calendar
  };
  try {
    const addedCalendarEntry = await calendarSdk.insertCalendarToList(calendarToAdd as CalendarListEntry);
    console.log("Calendar added to list successfully:", addedCalendarEntry);
    console.log(`Calendar Summary: ${addedCalendarEntry.summary}`);
  } catch (error) {
    console.error("Failed to add calendar to list:", error);
  }
}

// Example 2: Add a calendar and set some initial properties
async function addSharedCalendarWithSettings() {
  const calendarToAdd: Partial<CalendarListEntry> = {
    id: "shared.project.calendar@example.com",
    hidden: false,
    selected: true,
    colorId: "10", // Example color ID
    defaultReminders: [{ method: "popup", minutes: 30 }],
  };
  try {
    const addedCalendarEntry = await calendarSdk.insertCalendarToList(
      calendarToAdd as CalendarListEntry,
      "true" // Request colors in RGB format in the response
    );
    console.log("Shared calendar added with custom settings:", addedCalendarEntry);
    if (addedCalendarEntry.backgroundColor) {
      console.log(`Background color (RGB): ${addedCalendarEntry.backgroundColor}`);
    }
  } catch (error) {
    console.error("Failed to add shared calendar:", error);
  }
}
```