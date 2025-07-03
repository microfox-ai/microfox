# Notion OAuth 2.0 Summary for TypeScript Package

This document summarizes the Notion OAuth 2.0 flow for building a TypeScript OAuth package.  It focuses on public integrations.  Internal integrations use a simpler token-based approach not covered here.

## 1. OAuth 2.0 Flow Details

Notion uses the **Authorization Code Grant** flow.  This flow prioritizes security by exchanging a temporary authorization code for an access token on the server-side, preventing the access token from being exposed in the client.

The flow consists of these steps:

1. **Authorization Request:** The client redirects the user to Notion's authorization endpoint.
2. **User Authorization:** The user grants permission to the integration, selecting which Notion workspace pages to share (optional).
3. **Redirect with Code:** Notion redirects the user back to the client's redirect URI with a temporary authorization code (`code`) as a query parameter.
4. **Token Request:** The client makes a POST request to Notion's token endpoint, exchanging the authorization code for an access token.
5. **Token Response:** Notion returns an access token and other information.
6. **API Access:** The client uses the access token to make requests to the Notion API.


## 2. Required Credentials

* **`OAUTH_CLIENT_ID`:**  Your integration's client ID (obtained from the Notion integration settings).
* **`OAUTH_CLIENT_SECRET`:** Your integration's client secret (obtained from the Notion integration settings; keep this strictly confidential!).


## 3. Authorization Endpoint

`https://api.notion.com/v1/oauth/authorize`

**Required Query Parameters:**

* `client_id`: Your `OAUTH_CLIENT_ID`.
* `redirect_uri`: The URL where Notion will redirect the user after authorization.  Must be pre-registered in your Notion integration settings.
* `response_type`: `code` (always).
* `owner`: `user` (always).
* `state` (optional):  A CSRF protection token.


## 4. Token Endpoint

`https://api.notion.com/v1/oauth/token`

**Request Method:** `POST`

**Headers:**

* `Authorization`: `Basic <base64 encoded CLIENT_ID:CLIENT_SECRET>`
* `Content-Type`: `application/json`

**Request Body (JSON):**

* `"grant_type"`: `"authorization_code"`
* `"code"`: The authorization code received from the redirect URI.
* `"redirect_uri"`: The redirect URI (required if specified as a query parameter in the authorization request, or if multiple redirect URIs are registered).


## 5. Required Scopes

Notion doesn't explicitly define scopes in the same way as some other OAuth providers.  Access is granted based on the pages the user selects during the authorization process.  There's no concept of requesting specific permissions beyond what the user explicitly grants.


## 6. Token Response Format (JSON)

```json
{
  "access_token": "YOUR_ACCESS_TOKEN",
  "bot_id": "YOUR_BOT_ID",
  "duplicated_template_id": "TEMPLATE_ID_OR_NULL", // Null if no template used
  "owner": { "workspace": true } // or a user object for user-level tokens
  "workspace_icon": "ICON_URL",
  "workspace_id": "YOUR_WORKSPACE_ID",
  "workspace_name": "YOUR_WORKSPACE_NAME"
}
```


## 7. Token Refresh Mechanism

Notion's documentation doesn't mention a token refresh mechanism.  Access tokens likely have a limited lifespan, and re-authorization will be necessary after expiration.


## 8. Other Important Information

* **Error Handling:**  Implement robust error handling for both the authorization and token request flows.  Notion uses standard OAuth error codes.
* **State Parameter:**  Use the `state` parameter to prevent CSRF attacks.
* **Secret Management:**  Never hardcode your client secret in your code. Use environment variables or a secure secret management system.
* **Storage:**  Persist the access token and other returned information securely (e.g., in a database, using a secure key-value store).  The `bot_id` is a good candidate for a primary key.
* **Rate Limiting:** Be mindful of Notion's API rate limits.


## TypeScript Package Considerations

A TypeScript package would encapsulate the OAuth flow, providing functions for:

* Generating the authorization URL.
* Handling the redirect and extracting the authorization code.
* Making the token request.
* Storing and managing access tokens.
* Providing helper functions for making authenticated requests to the Notion API.


This summary provides the technical details necessary to build such a package. Remember to consult the Notion API documentation for details on the available API endpoints and their usage.
