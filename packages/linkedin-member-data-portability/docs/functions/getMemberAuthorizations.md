## Function: `getMemberAuthorizations`

Retrieves member authorizations.

**Purpose:**

Fetches authorization information for the authenticated member.

**Parameters:**

- None

**Return Value:**

- `Promise<MemberComplianceAuthorizationSchema>`: Member authorization data.
  - `MemberComplianceAuthorizationSchema` (object):
    - `regulatedAt` (number, required): Timestamp when the authorization was regulated.
    - `memberComplianceAuthorizationKey` (object, required): Authorization key.
      - `developerApplication` (string, required): Developer application ID.
      - `member` (string, required): Member ID.
    - `memberComplianceScopes` (array<string>, required): List of authorized scopes.

**Examples:**

```typescript
// Example: Get member authorizations
try {
  const authorizations = await sdk.getMemberAuthorizations();
  console.log(authorizations);
} catch (error) {
  console.error('Failed to get authorizations:', error);
}
```
