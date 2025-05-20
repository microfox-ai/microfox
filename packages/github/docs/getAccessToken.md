## Function: `getAccessToken`

Exchanges an authorization code for an access token.

**Purpose:**
Retrieves an access token after the user has authorized the application.

**Parameters:**

* `code`: `string`, **required**. The authorization code received from the OAuth flow.

**Return Value:**

* `Promise<string>`: A promise that resolves to the access token.

**Examples:**

```typescript
// Example: Getting the access token
async function getToken(code: string) {
  const accessToken = await sdk.getAccessToken(code);
  console.log(accessToken);
}

getToken("auth_code");
```