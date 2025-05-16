## Function: `validateAuthorizationResponse`

Validates the authorization response from Fillout.

**Purpose:**
This function validates the query parameters received from the redirect URL after the user authorizes the application.

**Parameters:**

- `params`: URLSearchParams (required). The query parameters from the redirect URL.

**Return Value:**

- `AuthorizationResponse`:
  - `code`: string. The authorization code returned by Fillout.
  - `state`: string. The state parameter returned by Fillout.

**Examples:**

```typescript
// Example usage
const urlParams = new URLSearchParams('code=<authorization_code>&state=<state>');
const authorizationResponse = sdk.validateAuthorizationResponse(urlParams);
console.log(authorizationResponse);
```