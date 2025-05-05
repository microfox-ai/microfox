## Function: `refreshAccessToken`

Refreshes the current access token using the refresh token.

**Purpose:**
Obtains a new access token using the refresh token.

**Parameters:**
*None*

**Return Value:**

* `Promise<void>`: A promise that resolves with the new access token.

**Examples:**

```typescript
try {
  await youtube.refreshAccessToken();
  console.log("Access token refreshed");
} catch (error) {
  console.error("Failed to refresh access token:", error);
}
```