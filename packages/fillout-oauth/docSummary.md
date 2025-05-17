# Fillout OAuth 2.0 Implementation Summary for TypeScript

This document summarizes the Fillout OAuth 2.0 process for implementing a TypeScript OAuth package.  It focuses on the technical details required for integration.

## 1. OAuth 2.0 Flow Details

Fillout utilizes the **Authorization Code Grant** flow.  This is a three-legged OAuth flow involving the client, the user, and the Fillout authorization server.

## 2. Required Credentials

* **`client_id`:** (String)  A publicly available identifier for your application, obtained during app creation.
* **`client_secret`:** (String) A secret key for your application, generated during app creation.  **Keep this absolutely confidential.**

## 3. Authorization Endpoint

* **URL:** `https://build.fillout.com/authorize/oauth`
* **Method:** `GET`
* **Parameters:**
    * `client_id` (String, required): Your application's client ID.
    * `redirect_uri` (String, required): The URL where Fillout will redirect the user after authorization.  Must be pre-registered in your app configuration.
    * `state` (String, optional):  An opaque value used to maintain state between the request and callback.  Use this to prevent CSRF attacks.

## 4. Token Endpoint

* **URL:** `https://server.fillout.com/public/oauth/accessToken`
* **Method:** `POST`
* **Body Parameters:**
    * `code` (String, required): The authorization code received from the authorization endpoint.
    * `client_id` (String, required): Your application's client ID.
    * `client_secret` (String, required): Your application's client secret.
    * `redirect_uri` (String, required): The redirect URI used in the authorization request.

## 5. Required Scopes

The documentation doesn't explicitly list scopes.  Further clarification from Fillout's support is needed to determine if scopes are supported and what they are.  Assume, for now, that scopes are not explicitly defined.

## 6. Token Response Format

* **Format:** JSON
* **Fields:**
    * `"access_token"` (String): The access token used to access the Fillout API.
    * `"base_url"` (String): The base URL for the Fillout API (e.g., `https://api.fillout.com`).  This might vary based on location or self-hosting.

## 7. Token Refresh Mechanism

The documentation does *not* describe a token refresh mechanism.  This means access tokens likely have a limited lifespan and will need to be re-obtained via the authorization code flow after they expire.

## 8. Other Important Information

* **Error Handling:**  The documentation lacks details on error responses from both the authorization and token endpoints.  Robust error handling should be implemented in your TypeScript package.
* **State Management:**  Properly manage the `state` parameter to prevent CSRF attacks.  Generate a unique, unpredictable value for each authorization request and verify it on the redirect.
* **Security:**  Never expose your `client_secret` in client-side code.  Store it securely on your server.
* **API Documentation:**  The provided documentation lacks details about the Fillout API itself. You will need to obtain separate API documentation from Fillout to understand how to use the `access_token` to access their resources.
* **Token Invalidation:**  An endpoint to invalidate access tokens is provided (`DELETE https://server.fillout.com/public/oauth/invalidate`), requiring a Bearer token in the header.  This should be considered for implementing a logout functionality.


## TypeScript Package Considerations

A TypeScript package could be structured as follows:

```typescript
// fillout-oauth.ts

export class FilloutOAuth {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string = 'https://api.fillout.com'; // Default, could be overridden

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  getAuthorizationUrl(state?: string): string {
    // ... constructs and returns the authorization URL ...
  }

  async getToken(code: string): Promise<{ accessToken: string; baseUrl: string }> {
    // ... makes the POST request to the token endpoint ...
  }

  async invalidateToken(accessToken: string): Promise<void> {
    // ... makes the DELETE request to invalidate the token ...
  }

  // ... other helper functions for API calls ...
}
```

This outline provides a starting point.  Remember to handle errors, implement robust security practices, and thoroughly test your integration.  Always refer to the most up-to-date Fillout API documentation.
