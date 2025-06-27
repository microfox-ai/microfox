## Function: `updateCalendar`

Updates metadata for an existing calendar, such as its summary (title), description, or time zone. This method supports patch semantics, meaning only the fields provided in the `calendar` object will be updated; other fields will remain unchanged.

**Purpose:**
To modify the properties of a calendar that the authenticated user owns or has sufficient permissions to edit.

**Parameters:**
- `calendarId` (string, required): The calendar identifier. To retrieve calendar IDs, call the `listCalendarList` method. If you want to access the primary calendar of the currently logged-in user, use the `"primary"` keyword.
- `calendar` (object, required): A `Calendar` object containing the fields to update. Only the fields present in this object will be modified on the calendar.
  - `Calendar` (object): 
    - `summary` (string, optional): New title for the calendar.
    - `description` (string, optional): New description for the calendar.
    - `location` (string, optional): New geographic location for the calendar.
    - `timeZone` (string, optional): New time zone for the calendar (e.g., `"America/New_York"`).
    - Other modifiable fields as defined in the `Calendar` resource type. Fields like `id`, `etag`, `accessRole` are generally not user-modifiable or are updated by the server.

**Return Value:**
- A `Promise` that resolves to a `Calendar` object representing the updated calendar.
- `Calendar` (object): The updated calendar resource with the new metadata. Refer to the `getCalendar` function's return value for the detailed structure of the `Calendar` object.

**Examples:**
```typescript
// Example 1: Update the summary of the primary calendar
async function updatePrimaryCalendarSummary() {
  const newPrimarySummary: Partial<Calendar> = {
    summary: "John Doe's Main Calendar"
  };
  try {
    const updatedCalendar = await sdk.updateCalendar("primary", newPrimarySummary as Calendar);
    console.log("Primary calendar updated successfully:", updatedCalendar);
    console.log("New Summary:", updatedCalendar.summary);
  } catch (error) {
    console.error("Error updating primary calendar:", error);
  }
}
// updatePrimaryCalendarSummary();

// Example 2: Update description and time zone of a secondary calendar
async function updateSecondaryCalendarDetails() {
  const secondaryCalendarId = "your-secondary-calendar-id@group.calendar.google.com"; // Replace with an actual calendar ID you can edit
  const updates: Partial<Calendar> = {
    description: "Updated project milestones and deadlines.",
    timeZone: "Europe/Berlin"
  };
  try {
    const updatedCalendar = await sdk.updateCalendar(secondaryCalendarId, updates as Calendar);
    console.log(`Calendar "${secondaryCalendarId}" updated successfully:`, updatedCalendar);
  } catch (error) {
    console.error(`Error updating calendar "${secondaryCalendarId}":`, error);
  }
}
// updateSecondaryCalendarDetails(); // Ensure secondaryCalendarId is valid and you have edit permissions

// Example 3: Attempting to update a read-only field (e.g., etag) - this will likely be ignored or cause an error
async function attemptUpdateReadOnlyField() {
  const calendarId = "primary";
  const updatesWithEtag: Partial<Calendar> = {
    summary: "Test Summary Update",
    etag: ""some-fake-etag"" // Attempting to set etag
  };
  try {
    const updatedCalendar = await sdk.updateCalendar(calendarId, updatesWithEtag as Calendar);
    console.log("Calendar updated (etag change likely ignored):", updatedCalendar);
  } catch (error) {
    console.error("Error during update with read-only field attempt:", error);
  }
}
// attemptUpdateReadOnlyField();
```