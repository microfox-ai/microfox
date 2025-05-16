## Function: `getAuthorizationUrl`

Generates the authorization URL for the OAuth flow.

**Purpose:**
This function constructs the URL that the user needs to be redirected to in order to initiate the OAuth authorization process with Fillout.

**Parameters:**

- None

**Return Value:**

- `string`: The authorization URL.

**Examples:**

```typescript
// Example usage
const authorizationUrl = sdk.getAuthorizationUrl();
console.log(authorizationUrl);
```