## Function: `insertCalendar`

Creates a new secondary calendar. This function cannot be used to create a primary calendar, as primary calendars are automatically created for each Google account.

**Purpose:**
To allow users to create additional calendars for different purposes, such as work, personal projects, or shared team activities.

**Parameters:**
- `calendar` (object, required): A `Calendar` object containing the properties for the new calendar. At a minimum, the `summary` (title) of the calendar should be provided.
  - `Calendar` (object): 
    - `summary` (string, required): Title of the calendar.
    - `description` (string, optional): Description of the calendar.
    - `location` (string, optional): Geographic location of the calendar as free-form text.
    - `timeZone` (string, optional): The time zone of the calendar. (Formatted as an IANA Time Zone Database name, e.g., `"Europe/Zurich"`). If not set, the user's primary calendar's time zone will be used.
    - Other fields like `id`, `etag`, `accessRole`, etc., are typically server-assigned and should not be provided during creation, or will be ignored.

**Return Value:**
- A `Promise` that resolves to a `Calendar` object representing the newly created calendar.
- `Calendar` (object): The created calendar resource, including its server-assigned `id`, `etag`, and other properties. Refer to the `getCalendar` function's return value for the detailed structure of the `Calendar` object.

**Examples:**
```typescript
// Example 1: Create a new calendar with only a summary
async function createSimpleCalendar() {
  const newCalendarData: Partial<Calendar> = {
    summary: "My New Project Calendar"
  };
  try {
    const createdCalendar = await sdk.insertCalendar(newCalendarData as Calendar);
    console.log("Calendar created successfully:", createdCalendar);
    console.log("New Calendar ID:", createdCalendar.id);
  } catch (error) {
    console.error("Error creating calendar:", error);
  }
}
createSimpleCalendar();

// Example 2: Create a new calendar with summary, description, and time zone
async function createDetailedCalendar() {
  const detailedCalendarData: Partial<Calendar> = {
    summary: "Team Vacation Calendar",
    description: "Tracks team members' vacation and out-of-office days.",
    timeZone: "America/Los_Angeles"
  };
  try {
    const createdCalendar = await sdk.insertCalendar(detailedCalendarData as Calendar);
    console.log("Detailed calendar created successfully:", createdCalendar);
  } catch (error) {
    console.error("Error creating detailed calendar:", error);
  }
}
// createDetailedCalendar();
```