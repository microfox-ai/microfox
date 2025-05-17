## Function: `checkAccessToken`

Checks if an access token is valid.

**Purpose:**
This function verifies the validity of an access token.

**Parameters:**

- `accessToken`: string (required)
  - The access token to check.

**Return Value:**

- `Promise<AccessTokenInfo | null>`
  - A promise that resolves to the access token info if valid, or null if invalid.

  **AccessTokenInfo Type:**

  - `valid`: boolean
    - Whether the access token is valid.
  - `userId`: string
    - The user ID associated with the access token.
  - `organizationId`: string
    - The organization ID associated with the access token.

**Examples:**

```typescript
// Example: Checking an access token
async function checkToken(accessToken: string) {
  try {
    const accessTokenInfo = await filloutOAuth.checkAccessToken(accessToken);
    console.log("Access Token Info:", accessTokenInfo);
  } catch (error) {
    console.error("Error checking access token:", error);
  }
}

// Example usage with mock token
checkToken("mock-access-token");

```