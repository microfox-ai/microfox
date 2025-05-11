# Slack OAuth 2.0 Flow: Technical Summary for TypeScript Package

This document summarizes the technical details of Slack's OAuth 2.0 flow, focusing on information needed to build a TypeScript OAuth package.

## 1. OAuth 2.0 Flow Details

Slack uses a modified Authorization Code flow for OAuth 2.0.  It involves three steps:

1. **Authorization Request:** The application redirects the user to Slack's authorization endpoint.
2. **User Authorization:** The user grants permissions to the application.
3. **Token Exchange:** The application exchanges the authorization code received from Slack for an access token.

## 2. Required Credentials

* **Client ID:** Obtained from the Slack App Management page.  This uniquely identifies your application.
* **Client Secret:** Obtained from the Slack App Management page. This is a secret key used to verify your application's identity during the token exchange.

## 3. Authorization Endpoint

* **For standard Slack workspaces:** `https://slack.com/oauth/v2/authorize`
* **For GovSlack workspaces:** `https://slack-gov.com/oauth/v2/authorize`

**Request Parameters:**

* `client_id`: Your application's Client ID.
* `scope`: Comma-separated list of requested scopes (see section 5).
* `redirect_uri`: The URL where Slack will redirect the user after authorization.  **Must be HTTPS and match a Redirect URL configured in the App Management page.**  Multiple Redirect URLs are supported, but `redirect_uri` must be consistent across authorization and token exchange requests.
* `team`: (Optional) The ID of the Slack workspace to authorize against.  If omitted, the user can select their workspace.
* `user_scope`: (Optional) Comma-separated list of scopes requested for a user token (in addition to or instead of `scope`).  This allows your app to act on behalf of the user.

## 4. Token Endpoint

`https://slack.com/api/oauth.v2.access`

**Request Method:** `POST`

**Request Parameters:**

* `code`: The authorization code received from Slack after user authorization.
* `client_id`: Your application's Client ID.
* `client_secret`: Your application's Client Secret.
* `redirect_uri`:  (Required if multiple Redirect URLs configured) Must match the `redirect_uri` used in the authorization request.


## 5. Required Scopes

Scopes define the permissions your application requests.  Examples include: `incoming-webhook`, `commands`, `chat:write`.  A full list of scopes is available in the Slack API documentation.  Note that scopes are additive; once granted, they cannot be removed without revoking the token.  SIWS (Sign in with Slack) scopes cannot be combined with non-SIWS scopes in the same OAuth flow.

## 6. Token Response Format (JSON)

```json
{
  "ok": true,
  "access_token": "xoxb-...", // Bot user access token
  "token_type": "bot",
  "scope": "commands,incoming-webhook",
  "bot_user_id": "U...",
  "app_id": "A...",
  "team": { ... },
  "enterprise": { ... },
  "authed_user": { // Only present if user_scope was requested
    "id": "U...",
    "scope": "chat:write",
    "access_token": "xoxp-...", // User access token
    "token_type": "user"
  }
}
```

## 7. Token Refresh Mechanism

Slack OAuth tokens do not expire, but they can be revoked.  There is no explicit refresh token mechanism.  If a token is revoked, a new authorization flow is required.

## 8. Other Important Information

* **Error Handling:** The response may contain error information (`ok: false`).  Common errors include `bad_redirect_uri`, `invalid_scope`, etc.  Refer to the Slack documentation for a full list.
* **Token Storage:** Securely store access tokens and client secrets.
* **Token Usage:** Access tokens (bearer tokens) should be sent in the `Authorization` header (`Authorization: Bearer <access_token>`) or as a `token` parameter in the request body.
* **Token Revocation:**  Tokens can be revoked using the `auth.revoke` method (details not provided in this excerpt).
* **State Parameter:**  Include a `state` parameter in the authorization request to prevent CSRF attacks.  Verify the returned `state` value on the redirect.


This summary provides the essential information for building a TypeScript OAuth 2.0 package for interacting with the Slack API.  Remember to consult the official Slack API documentation for the most up-to-date information and a complete list of scopes and error codes.
