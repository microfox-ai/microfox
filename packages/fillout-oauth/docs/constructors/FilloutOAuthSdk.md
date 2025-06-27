## Constructor: `FilloutOAuthSdk`

Initializes a new instance of the FilloutOAuthSdk for interacting with the Fillout OAuth API.

**Purpose:**

This constructor sets up the SDK with the necessary configuration to perform OAuth operations with Fillout.

**Parameters:**

- `config`: FilloutOAuthConfig (required)
  - An object containing the client ID, client secret, and redirect URI.
    - `clientId`: string (required)
      - The client ID for your Fillout application.
    - `clientSecret`: string (required)
      - The client secret for your Fillout application.
    - `redirectUri`: string (required)
      - The redirect URI for your Fillout application. Must be a valid URL.

**Examples:**

```typescript
// Example: Initializing the SDK with configuration
const filloutOAuth = new FilloutOAuthSdk({
  clientId: process.env.FILLOUT_CLIENT_ID!,
  clientSecret: process.env.FILLOUT_CLIENT_SECRET!,
  redirectUri: process.env.FILLOUT_REDIRECT_URI!
});
```