## Function: `validateAccessToken`

Validates an access token.

**Purpose:**
Checks if an access token is valid.

**Parameters:**

* `token`: `string`, **required**. The access token to validate.

**Return Value:**

* `Promise<boolean>`: A promise that resolves to `true` if the token is valid, `false` otherwise.

**Examples:**

```typescript
// Example: Validating an access token
async function validateToken(token: string) {
  const isValid = await sdk.validateAccessToken(token);
  console.log(isValid);
}

validateToken("access_token");
```