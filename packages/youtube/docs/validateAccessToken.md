## Function: `validateAccessToken`

Validates the current access token.

**Purpose:**
Checks if the current access token is valid.

**Parameters:**

*None*

**Return Value:**

* `Promise<void>`: A promise that resolves if the access token is valid, and rejects otherwise.

**Examples:**

```typescript
try {
  await youtube.validateAccessToken();
  console.log("Access token is valid");
} catch (error) {
  console.error("Access token is invalid:", error);
}
```