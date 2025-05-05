## Function: `createSCIMUser`

Creates a SCIM user in Notion (Enterprise plan required).

**Purpose:**
Provisions a new user via SCIM.

**Parameters:**

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

- `Promise<SCIMUser>`: A promise that resolves to the created SCIMUser object.
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
// Example: Creating a SCIM user
const newUser = await notion.createSCIMUser({ userName: "newuser", name: { givenName: "John", familyName: "Doe" }, emails: [{ value: "john.doe@example.com", type: "work", primary: true }], active: true });
console.log(newUser);
```