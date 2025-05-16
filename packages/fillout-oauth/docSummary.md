# Fillout OAuth 2.0 Implementation Summary for TypeScript

This document summarizes the Fillout OAuth 2.0 flow and provides the technical details necessary to build a TypeScript OAuth package.  The flow described is an Authorization Code Grant flow.

## 1. OAuth 2.0 Flow Details

Fillout uses the **Authorization Code Grant** flow.  This involves a two-step process:

* **Authorization Request:** The client redirects the user to Fillout's authorization server to obtain an authorization code.
* **Token Request:** The client exchanges the authorization code for an access token.

## 2. Required Credentials

* **`client_id`:**  A public identifier for your application. Obtained during application creation in Fillout's developer settings.
* **`client_secret`:** A secret key for your application.  Generated during application creation in Fillout's developer settings.  **Keep this secret!**
* **`redirect_uri`:** The URL where Fillout will redirect the user after authorization. This must be pre-registered in your Fillout application settings.

## 3. Authorization Endpoint

`GET https://build.fillout.com/authorize/oauth`

**Query Parameters:**

* `client_id`: Your application's client ID.
* `redirect_uri`: Your registered redirect URI.
* `state`:  An arbitrary string used to prevent CSRF attacks.  Your application should generate and verify this value.

**Response:**  A redirect to the `redirect_uri` with the following query parameters:

* `code`: An authorization code.
* `state`: The value of the `state` parameter you sent in the request.

## 4. Token Endpoint

`POST https://server.fillout.com/public/oauth/accessToken`

**Request Body:**

* `code`: The authorization code received from the authorization endpoint.
* `client_id`: Your application's client ID.
* `client_secret`: Your application's client secret.
* `redirect_uri`: Your registered redirect URI.

**Response:** (JSON)

```json
{
  "access_token": "abcdefg",
  "base_url": "https://api.fillout.com"
}
```

* `access_token`: The access token used to access the Fillout API.
* `base_url`: The base URL for the Fillout API.


## 5. Required Scopes

The documentation doesn't explicitly list required scopes.  Further clarification from Fillout's documentation is needed to determine if scopes are supported and how to request them.  If scopes are not supported, this section can be omitted in the TypeScript package.

## 6. Token Response Format

See section 4, Token Endpoint Response.

## 7. Token Refresh Mechanism

The documentation does not describe a token refresh mechanism.  Assume tokens have a limited lifespan and will need to be re-obtained via the authorization code flow.  The TypeScript package should handle this appropriately, potentially by prompting the user to re-authorize.

## 8. Other Important Information

* **Error Handling:** The documentation lacks details on error responses.  The TypeScript package should handle potential errors during authorization and token exchange gracefully.
* **Security:**  Implement robust security measures to protect your `client_secret`.  Never expose it in client-side code.  Use HTTPS for all communication.
* **State Management:**  Properly manage the `state` parameter to prevent CSRF attacks.
* **API Documentation:**  Thorough API documentation for the Fillout API is needed to utilize the access token effectively.  The `base_url` provided in the token response will be the base for API calls.


## TypeScript Package Considerations

A TypeScript package could be structured as follows:

```typescript
// fillout-oauth.ts
export class FilloutOAuth {
  constructor(clientId: string, clientSecret: string, redirectUri: string) { ... }

  authorize(): Promise<string> { ... } // Initiates the authorization flow

  getToken(code: string): Promise<{ accessToken: string; baseUrl: string }> { ... } // Exchanges code for token

  invalidateToken(accessToken: string): Promise<void> { ... } // Optional, based on API availability
}
```

This structure would encapsulate the OAuth flow, providing methods for authorization, token exchange, and potentially token invalidation.  Error handling and security best practices should be thoroughly implemented within each method.  Remember to handle the `state` parameter appropriately.  The package should also include clear documentation and examples.
