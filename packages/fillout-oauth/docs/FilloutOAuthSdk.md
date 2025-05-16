## Constructor: `FilloutOAuthSdk`

Initializes a new instance of the Fillout OAuth SDK.

**Purpose:**
The constructor initializes the SDK with the necessary configuration for interacting with the Fillout OAuth API.

**Parameters:**

- `config`: object (required)
  - `clientId`: string (required). The client ID for your Fillout application.
  - `clientSecret`: string (required). The client secret for your Fillout application.
  - `redirectUri`: string (required). The redirect URI registered with your Fillout application. Must be a valid URL.
  - `state`: string (optional). An optional state parameter for CSRF protection.

**Return Value:**

- `FilloutOAuthSdk` instance

**Examples:**

```typescript
// Example: Initializing the SDK with configuration
const sdk = new FilloutOAuthSdk({
  clientId: process.env.FILLOUT_CLIENT_ID,
  clientSecret: process.env.FILLOUT_CLIENT_SECRET,
  redirectUri: process.env.FILLOUT_REDIRECT_URI,
  state: 'some-state',
});
```