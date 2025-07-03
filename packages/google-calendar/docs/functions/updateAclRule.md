## Function: `updateAclRule`

Updates an existing Access Control List (ACL) rule for a specified calendar. This operation modifies the access permissions of an existing rule, for example, changing the role of a user or group.

**Purpose:**
To modify the access level (role) for an existing ACL rule on a calendar.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar where the ACL rule exists. This is typically the email address of the calendar or the calendar's unique ID.
- `ruleId`: string (required) - The identifier of the ACL rule to be updated. This is typically in the format `user:<email>`, `group:<email>`, etc.
- `rule`: `AclRule` (required) - An `AclRule` object containing the updated information for the rule. Only the `role` property can be updated. The `scope` property must match the existing rule.
  The `AclRule` object structure for update (only `role` is typically modified):
  ```typescript
  interface AclRule {
    // kind, etag, id, scope are usually not needed or should match the existing rule
    // For update, the primary field to provide is 'role'.
    // The 'scope' (type and value) must match the rule being updated.
    scope: {
      type: string; // Should match the existing rule's scope type.
      value?: string; // Should match the existing rule's scope value.
    };
    role: string; // Required. The new role to assign. Possible values: "none", "freeBusyReader", "reader", "writer", "owner".
  }
  ```
- `sendNotifications`: string (optional) - Whether to send notifications about the calendar sharing change. 
  Possible values are:
  - `"all"`: Send notifications to all users.
  - `"externalOnly"`: Send notifications only to users outside the calendar's domain.
  - `"none"`: Do not send notifications.
  Default behavior if omitted is typically to send notifications.

**Return Value:**
`Promise<AclRule>` - A promise that resolves to an `AclRule` object representing the updated ACL rule, including its new ETag. An error is thrown if the operation fails, for example, if the rule does not exist, the input is invalid, or the authenticated user lacks permission.

**Examples:**
```typescript
// Example 1: Update a user's role to 'writer'
async function updateUserRole() {
  const calendarId = 'primary';
  const ruleIdToUpdate = 'user:example.user@example.com';
  const updatedRuleDetails: AclRule = {
    // It's good practice to fetch the rule first to ensure scope is correct,
    // but for simplicity, we assume it's known.
    scope: { 
      type: 'user', 
      value: 'example.user@example.com' 
    },
    role: 'writer', 
  };
  try {
    const updatedRule = await calendarSdk.updateAclRule(
      calendarId,
      ruleIdToUpdate,
      updatedRuleDetails
    );
    console.log('ACL rule updated successfully:', updatedRule);
  } catch (error) {
    console.error('Failed to update ACL rule:', error);
  }
}

// Example 2: Change a group's role to 'reader' and suppress notifications
async function updateGroupRoleNoNotifications() {
  const calendarId = 'my.custom.calendar@group.calendar.google.com';
  const ruleIdToUpdate = 'group:project-team@example.com';
  const updatedGroupRule: AclRule = {
    scope: { 
      type: 'group', 
      value: 'project-team@example.com' 
    },
    role: 'reader',
  };
  try {
    const updatedRule = await calendarSdk.updateAclRule(
      calendarId,
      ruleIdToUpdate,
      updatedGroupRule,
      'none'
    );
    console.log('Group ACL rule updated (no notifications):', updatedRule);
  } catch (error) {
    console.error('Failed to update group ACL rule:', error);
  }
}

// Example 3: Revoke access by setting role to 'none'
async function revokeUserAccess() {
  const calendarId = 'primary';
  const ruleIdToUpdate = 'user:another.user@example.com';
  const ruleToRevokeAccess: AclRule = {
    scope: { 
      type: 'user', 
      value: 'another.user@example.com' 
    },
    role: 'none', // Setting role to 'none' effectively revokes access
  };
  try {
    const updatedRule = await calendarSdk.updateAclRule(
      calendarId,
      ruleIdToUpdate,
      ruleToRevokeAccess,
      'all'
    );
    console.log('User access revoked:', updatedRule);
  } catch (error) {
    console.error('Failed to revoke user access:', error);
  }
}
```