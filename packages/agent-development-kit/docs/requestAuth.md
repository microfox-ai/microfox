## Function: `requestAuth`

Requests authentication.

**Purpose:**
Initiates an authentication request.

**Parameters:**
- `authConfig`: AuthConfig, required. The authentication configuration.
  - `type`: "api_key" | "oauth2". Type of authentication.

**Return Value:**
- `Promise<string>`: A promise that resolves to an authentication URL or token.

**Examples:**
```typescript
const authConfig = { type: "oauth2" };
const authUrl = await adk.requestAuth(authConfig);
window.location.href = authUrl;
```