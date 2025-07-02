## Function: `getCalendar`

Retrieves metadata for a specific calendar, such as its title, description, and time zone.

**Purpose:**
To fetch detailed information about a calendar, whether it's the primary calendar or a secondary calendar accessible to the user.

**Parameters:**
- `calendarId` (string, required): The calendar identifier. To retrieve calendar IDs, call the `listCalendarList` method. If you want to access the primary calendar of the currently logged-in user, use the `"primary"` keyword.

**Return Value:**
- A `Promise` that resolves to a `Calendar` object.
- `Calendar` (object): An object containing the metadata for the requested calendar.
  - `kind` (string): Identifies this as a calendar. Value: `"calendar#calendar"`.
  - `etag` (string): ETag of the resource.
  - `id` (string): Identifier of the calendar.
  - `summary` (string, optional): Title of the calendar.
  - `description` (string, optional): Description of the calendar.
  - `location` (string, optional): Geographic location of the calendar as free-form text. Optional.
  - `timeZone` (string, optional): The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g., `"Europe/Zurich"`). Optional.
  - `summaryOverride` (string, optional): The user-provided summary of the calendar. Optional. Read-only.
  - `colorId` (string, optional): The color of the calendar. This is an ID referring to an entry in the `calendar` section of the colors definition (see the `getColors` endpoint). Optional.
  - `backgroundColor` (string, optional): The background color of the calendar in the Google Calendar UI. Formatted as an RGB hex string (e.g. `"#0088aa"`). Optional. Read-only.
  - `foregroundColor` (string, optional): The foreground color of the calendar in the Google Calendar UI. Formatted as an RGB hex string (e.g. `"#ffffff"`). Optional. Read-only.
  - `hidden` (boolean, optional): Whether the calendar has been hidden from the list. Optional. Read-only.
  - `selected` (boolean, optional): Whether the calendar is selected and displayed in the GCal UI. Optional. Read-only.
  - `accessRole` (string, optional): The effective access role that the authenticated user has on the calendar. Read-only. Possible values are:
    - `"freeBusyReader"` - Provides read access to free/busy information.
    - `"reader"` - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
    - `"writer"` - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
    - `"owner"` - Provides ownership of the calendar. This role has all of the permissions of the writer role and additionally allows any user with this role to modify the access control list (ACL) of the calendar.
  - `defaultReminders` (array<object>, optional): The default reminders that the authenticated user has for this calendar.
    - `method` (string): The method used by this reminder. Possible values are:
      - `"email"` - Reminders are sent via email.
      - `"popup"` - Reminders are sent via a UI popup.
    - `minutes` (number): Number of minutes before the start of the event when the reminder should trigger.
  - `notificationSettings` (object, optional): The notifications that the authenticated user is receiving for this calendar.
    - `notifications` (array<object>): The list of notifications.
      - `type` (string): The type of notification. Possible values are:
        - `"eventCreation"` - Notification sent when a new event is put on the calendar.
        - `"eventChange"` - Notification sent when an event is changed.
        - `"eventCancellation"` - Notification sent when an event is cancelled.
        - `"eventResponse"` - Notification sent when an event is changed.
        - `"agenda"` - An agenda with the events of the day sent out in the morning.
      - `method` (string): The method used by this notification. Possible values are:
        - `"email"` - Notifications are sent via email.
  - `primary` (boolean, optional): Whether this is the user's primary calendar. Optional. Read-only.
  - `deleted` (boolean, optional): Whether the calendar is deleted. Optional. Read-only.
  - `conferenceProperties` (object, optional): The conferenceProperties of the calendar, such as the allowed conference solution types.
    - `allowedConferenceSolutionTypes` (array<string>, optional): The types of conference solutions that are supported for this calendar.
      The possible values are:
      - `"eventHangout"`
      - `"eventNamedHangout"`
      - `"hangoutsMeet"`

**Examples:**
```typescript
// Example 1: Get the primary calendar
async function getPrimaryCalendar() {
  try {
    const calendar = await sdk.getCalendar("primary");
    console.log("Primary Calendar Details:", calendar);
    console.log("Summary:", calendar.summary);
    console.log("Time Zone:", calendar.timeZone);
  } catch (error) {
    console.error("Error fetching primary calendar:", error);
  }
}
getPrimaryCalendar();

// Example 2: Get a specific secondary calendar by ID
async function getSecondaryCalendar() {
  const secondaryCalendarId = "example.secondary.calendar@group.calendar.google.com"; // Replace with a valid calendar ID
  try {
    const calendar = await sdk.getCalendar(secondaryCalendarId);
    console.log(`Details for calendar "${secondaryCalendarId}":`, calendar);
  } catch (error) {
    console.error(`Error fetching calendar "${secondaryCalendarId}":`, error);
    // Handle errors like calendar not found or no access permission
  }
}
// getSecondaryCalendar(); // Uncomment if you have a valid secondaryCalendarId
```