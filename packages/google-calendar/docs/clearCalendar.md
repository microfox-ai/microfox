## Function: `clearCalendar`

Clears a primary calendar. This operation deletes all events associated with the primary calendar of an account. It cannot be used on secondary calendars.

**Purpose:**
To remove all events from the user's primary calendar. This is a destructive operation and should be used with caution.

**Parameters:**
- `calendarId` (string, required): The calendar identifier. Must be `"primary"` to clear the primary calendar. Attempting to clear other calendars will result in an error.

**Return Value:**
- A `Promise` that resolves to `void` upon successful clearing of the calendar.
- Throws an error if the `calendarId` is not `"primary"` or if the API request fails.

**Examples:**
```typescript
// Example 1: Clear the primary calendar
// WARNING: This will delete all events from the primary calendar.
async function clearPrimaryCalendar() {
  try {
    // Ensure this is the intended action, perhaps after user confirmation.
    await sdk.clearCalendar("primary");
    console.log("Primary calendar cleared successfully.");
  } catch (error) {
    console.error("Error clearing primary calendar:", error);
    // Handle specific errors, e.g., if calendarId is not 'primary'
  }
}

// clearPrimaryCalendar(); // Uncomment to run, but be very careful!

// Example 2: Attempting to clear a non-primary calendar (will fail)
async function attemptClearSecondaryCalendar() {
  const secondaryCalendarId = "secondary.calendar.id@group.calendar.google.com";
  try {
    await sdk.clearCalendar(secondaryCalendarId);
    console.log("Secondary calendar cleared successfully."); // This line will not be reached
  } catch (error) {
    console.error("Error clearing secondary calendar:", error);
    // Expected error: API request failed: This operation is only supported for primary calendars.
  }
}

// attemptClearSecondaryCalendar();
```