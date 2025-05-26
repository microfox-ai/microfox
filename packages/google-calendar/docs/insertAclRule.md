## Function: `insertAclRule`

Inserts a new Access Control List (ACL) rule into a specified calendar. This operation grants a user, group, or domain specific access permissions to the calendar.

**Purpose:**
To grant access permissions to a calendar for a specific entity by adding a new ACL rule.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar to which the ACL rule will be added. This is typically the email address of the calendar or the calendar's unique ID.
- `rule`: `AclRule` (required) - An `AclRule` object defining the rule to be inserted. The `AclRule` object should specify the `scope` (who the rule applies to) and the `role` (the level of access).
  The `AclRule` object structure:
  ```typescript
  interface AclRule {
    // kind: "calendar#aclRule"; // Not required for insertion, will be set by API
    // etag: string; // Not required for insertion
    // id: string; // Not required for insertion, will be set by API
    scope: {
      type: string; // Required. The type of the scope. Possible values are: "user", "group", "domain", "default".
      value?: string; // Required if type is "user", "group", or "domain". The email address or domain name.
    };
    role: string; // Required. The role assigned to the scope. Possible values are: "none", "freeBusyReader", "reader", "writer", "owner".
  }
  ```
- `sendNotifications`: string (optional) - Whether to send notifications about the calendar sharing change. 
  Possible values are:
  - `"all"`: Send notifications to all users.
  - `"externalOnly"`: Send notifications only to users outside the calendar's domain.
  - `"none"`: Do not send notifications.
  Default behavior if omitted is typically to send notifications.

**Return Value:**
`Promise<AclRule>` - A promise that resolves to an `AclRule` object representing the newly created ACL rule, including its server-assigned ID and ETag. An error is thrown if the operation fails, for example, due to invalid input, insufficient permissions, or if the rule already exists.

**Examples:**
```typescript
// Example 1: Insert an ACL rule to grant reader access to a user
async function grantUserReaderAccess() {
  const newRule: AclRule = {
    scope: {
      type: 'user',
      value: 'new.user@example.com',
    },
    role: 'reader',
  };
  try {
    const createdRule = await calendarSdk.insertAclRule('primary', newRule);
    console.log('ACL rule created successfully:', createdRule);
  } catch (error) {
    console.error('Failed to insert ACL rule:', error);
  }
}

// Example 2: Insert an ACL rule for a group with notifications disabled
async function grantGroupWriterAccessNoNotifications() {
  const calendarId = 'my.custom.calendar@group.calendar.google.com';
  const groupRule: AclRule = {
    scope: {
      type: 'group',
      value: 'project-team@example.com',
    },
    role: 'writer',
  };
  try {
    const createdRule = await calendarSdk.insertAclRule(
      calendarId,
      groupRule,
      'none'
    );
    console.log('Group ACL rule created:', createdRule);
  } catch (error) {
    console.error('Failed to insert group ACL rule:', error);
  }
}

// Example 3: Insert an ACL rule for a domain
async function grantDomainFreeBusyAccess() {
  const domainRule: AclRule = {
    scope: {
      type: 'domain',
      value: 'example.com',
    },
    role: 'freeBusyReader',
  };
  try {
    const createdRule = await calendarSdk.insertAclRule('primary', domainRule, 'all');
    console.log('Domain ACL rule created:', createdRule);
  } catch (error) {
    console.error('Failed to insert domain ACL rule:', error);
  }
}
```