## Function: `validateAccessToken`

Validates the current access token.

**Purpose:**
Checks if the current access token is valid.

**Parameters:**
None

**Return Value:**

- `Promise<void>`
  - Resolves if the access token is valid.
  - Rejects with an error if the access token is invalid or if validation fails.

**Examples:**

```typescript
try {
  await sdk.validateAccessToken();
  console.log('Access token is valid');
} catch (error) {
  console.error('Access token validation failed:', error.message);
}
```
