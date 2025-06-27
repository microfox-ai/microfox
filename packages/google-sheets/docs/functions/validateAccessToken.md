## Function: `validateAccessToken`

Validates the access token and refreshes it if necessary.

**Purpose:**
Checks if the current access token is valid. If not, it attempts to refresh the token using the refresh token.

**Parameters:**
None

**Return Value:**

- `Promise<boolean>` - A promise that resolves to `true` if the access token is valid, `false` otherwise.

**Examples:**

```typescript
// Example usage:
const isValid = await sdk.validateAccessToken();
if (!isValid) {
  console.log('Access token is invalid.');
}
```
