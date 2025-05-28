## Function: `deleteCalendar`

Deletes a secondary calendar. This operation cannot be used to delete the primary calendar of an account; for that, use the `clearCalendar` method which removes all events from the primary calendar.

**Purpose:**
To permanently remove a secondary calendar that the authenticated user owns.

**Parameters:**
- `calendarId` (string, required): The calendar identifier of the secondary calendar to be deleted. To retrieve calendar IDs, you can call the `listCalendarList` method. This ID cannot be `"primary"`.

**Return Value:**
- A `Promise` that resolves to `void` upon successful deletion of the calendar.
- Throws an error if the `calendarId` is `"primary"`, if the calendar does not exist, if the user does not have ownership of the calendar, or if the API request fails.

**Examples:**
```typescript
// Example 1: Delete a secondary calendar
async function deleteSecondaryCalendar() {
  const calendarIdToDelete = "your-secondary-calendar-id@group.calendar.google.com"; // Replace with an actual secondary calendar ID you own
  try {
    // Ensure this is the intended action, perhaps after user confirmation.
    await sdk.deleteCalendar(calendarIdToDelete);
    console.log(`Calendar "${calendarIdToDelete}" deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting calendar "${calendarIdToDelete}":`, error);
    // Handle specific errors, e.g., calendar not found, permission denied
  }
}

// deleteSecondaryCalendar(); // Uncomment to run, ensure calendarIdToDelete is a valid ID you own.

// Example 2: Attempting to delete the primary calendar (will fail)
async function attemptDeletePrimaryCalendar() {
  const primaryCalendarId = "primary";
  try {
    await sdk.deleteCalendar(primaryCalendarId);
    console.log("Primary calendar deleted successfully."); // This line will not be reached
  } catch (error) {
    console.error("Error deleting primary calendar:", error);
    // Expected error: API request failed: Primary calendars cannot be deleted.
  }
}

// attemptDeletePrimaryCalendar();
```