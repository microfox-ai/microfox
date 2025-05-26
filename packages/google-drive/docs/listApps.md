## Function: `listApps`

Lists the applications that are installed or available to the user in Google Drive. This can include Google's own apps (like Docs, Sheets, Slides) as well as third-party applications integrated with Drive.

**Purpose:**
To retrieve a list of applications associated with the user's Google Drive. This information can be used to display available "Open with" options, manage app integrations, or understand what applications can interact with Drive files.

**Parameters:**
This function does not take any parameters.

**Return Value:**

-   Type: `Promise<AppsListResponse>`
-   Description: A promise that resolves to an `AppsListResponse` object containing a list of applications.
-   Error cases: Throws an error if the API request fails (e.g., authentication issues or other server-side problems).

**Type Definitions:**

*   `AppsListResponse`:
    ```typescript
    type AppsListResponse = {
      kind: string; // Identifies what kind of resource this is. Value: "drive#appList".
      apps: Array<AppResponse>; // The list of apps.
      // Note: The Drive API v3 for apps.list does not typically include nextPageToken or other common list wrapper fields like etag or selfLink directly in AppsListResponse.
      // Pagination is not standard for this endpoint in the same way as file listings.
    };
    ```

*   `AppResponse`:
    ```typescript
    type AppResponse = {
      id: string; // The ID of the app.
      name: string; // The name of the app.
      objectType: string; // The object type. Value: "drive#app".
      openUrlTemplate?: string; // A template URL for opening files with this app.
      primaryMimeTypes?: string[]; // The primary MIME types supported by this app.
      secondaryMimeTypes?: string[]; // The secondary MIME types supported by this app.
      primaryFileExtensions?: string[]; // The primary file extensions supported by this app.
      secondaryFileExtensions?: string[]; // The secondary file extensions supported by this app.
      icons?: Array<{
        category: string; // Category of the icon.
        iconUrl: string; // URL for the icon.
        size: number; // Size of the icon in pixels.
      }>; // A list of icons for the app.
      shortDescription?: string; // A short description of the app.
      longDescription?: string; // A long description of the app.
      createInFolderTemplate?: string; // URL template for creating a new file with this app in a specific folder.
      createUrl?: string; // URL for creating a new file with this app.
      useByDefault?: boolean; // Whether this app is the default app for the supported primary MIME types.
      installed: boolean; // Whether this app is installed for the user.
      authorized: boolean; // Whether this app is authorized to access data on behalf of the user.
      hasDriveWideScope: boolean; // Whether the app has fulfilled the requirements to participate in the "Open with" dialog.
      productId?: string; // The G Suite Marketplace product ID of this app.
    };
    ```

**Examples:**

```typescript
// Assuming 'sdk' is an initialized instance of GoogleDriveSdk

// Example 1: List all available/installed applications
async function listAllApps() {
  try {
    const response = await sdk.listApps();
    console.log('Available/Installed Applications:');
    if (response.apps && response.apps.length > 0) {
      response.apps.forEach(app => {
        console.log(`- App Name: ${app.name} (ID: ${app.id})`);
        console.log(`  Installed: ${app.installed}`);
        console.log(`  Supports primary MIME types: ${app.primaryMimeTypes ? app.primaryMimeTypes.join(', ') : 'N/A'}`);
      });
    } else {
      console.log('No applications found.');
    }
  } catch (error) {
    console.error('Error listing applications:', error);
  }
}

// Example 2: Filter for installed applications (client-side filtering)
async function listInstalledApps() {
  try {
    const response = await sdk.listApps();
    const installedApps = response.apps ? response.apps.filter(app => app.installed) : [];
    console.log('Installed Applications:');
    if (installedApps.length > 0) {
      installedApps.forEach(app => {
        console.log(`- ${app.name} (ID: ${app.id})`);
      });
    } else {
      console.log('No installed applications found.');
    }
  } catch (error) {
    console.error('Error listing or filtering applications:', error);
  }
}
```
