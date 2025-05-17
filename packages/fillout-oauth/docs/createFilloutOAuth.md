## Function: `createFilloutOAuth`

Creates a new instance of the Fillout OAuth SDK.

**Purpose:**
This function initializes the SDK with the provided configuration.

**Parameters:**

- `config`: FilloutOAuthConfig (required)
  - An object containing the configuration options for the SDK.

  **FilloutOAuthConfig Type:**

  - `clientId`: string (required)
    - The client ID for the Fillout OAuth application.
  - `clientSecret`: string (required)
    - The client secret for the Fillout OAuth application.
  - `redirectUri`: string (required)
    - The redirect URI for the OAuth flow. Must be a valid URL.

**Return Value:**

- `FilloutOAuthSdk`
  - A new instance of the Fillout OAuth SDK.

**Examples:**

```typescript
// Example: Creating a new SDK instance
import { createFilloutOAuth } from '@microfox/fillout-oauth';

const filloutOAuth = createFilloutOAuth({
  clientId: process.env.FILLOUT_CLIENT_ID!,
  clientSecret: process.env.FILLOUT_CLIENT_SECRET!,
  redirectUri: process.env.FILLOUT_REDIRECT_URI!
});
```