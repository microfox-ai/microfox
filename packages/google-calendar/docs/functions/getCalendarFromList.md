## Function: `getCalendarFromList`

Retrieves a specific calendar entry from the authenticated user's calendar list. This provides details about a calendar that the user is subscribed to or has added to their list.

**Purpose:**
To fetch metadata and settings for a single calendar as it appears in the user's calendar list.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar to retrieve from the user's list. This is typically the email address of the calendar or the calendar's unique ID. Use `"primary"` to refer to the user's primary calendar.

**Return Value:**
`Promise<CalendarListEntry>` - A promise that resolves to a `CalendarListEntry` object. This object contains details about the calendar, such as its ID, summary, description, color, access role for the user, and notification settings.

  The `CalendarListEntry` object has the following structure (key fields):
  ```typescript
  interface CalendarListEntry {
    kind: "calendar#calendarListEntry"; // Type of the resource ("calendar#calendarListEntry").
    etag: string; // ETag of the resource.
    id: string; // Identifier of the calendar list entry.
    summary?: string; // Title of the calendar. Read-only.
    description?: string; // Description of the calendar. Read-only.
    location?: string; // Geographic location of the calendar as free-form text. Read-only.
    timeZone?: string; // The time zone of the calendar. Read-only.
    summaryOverride?: string; // The summary that the authenticated user has set for this calendar (if any).
    colorId?: string; // The color of the calendar. This is an ID referring to an entry in the "calendar" section of the colors definition (see the "colors" endpoint).
    backgroundColor?: string; // The main color of the calendar in the hexadecimal format "#0088aa". This property supersedes the index-based colorId property.
    foregroundColor?: string; // The foreground color of the calendar in the hexadecimal format "#ffffff". This property supersedes the index-based colorId property.
    hidden?: boolean; // Whether the calendar has been hidden from this user's list. Optional. The default is False.
    selected?: boolean; // Whether the calendar is selected to be displayed. Optional. The default is True.
    accessRole: "freeBusyReader" | "reader" | "writer" | "owner"; // The effective access role that the authenticated user has on the calendar. Read-only.
    defaultReminders?: Array<{ method: string; minutes: number }>; // The default reminders that the authenticated user has for this calendar.
    notificationSettings?: {
      notifications: Array<{ type: string; method: string }>; // The list of notifications set for this calendar.
    };
    primary?: boolean; // Whether this is the user's primary calendar. Read-only. Optional. The default is False.
    deleted?: boolean; // Whether the calendar has been deleted from the user's list. Read-only. Optional. The default is False.
    conferenceProperties?: {
      allowedConferenceSolutionTypes?: string[]; // The types of conference solutions that are supported for this calendar.
                                              // The possible values are: "eventHangout", "eventNamedHangout", "hangoutsMeet". Optional.
    };
  }
  ```
  An error is thrown if the operation fails, for example, if the calendar is not in the user's list or the `calendarId` is invalid.

**Examples:**
```typescript
// Example 1: Get the primary calendar from the user's list
async function getPrimaryCalendarDetails() {
  try {
    const calendarEntry = await calendarSdk.getCalendarFromList("primary");
    console.log("Primary Calendar Details:", calendarEntry);
    console.log(`Summary: ${calendarEntry.summary}`);
    console.log(`Access Role: ${calendarEntry.accessRole}`);
  } catch (error) {
    console.error("Failed to get primary calendar details:", error);
  }
}

// Example 2: Get a specific secondary calendar from the user's list
async function getSecondaryCalendarDetails() {
  const calendarId = "secondary.calendar.id@example.com";
  try {
    const calendarEntry = await calendarSdk.getCalendarFromList(calendarId);
    console.log(`Details for calendar ${calendarId}:`, calendarEntry);
    if (calendarEntry.hidden) {
      console.log("This calendar is currently hidden in the user's list.");
    }
  } catch (error) {
    console.error(`Failed to get calendar ${calendarId} from list:`, error);
  }
}
```