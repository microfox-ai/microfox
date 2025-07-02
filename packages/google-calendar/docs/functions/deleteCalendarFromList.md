## Function: `deleteCalendarFromList`

Removes a calendar from the authenticated user's calendar list. This does not delete the calendar itself, but rather unsubscribes the user from it, so it no longer appears in their list of calendars.

**Purpose:**
To allow a user to remove a specific calendar from their personal list of calendars they are subscribed to or have added.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar to be removed from the user's list. This is typically the email address of the calendar or the calendar's unique ID. You can use `"primary"` to refer to the user's primary calendar, though removing the primary calendar from the list might have limited effect as it's intrinsically tied to the account.

**Return Value:**
`Promise<void>` - A promise that resolves when the calendar has been successfully removed from the user's list. It does not return any value upon successful completion. An error is thrown if the operation fails, for example, if the calendar is not in the user's list or if the `calendarId` is invalid.

**Examples:**
```typescript
// Example 1: Remove a specific calendar from the user's list
async function removeSecondaryCalendar() {
  const calendarIdToRemove = "secondary.calendar.id@example.com";
  try {
    await calendarSdk.deleteCalendarFromList(calendarIdToRemove);
    console.log(`Calendar '${calendarIdToRemove}' removed from the list successfully.`);
  } catch (error) {
    console.error(`Failed to remove calendar '${calendarIdToRemove}' from list:`, error);
  }
}

// Example 2: Attempt to remove the primary calendar (behavior might vary)
async function removePrimaryCalendarFromList() {
  try {
    // Note: Removing 'primary' might not be fully supported or might have specific implications.
    await calendarSdk.deleteCalendarFromList("primary");
    console.log("Attempted to remove primary calendar from list.");
  } catch (error) {
    console.error("Failed to remove primary calendar from list:", error);
  }
}
```