## Function: `getAuthUrl`

Generates the authorization URL to initiate the Slack OAuth flow.

**Purpose:**
Creates the URL that redirects the user to Slack for authorization.

**Parameters:**

- `state`: string - Optional state parameter for CSRF protection.

**Return Value:**

- `string` - The authorization URL.

**Examples:**

```typescript
// Example 1: Minimal usage
const authUrl = slackOAuth.getAuthUrl();

// Example 2: With state parameter
const authUrl = slackOAuth.getAuthUrl('my_state');
```
