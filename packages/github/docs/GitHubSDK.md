## Constructor: `GitHubSDK`

Initializes a new instance of the GitHubSDK.

**Purpose:**
Creates a new GitHubSDK object for interacting with the GitHub API.

**Parameters:**

* `options`: An object containing the necessary configuration options.
    * `clientId`: `string`, **required**. Your GitHub OAuth app's client ID.
    * `clientSecret`: `string`, **required**. Your GitHub OAuth app's client secret.
    * `redirectUri`: `string`, **required**. The redirect URI you specified when creating the OAuth app.
    * `scopes`: `array<string>`, **required**. An array of strings representing the OAuth scopes requested.

**Return Value:**

* `GitHubSDK`: A new instance of the GitHubSDK.

**Examples:**

```typescript
// Example: Initializing the SDK
const sdk = new GitHubSDK({
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_REDIRECT_URI,
  scopes: ["repo", "user"],
});
```