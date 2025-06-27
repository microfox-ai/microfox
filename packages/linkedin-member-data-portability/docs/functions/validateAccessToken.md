## Function: `validateAccessToken`

Validates the current access token.

**Purpose:**

Checks if the current access token is valid.

**Parameters:**

- None

**Return Value:**

- `Promise<void>`: Resolves if the access token is valid, rejects otherwise.

**Examples:**

```typescript
// Example: Validate the access token
try {
  await sdk.validateAccessToken();
  console.log('Access token is valid');
} catch (error) {
  console.error('Access token is invalid:', error);
}
```
