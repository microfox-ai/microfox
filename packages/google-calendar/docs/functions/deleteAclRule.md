## Function: `deleteAclRule`

Deletes an access control list (ACL) rule from a calendar.

**Purpose:**
To remove a specific permission or access level for a user or group from a calendar.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar from which to delete the ACL rule. Use 'primary' to refer to the primary calendar of the authenticated user.
- `ruleId`: string (required) - The identifier of the ACL rule to delete.

**Return Value:**
- `Promise<void>`: A promise that resolves when the ACL rule has been successfully deleted. It does not return any value upon successful completion.

**Examples:**
```typescript
// Example 1: Delete an ACL rule from the primary calendar
await sdk.deleteAclRule('primary', 'ruleId123');

// Example 2: Delete an ACL rule from a specific calendar
await sdk.deleteAclRule('calendarId@group.calendar.google.com', 'user:test@example.com');
```