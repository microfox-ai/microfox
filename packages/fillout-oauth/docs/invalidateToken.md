## Function: `invalidateToken`

Invalidates an access token, effectively logging the user out.

**Purpose:**
This function allows you to revoke an access token, preventing further use.

**Parameters:**

- `accessToken`: string (required)
  - The access token to invalidate.

**Return Value:**

- `Promise<void>`
  - A promise that resolves when the token has been successfully invalidated.

**Examples:**

```typescript
// Example: Invalidating an access token
async function invalidate(accessToken: string) {
  try {
    await filloutOAuth.invalidateToken(accessToken);
    console.log("Token invalidated successfully.");
  } catch (error) {
    console.error("Error invalidating token:", error);
  }
}

// Example usage with mock token
invalidate("mock-access-token");
```