## Function: `listApps`

Lists the applications installed by the user or available in the Google Workspace Marketplace that integrate with Google Drive. This can include apps that can open or create files in Drive.

**Purpose:**
To discover Drive-connected applications. This can be used to populate a list of apps for opening files, or to understand which applications a user has connected to their Drive.

**Parameters:**
This function does not take any parameters.

**Return Value:**
- Type: `Promise<AppsListResponse>` (object)
- Description: A promise that resolves to an `AppsListResponse` object containing a list of applications.
  - `AppsListResponse`: An object with the following properties:
    - `kind`: `string` - Identifies the resource type, `drive#appList`.
    - `items`: `array<AppResponse>` - A list of applications. Each element is an `AppResponse` object (see `getApp` for its structure).
    - `defaultAppIds`: `array<string>` (optional) - A list of app IDs that are designated as default apps to open particular file types.
    - `selfLink`: `string` (optional) - A link back to this list.

**Examples:**
```typescript
// Example 1: List all available/installed apps
async function exampleListApps() {
  try {
    const appsList = await sdk.listApps();
    console.log('Installed/Available Apps:');
    appsList.items.forEach(app => {
      console.log(`- ${app.name} (ID: ${app.id}, Installed: ${app.installed})`);
    });
    if (appsList.defaultAppIds && appsList.defaultAppIds.length > 0) {
      console.log('Default App IDs:', appsList.defaultAppIds);
    }
  } catch (error) {
    console.error('Error listing apps:', error);
  }
}
```
