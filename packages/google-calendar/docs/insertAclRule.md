## Function: `insertAclRule`

Inserts an access control list (ACL) rule into a calendar.

**Purpose:**
To grant a specific permission or access level to a user or group for a calendar.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar where the ACL rule will be inserted. Use 'primary' to refer to the primary calendar of the authenticated user.
- `rule`: `AclRule` (required) - The ACL rule object to insert. The `AclRule` object has the following structure:
  - `kind`: string (optional) - Identifies this as an ACL rule. Value: "calendar#aclRule".
  - `etag`: string (optional) - ETag of the resource.
  - `id`: string (optional) - Identifier of the ACL rule.
  - `scope`: object (required) - The scope of the rule.
    - `type`: string (required) - The type of the scope. Possible values are:
      - "default" - The public scope. This is the default value.
      - "user" - Limits the scope to a single user.
      - "group" - Limits the scope to a group.
      - "domain" - Limits the scope to a domain.
    - `value`: string (optional) - The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type "default". Required for other scope types.
  - `role`: string (required) - The role assigned to the scope. Possible values are:
    - "none" - Provides no access.
    - "freeBusyReader" - Provides read access to free/busy information.
    - "reader" - Provides read access to the calendar. Private events will appear to users with reader access, but event details will be hidden.
    - "writer" - Provides read and write access to the calendar. Private events will appear to users with writer access, and event details will be visible.
    - "owner" - Provides ownership of the calendar. This role has all of the permissions of the writer role and is required to grant access to the calendar via ACLs.
- `sendNotifications`: string (optional) - Whether to send notifications about the new rule to the recipient. Acceptable values are:
    - "all" - Send notifications.
    - "none" - Do not send notifications.
    - Default: "all"

**Return Value:**
- `Promise<AclRule>`: A promise that resolves with the created `AclRule` object, including any server-generated fields like `id` and `etag`.

**Examples:**
```typescript
// Example 1: Insert an ACL rule for a user with reader role on the primary calendar
const newRule1: AclRule = {
  scope: {
    type: 'user',
    value: 'user@example.com'
  },
  role: 'reader'
};
const createdRule1 = await sdk.insertAclRule('primary', newRule1);
console.log(createdRule1);

// Example 2: Insert an ACL rule for a group with writer role on a specific calendar, without sending notifications
const newRule2: AclRule = {
  scope: {
    type: 'group',
    value: 'group@example.com'
  },
  role: 'writer'
};
const createdRule2 = await sdk.insertAclRule(
  'calendarId@group.calendar.google.com',
  newRule2,
  'none'
);
console.log(createdRule2);
```