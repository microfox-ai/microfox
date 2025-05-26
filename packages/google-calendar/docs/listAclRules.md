## Function: `listAclRules`

Retrieves a list of Access Control List (ACL) rules for a specified calendar. These rules define who has what type of access to the calendar.

**Purpose:**
To fetch all ACL rules associated with a calendar, allowing inspection of current access permissions.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar for which to list ACL rules. This is typically the email address of the calendar or the calendar's unique ID.
- `params`: object (optional) - An object containing optional query parameters to filter or paginate the results.
  - `maxResults`: string (optional) - Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
  - `pageToken`: string (optional) - Token specifying which result page to return. Optional.
  - `showDeleted`: string (optional) - Whether to include deleted ACL rules in the result. Deleted ACL rules are represented by rules with the role equal to `"none"`. Deleted rules are only listed if `showDeleted` is set to true. Optional. The default is False.
  - `syncToken`: string (optional) - Token obtained from the `nextSyncToken` field returned on the last page of a previous `list` request. It makes the result of this `list` request contain only entries that have changed since then. All entries deleted since the previous `list` request will always be in the result set and it is not allowed to set `showDeleted` to False. If the `syncToken` expires, the server will respond with a 410 GONE response code and the client should clear its storage and perform a full synchronization without the `syncToken`. Learn more about incremental synchronization. Optional. The default is to synchronize all entries.

**Return Value:**
`Promise<Acl>` - A promise that resolves to an `Acl` object. This object contains a list of `AclRule` items and potentially a `nextPageToken` or `nextSyncToken` for pagination or synchronization.

  The `Acl` object has the following structure:
  ```typescript
  interface Acl {
    kind: "calendar#acl"; // Type of the collection ("calendar#acl").
    etag: string; // ETag of the collection.
    items: AclRule[]; // List of ACL rules.
    nextPageToken?: string; // Token used to access the next page of this result. Omitted if no further results are available.
    nextSyncToken?: string; // Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.
  }

  interface AclRule {
    kind: "calendar#aclRule";
    etag: string;
    id: string;
    scope: {
      type: string;
      value?: string;
    };
    role: string;
  }
  ```
  An error is thrown if the operation fails, for example, if the calendar does not exist or the authenticated user lacks permission.

**Examples:**
```typescript
// Example 1: List all ACL rules for the primary calendar
async function listPrimaryCalendarAcls() {
  try {
    const aclList = await calendarSdk.listAclRules("primary");
    console.log("ACL Rules for primary calendar:", aclList.items);
    if (aclList.nextPageToken) {
      console.log("More ACL rules available. Next page token:", aclList.nextPageToken);
    }
  } catch (error) {
    console.error("Failed to list ACL rules:", error);
  }
}

// Example 2: List ACL rules with pagination and include deleted rules
async function listCalendarAclsWithDetails() {
  const calendarId = "my.custom.calendar@group.calendar.google.com";
  try {
    const aclList = await calendarSdk.listAclRules(calendarId, {
      maxResults: "10",
      showDeleted: "true",
    });
    console.log(`ACL Rules for ${calendarId} (max 10, showing deleted):`, aclList.items);

    // Example of fetching the next page if available
    if (aclList.nextPageToken) {
      const nextPageAclList = await calendarSdk.listAclRules(calendarId, {
        maxResults: "10",
        showDeleted: "true",
        pageToken: aclList.nextPageToken,
      });
      console.log("Next page of ACL rules:", nextPageAclList.items);
    }
  } catch (error) {
    console.error("Failed to list ACL rules with details:", error);
  }
}

// Example 3: Using syncToken for incremental synchronization (conceptual)
async function syncAclRules(calendarId: string, knownSyncToken?: string) {
  try {
    const params: { syncToken?: string } = {};
    if (knownSyncToken) {
      params.syncToken = knownSyncToken;
    }
    const aclList = await calendarSdk.listAclRules(calendarId, params);
    console.log("Synced ACL rules:", aclList.items);
    // Store aclList.nextSyncToken for the next sync
    const nextSyncToken = aclList.nextSyncToken;
    console.log("Next sync token:", nextSyncToken);
    // Process updated/deleted rules
  } catch (error: any) {
    if (error.message && error.message.includes("410 GONE")) {
      console.warn("Sync token expired. Performing full sync.");
      // Perform a full sync without syncToken
      await syncAclRules(calendarId); 
    } else {
      console.error("Failed to sync ACL rules:", error);
    }
  }
}
```