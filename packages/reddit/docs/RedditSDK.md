## Constructor: `RedditSDK`

Initializes a new instance of the `RedditSDK` class.

**Purpose:**
Creates a new RedditSDK object for interacting with the Reddit API.

**Parameters:**

- `config`: object<RedditSDKConfig> - Configuration options for the SDK.
  - `clientId`: string - Your Reddit application's client ID.
  - `clientSecret`: string - Your Reddit application's client secret.
  - `accessToken`: string - The access token for authenticating requests.
  - `scopes`: array<string> - An array of scopes defining the permissions requested.

**Return Value:**

- `RedditSDK` - A new instance of the RedditSDK class.

**Examples:**

```typescript
// Example using environment variables
const sdk = new RedditSDK({
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  accessToken: process.env.REDDIT_ACCESS_TOKEN,
  scopes: process.env.SCOPES.split(','),
});
```
