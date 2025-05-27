## Function: `getSetting`

Fetches the details of a specific user setting from Google Calendar.

**Purpose:**
To retrieve the current value of a particular user setting, such as their preferred date format, time zone, or event reminder defaults.

**Parameters:**
- `setting`: `string` (required) - The ID of the user setting to retrieve. Examples of setting IDs include:
  - `"dateFormat"`
  - `"defaultEventLength"`
  - `"defaultReminders"`
  - `"hideInvitations"`
  - `"locale"`
  - `"remindOnRespondedEventsOnly"`
  - `"showDeclinedEvents"`
  - `"timezone"`
  - `"useDefaultCalendarReminders"`
  - `"weekStart"`
  (Refer to Google Calendar API documentation for a complete list of valid setting IDs.)

**Return Value:**
- `Promise<Setting>`: A promise that resolves to a `Setting` object containing the details of the retrieved setting.
  - `Setting`: An object representing a user setting, typically including:
    - `id`: `string` - The ID of the setting (e.g., "timezone").
    - `value`: `string` - The current value of the setting (e.g., "America/New_York"). The format of the value depends on the setting type.
    - `etag`: `string` - ETag of the resource.
    - `kind`: `string` - Typically "calendar#setting".

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: Get the user's current timezone setting
async function getUserTimezone() {
  try {
    const timezoneSetting = await sdk.getSetting('timezone');
    console.log('User Timezone ID:', timezoneSetting.id);
    console.log('User Timezone Value:', timezoneSetting.value);
  } catch (error) {
    console.error('Error getting timezone setting:', error);
  }
}

// Example 2: Get the user's default event length
async function getDefaultEventLength() {
  try {
    const eventLengthSetting = await sdk.getSetting('defaultEventLength');
    console.log(`Default Event Length: ${eventLengthSetting.value} minutes`);
  } catch (error) {
    console.error('Error getting default event length setting:', error);
  }
}
```