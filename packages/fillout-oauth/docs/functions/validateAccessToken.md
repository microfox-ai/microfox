## Function: `validateAccessToken`

Validates the access token.

**Purpose:**
This function checks if the provided access token is valid by making a request to the Fillout API.

**Parameters:**

- `accessToken`: string (required)
  - The access token to validate.

**Return Value:**

- `Promise<boolean>`
  - A promise that resolves to a boolean indicating whether the token is valid.

**Examples:**

```typescript
// Example: Validating an access token
async function validateToken() {
  const isValid = await filloutOAuth.validateAccessToken("access_token_123");
  console.log("Token is valid:", isValid);
}

validateToken();
```