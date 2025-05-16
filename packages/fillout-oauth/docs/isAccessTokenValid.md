## Function: `isAccessTokenValid`

Checks if the provided access token is valid.

**Purpose:**
This function checks if the provided access token is valid. Note: Fillout doesn't provide a specific endpoint for token validation. This method is a placeholder and should be implemented based on Fillout's API behavior.

**Parameters:**

- `accessToken`: string (required). The access token to validate.

**Return Value:**

- `Promise<boolean>`: A promise that resolves to a boolean indicating if the token is valid.

**Examples:**

```typescript
// Example usage
try {
  const isValid = await sdk.isAccessTokenValid('<access_token>');
  console.log(isValid);
} catch (error) {
  console.error('Error validating access token:', error);
}

```