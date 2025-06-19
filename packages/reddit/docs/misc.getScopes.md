## Function: `getScopes`

Part of the `misc` section. Get information about OAuth2 scopes.

**Parameters:**

- `scopes` (string, optional): An OAuth2 scope string.

**Return Value:**

- `Promise<any>`: A promise that resolves with the scope information.

**Usage Examples:**

```typescript
// Get information about all scopes
const scopes = await reddit.api.misc.getScopes();
console.log(scopes);
```

```typescript
// Get information about specific scopes
const specificScopes = await reddit.api.misc.getScopes({
  scopes: 'identity,read',
});
console.log(specificScopes);
```
