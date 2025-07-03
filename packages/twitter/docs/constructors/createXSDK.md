## Constructor: `createXSDK`

Creates a new instance of the Microfox X SDK for interacting with the X (formerly Twitter) API v2.

**Purpose:**
Initializes a new X SDK client with the provided configuration.

**Parameters:**

- `config`: XSDKConfig - An object containing the API credentials and configuration options.
  - `apiKey`: string - Your X API key. **Required**.
  - `apiSecret`: string - Your X API secret key. **Required**.
  - `accessToken`: string - Your X access token. **Required**.
  - `accessSecret`: string - Your X access token secret. **Required**.

**Return Value:**

- `XSDK` - An instance of the X SDK client.

**Examples:**

```typescript
// Example: Creating an X SDK client
const x = createXSDK({
  apiKey: process.env.X_API_KEY,
  apiSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

// Now you can use the 'x' object to interact with the X API
```
