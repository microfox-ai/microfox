## Function: `generateOAuthHeader`

Generates an OAuth 1.0a header for authenticating requests to the X API.

**Purpose:**
Creates the Authorization header required for making authenticated requests to X.

**Parameters:**

- `method`: string - The HTTP method (e.g., "GET", "POST"). **Required**.
- `url`: string - The full URL of the request. **Required**.
- `params`: Record<string, string> (optional) - Additional parameters to include in the signature.

**Return Value:**

- `string` - The generated OAuth 1.0a header.

**Examples:**

```typescript
const url = 'https://api.twitter.com/2/tweets';
const header = x.generateOAuthHeader('GET', url);
```
