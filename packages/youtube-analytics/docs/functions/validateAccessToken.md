## Function: `validateAccessToken`

Validates the access token.

**Purpose:**
Checks if the current access token is valid.

**Parameters:**

None

**Return Value:**

- `Promise<boolean>`: A promise that resolves to `true` if the access token is valid, `false` otherwise.

**Examples:**

```typescript
// Example: Validate the access token
const isValid = await sdk.validateAccessToken();
```