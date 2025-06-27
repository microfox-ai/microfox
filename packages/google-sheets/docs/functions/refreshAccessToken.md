## Function: `refreshAccessToken`

Refreshes the access token.

**Purpose:**
Uses the refresh token to obtain a new access token.

**Parameters:**
None

**Return Value:**

- `Promise<void>` - A promise that resolves when the access token has been refreshed.

**Examples:**

```typescript
// Example usage:
await sdk.refreshAccessToken();
console.log('Access token refreshed.');
```
