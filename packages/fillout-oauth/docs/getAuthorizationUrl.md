## Function: `getAuthorizationUrl`

Generates the authorization URL to initiate the OAuth flow with Fillout.

**Purpose:**
This function constructs the URL that redirects the user to Fillout for authorization.

**Parameters:**

- `state`: string (optional)
  - An optional state parameter used for CSRF protection.  This value will be returned to your redirect URI after the user authorizes.

**Return Value:**

- `string`
  - The authorization URL.

**Examples:**

```typescript
// Example 1: Generating the authorization URL without state
const authUrl = filloutOAuth.getAuthorizationUrl();

// Example 2: Generating the authorization URL with state
const authUrlWithState = filloutOAuth.getAuthorizationUrl("my-custom-state");
```