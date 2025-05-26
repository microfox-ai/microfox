## Function: `getAclRule`

Retrieves a specific access control list (ACL) rule from a calendar.

**Purpose:**
To get the details of a specific permission or access level for a user or group on a calendar.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar from which to retrieve the ACL rule. Use 'primary' to refer to the primary calendar of the authenticated user.
- `ruleId`: string (required) - The identifier of the ACL rule to retrieve.

**Return Value:**
- `Promise<AclRule>`: A promise that resolves with the `AclRule` object. The `AclRule` object has the following structure:
  - `kind`: string (optional) - Identifies this as an ACL rule. Value: "calendar#aclRule".
  - `etag`: string (optional) - ETag of the resource.
  - `id`: string (optional) - Identifier of the ACL rule.
  - `scope`: object (optional) - The scope of the rule.
    - `type`: string (required) - The type of the scope. Possible values are:
      - "default" - The public scope. This is the default value.
      - "user" - Limits the scope to a single user.
      - "group" - Limits the scope to a group.
      - "domain" - Limits the scope to a domain.
    - `value`: string (optional) - The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type "default".
  - `role`: string (optional) - The role assigned to the scope. Possible values are:
    - "none" - Provides no access.
    - "freeBusyReader" - Provides read access to free/busy information.
    - "reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
    - "writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
    - "owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role and is required to grant access to the calendar via ACLs.

**Examples:**
```typescript
// Example 1: Get an ACL rule from the primary calendar
const aclRule1 = await sdk.getAclRule('primary', 'ruleId123');
console.log(aclRule1);

// Example 2: Get an ACL rule from a specific calendar
const aclRule2 = await sdk.getAclRule(
  'calendarId@group.calendar.google.com',
  'user:test@example.com'
);
console.log(aclRule2);
```