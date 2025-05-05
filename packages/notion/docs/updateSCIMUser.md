## Function: `updateSCIMUser`

Updates a SCIM user in Notion (Enterprise plan required).

**Purpose:**
Modifies an existing user via SCIM.

**Parameters:**

- `userId`: string (required). The ID of the SCIM user to update.
- `userData`: Partial<SCIMUser> (required).
  - `userName`: string. Username of the SCIM user.
  - `name`: object. Name of the SCIM user.
    - `givenName`: string.
    - `familyName`: string.
  - `emails`: array<object>. Email addresses of the SCIM user.
    - `value`: string.
    - `type`: "work" | "home" | "other".
    - `primary`: boolean.
  - `active`: boolean. Whether the SCIM user is active.

**Return Value:**

- `Promise<SCIMUser>`: A promise that resolves to the updated SCIMUser object.
  - `id`: string. Unique identifier for the SCIM user.
  - `userName`: string. Username of the SCIM user.
  - `name`: object. Name of the SCIM user.
    - `givenName`: string.
    - `familyName`: string.
  - `emails`: array<object>. Email addresses of the SCIM user.
    - `value`: string.
    - `type`: "work" | "home" | "other".
    - `primary`: boolean.
  - `active`: boolean. Whether the SCIM user is active.

**Examples:**

```typescript
// Example: Updating a SCIM user
const updatedUser = await notion.updateSCIMUser("some-user-id", { active: false });
console.log(updatedUser);
```