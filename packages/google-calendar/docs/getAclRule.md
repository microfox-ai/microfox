## Function: `getAclRule`

Retrieves a specific Access Control List (ACL) rule for a given calendar and rule ID.

**Purpose:**
To fetch the details of a single ACL rule, such as the scope (user, group, domain) and the role (e.g., reader, writer, owner) granted.

**Parameters:**
- `calendarId`: string (required) - The identifier of the calendar from which to retrieve the ACL rule. This can be the calendar's email address or its unique ID.
- `ruleId`: string (required) - The identifier of the ACL rule to retrieve. This ID is unique for each ACL rule.

**Return Value:**
- `Promise<AclRule>` - A promise that resolves to an `AclRule` object containing the details of the requested ACL rule. The `AclRule` object structure is defined by the Google Calendar API and typically includes fields like `id`, `kind`, `etag`, `scope`, and `role`.
  - `AclRule`: object - Represents an ACL rule.
    - `id`: string - The identifier of the ACL rule.
    - `kind`: string - The type of the resource. For an ACL rule, this is `calendar#aclRule`.
    - `etag`: string - The ETag of the resource.
    - `scope`: object - The scope of the rule.
      - `type`: string - The type of the scope. Possible values are: `default`, `user`, `group`, `domain`.
      - `value`: string (optional) - The email address or domain name for the scope. Required for `user`, `group`, and `domain` scope types.
    - `role`: string - The role assigned to the scope. Possible values are: `none`, `freeBusyReader`, `reader`, `writer`, `owner`.

**Examples:**
```typescript
// Example 1: Get a specific ACL rule
async function fetchAclRuleDetails() {
  const calendarId = "primary"; // or "user@example.com"
  const ruleIdToFetch = "user:specificuser@example.com";

  try {
    const aclRule = await calendarSdk.getAclRule(calendarId, ruleIdToFetch);
    console.log("Fetched ACL Rule:", aclRule);
    console.log(`Rule ID: ${aclRule.id}`);
    console.log(`Scope Type: ${aclRule.scope.type}`);
    if (aclRule.scope.value) {
      console.log(`Scope Value: ${aclRule.scope.value}`);
    }
    console.log(`Role: ${aclRule.role}`);
  } catch (error) {
    console.error(`Failed to get ACL rule: ${error.message}`);
  }
}

fetchAclRuleDetails();
```