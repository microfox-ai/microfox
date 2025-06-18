## Function: `validateAccessToken`

Validates the current access token.

**Purpose:**
Checks if the current access token is valid.

**Parameters:**
None

**Return Value:**
boolean - True if the access token is valid, false otherwise.

**Examples:**
```typescript
const isValid = await sdk.validateAccessToken();
console.log(isValid); // true or false
```