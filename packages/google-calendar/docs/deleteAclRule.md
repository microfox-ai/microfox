## Function: `deleteAclRule`

Deletes an Access Control List (ACL) rule from a specified calendar. This operation removes a specific permission that was granted to a user or group.

**Purpose:**
To revoke access permissions for a user or group on a specific calendar by deleting an ACL rule.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar from which the ACL rule will be deleted. Typically, this is the email address of the calendar or the calendar's unique ID.
- `ruleId`: string (required) - The identifier of the ACL rule to be deleted. This ID is unique for each ACL rule and can be obtained by listing ACL rules.

**Return Value:**
- `Promise<void>` - A promise that resolves when the ACL rule has been successfully deleted. It does not return any value upon successful completion. An error is thrown if the operation fails, for example, if the calendar or rule ID is invalid, or if the authenticated user does not have permission to delete the rule.

**Examples:**
```typescript
// Example 1: Delete an ACL rule
async function removeUserAccess() {
  const calendarId = "primary"; // or "user@example.com"
  const ruleIdToDelete = "user:anotheruser@example.com";

  try {
    await calendarSdk.deleteAclRule(calendarId, ruleIdToDelete);
    console.log(`ACL rule '${ruleIdToDelete}' deleted successfully from calendar '${calendarId}'.`);
  } catch (error) {
    console.error(`Failed to delete ACL rule: ${error.message}`);
  }
}

removeUserAccess();
```