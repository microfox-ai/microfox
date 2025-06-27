## Function: `listSettings`

Retrieves a list of all available user settings for Google Calendar, along with their current values.

**Purpose:**
To fetch all user-configurable settings, which can be useful for displaying a settings panel or understanding the user's current calendar configuration.

**Parameters:**
- `params`: `object` (optional) - An object containing additional query parameters for pagination or synchronization.
  - `maxResults`: `string` (optional) - The maximum number of settings to return. The API may have its own default and maximum limits.
  - `pageToken`: `string` (optional) - Token specifying the next page of results to return if the list is paginated.
  - `syncToken`: `string` (optional) - Token obtained from a previous `listSettings` call to perform an incremental sync (if supported for settings).

**Return Value:**
- `Promise<Settings>`: A promise that resolves to a `Settings` object. This object contains a list of `Setting` items and pagination information.
  - `Settings`: An object typically containing:
    - `items`: `array<Setting>` - An array of `Setting` objects, where each object represents a user setting (e.g., timezone, date format).
      - `Setting`: Each setting object includes `id`, `value`, `etag`, and `kind`.
    - `nextPageToken`: `string` (optional) - Token to retrieve the next page of results. Present if more settings are available.
    - `etag`: `string` - ETag of the collection.
    - `kind`: `string` - Typically "calendar#settings".

**Examples:**
```typescript
// Assume 'sdk' is an initialized instance of GoogleCalendarSdk

// Example 1: List all user settings
async function displayAllUserSettings() {
  try {
    const settingsResult = await sdk.listSettings();
    console.log('User Calendar Settings:');
    settingsResult.items.forEach(setting => {
      console.log(`- ID: ${setting.id}, Value: ${setting.value}`);
    });
    if (settingsResult.nextPageToken) {
      console.log('More settings available. Next page token:', settingsResult.nextPageToken);
    }
  } catch (error) {
    console.error('Error listing settings:', error);
  }
}

// Example 2: List settings with pagination (conceptual)
async function listSettingsWithPagination(pageToken?: string) {
  try {
    const settingsResult = await sdk.listSettings({ maxResults: '5', pageToken });
    console.log('Current page of settings:');
    settingsResult.items.forEach(setting => {
      console.log(`  ${setting.id}: ${setting.value}`);
    });

    if (settingsResult.nextPageToken) {
      console.log('Fetching next page of settings...');
      // Potentially call listSettingsWithPagination(settingsResult.nextPageToken) here
    }
  } catch (error) {
    console.error('Error listing settings with pagination:', error);
  }
}
```