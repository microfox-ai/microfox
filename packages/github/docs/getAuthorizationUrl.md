## Function: `getAuthorizationUrl`

Retrieves the authorization URL for the GitHub OAuth flow.

**Purpose:**
Gets the URL that users should be redirected to for authorization.

**Parameters:**
None

**Return Value:**

* `Promise<string>`: A promise that resolves to the authorization URL.

**Examples:**

```typescript
// Example: Getting the authorization URL
async function getAuthUrl() {
  const authUrl = await sdk.getAuthorizationUrl();
  console.log(authUrl);
}

getAuthUrl();
```