## Function: `listAclRules`

Retrieves a list of access control list (ACL) rules for a specified calendar.

**Purpose:**
To get all the permissions and access levels defined for a calendar.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar for which to list ACL rules. Use 'primary' to refer to the primary calendar of the authenticated user.
- `params`: object (optional) - An object containing query parameters to filter and paginate the results.
  - `maxResults`: string (optional) - Maximum number of entries returned on one result page. By default the value is 100 entries. The page size can never be larger than 250 entries. Optional.
  - `pageToken`: string (optional) - Token specifying which result page to return. Optional.
  - `showDeleted`: string (optional) - Whether to include deleted ACL rules in the result. Deleted ACL rules are represented by rules with the role equal to "none". Deleted rules are only guaranteed to be present in the list for up to 30 days after deletion. Optional. The default is False.
  - `syncToken`: string (optional) - Token obtained from the nextSyncToken field returned on the last page of a previous list request. It makes the result of this list request contain only entries that have changed since then. An error is returned if the syncToken is invalidated by the server, in which case another full list request should be performed.
    Optional. The default is to synchronize everything.

**Return Value:**
- `Promise<Acl>`: A promise that resolves with an `Acl` object. The `Acl` object has the following structure:
  - `kind`: string (optional) - Identifies this as a list of ACL rules. Value: "calendar#acl".
  - `etag`: string (optional) - ETag of the collection.
  - `items`: array<`AclRule`> (optional) - List of ACL rules.
    - Each `AclRule` object has the following structure:
      - `kind`: string (optional) - Identifies this as an ACL rule. Value: "calendar#aclRule".
      - `etag`: string (optional) - ETag of the resource.
      - `id`: string (optional) - Identifier of the ACL rule.
      - `scope`: object (optional) - The scope of the rule.
        - `type`: string (required) - The type of the scope. (e.g., "user", "group", "domain", "default")
        - `value`: string (optional) - The email address or domain name associated with the scope.
      - `role`: string (optional) - The role assigned to the scope. (e.g., "reader", "writer", "owner")
  - `nextPageToken`: string (optional) - Token used to access the next page of this result. Omitted if no further results are available, in which case nextSyncToken is provided.
  - `nextSyncToken`: string (optional) - Token used at a later point in time to retrieve only the entries that have changed since this result was returned. Omitted if further results are available, in which case nextPageToken is provided.

**Examples:**
```typescript
// Example 1: List all ACL rules for the primary calendar
const aclList1 = await sdk.listAclRules('primary');
console.log(aclList1.items);

// Example 2: List ACL rules for a specific calendar with pagination and showing deleted rules
const aclList2 = await sdk.listAclRules(
  'calendarId@group.calendar.google.com',
  {
    maxResults: '50',
    showDeleted: 'true'
  }
);
console.log(aclList2.items);
if (aclList2.nextPageToken) {
  console.log("Next page token:", aclList2.nextPageToken);
}

// Example 3: List ACL rules using a sync token
const aclList3 = await sdk.listAclRules('primary', { syncToken: 'SYNC_TOKEN_FROM_PREVIOUS_CALL' });
console.log(aclList3.items);
```