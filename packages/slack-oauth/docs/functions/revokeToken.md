## Function: `revokeToken`

Revokes a Slack access token.

**Purpose:**
Invalidates a given access token.

**Parameters:**

- `token`: string - The access token to revoke. **Required.**

**Return Value:**

- `Promise<SlackRevokeResponse>` - A promise that resolves to an object indicating whether the token was revoked.

  - `ok`: boolean - Indicates whether the request was successful.
  - `revoked`: boolean - Indicates whether the token was revoked.

**Examples:**

```typescript
// Example usage
try {
  const revokeResponse = await slackOAuth.revokeToken('YOUR_TOKEN');
  console.log(revokeResponse);
} catch (error) {
  console.error('Error revoking token:', error);
}
```