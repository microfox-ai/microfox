Validates an access token by making a request to the Reddit API.

Parameters:

- `accessToken`: The access token to validate.

Returns:

- A Promise that resolves to a boolean indicating whether the access token is valid.

Usage Example:

```typescript
const isValid = await redditOAuth.validateAccessToken('access_token');
console.log(isValid);
```
