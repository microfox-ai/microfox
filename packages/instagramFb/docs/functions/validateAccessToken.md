## Function: `validateAccessToken`

Validates the access token by attempting to retrieve the Instagram Business Account.

**Purpose:**

Checks if the provided access token is valid.

**Parameters:**

None

**Return Value:**

- `Promise<void>`: Resolves if the access token is valid, rejects otherwise.

**Examples:**

```typescript
try {
  await sdk.validateAccessToken();
  console.log('Access token is valid');
} catch (error) {
  console.error('Invalid access token:', error.message);
}
```
