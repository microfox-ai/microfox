Generates the authorization URL used to initiate the OAuth 2.0 flow.

Parameters:

- `state`: A string used to prevent CSRF attacks. This value will be returned in the redirect URI.
- `duration`: The duration of the access token. Can be either 'temporary' (default) or 'permanent'.

Returns:

- The authorization URL as a string.

Usage Example:

```typescript
const authorizationUrl = redditOAuth.getAuthorizationUrl(
  'random_string',
  'permanent',
);
console.log(authorizationUrl);
```
