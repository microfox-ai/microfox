## Function: `getAuthUrl`

Generates the authorization URL required to initiate the Notion OAuth 2.0 flow. This URL is where you will redirect users to grant your application access to their Notion account.

**Purpose:**
This function is the first step in the OAuth process. It constructs the specific URL that users must visit to authorize your integration. Upon visiting this URL, the user will be prompted by Notion to select the pages and databases they wish to grant your application access to.

**Parameters:**

- `state`: `string` (optional) - An opaque value used to maintain state between the request and the callback and to prevent cross-site request forgery (CSRF) attacks. It is highly recommended to provide a unique, unguessable string for each authorization request. If a state is not provided, the SDK will automatically generate a secure, random string.

**Return Value:**

- `string`: The fully formed Notion authorization URL. You should redirect your user to this URL.

**Examples:**

```typescript
// Example 1: Minimal usage (state is generated automatically)
// In this case, the SDK handles the creation of a random state parameter.
const authUrl1 = notionOAuth.getAuthUrl();
console.log('Redirect users to this URL:', authUrl1);
// Example output: https://api.notion.com/v1/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&owner=user&state=...

// Example 2: Usage with a custom state for CSRF protection
// It's a good practice to generate a state, store it in the user's session,
// and then verify it when the user is redirected back to your application.
const myCustomState = 'a-very-secure-and-random-string-12345';
const authUrl2 = notionOAuth.getAuthUrl(myCustomState);
console.log('Redirect users to this URL:', authUrl2);
// Store `myCustomState` in the user's session to verify it on the callback.
```