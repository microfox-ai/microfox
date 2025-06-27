### App Server

After registering your GitHub app, you need to create and deploy a server which can retrieve the webhook event requests from GitHub as well as accept redirects from the OAuth user web flow.

The simplest way to create such a server is to use `createNodeMiddleware()`, it works with both, Node's [`http.createServer()`](https://nodejs.org/api/http.html#http_http_createserver_options_requestlistener) method as well as an [Express middleware](https://expressjs.com/en/guide/using-middleware.html).

The default routes that the middleware exposes are

| Route                                   | Route Description                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /api/github/webhooks`             | Endpoint to receive GitHub Webhook Event requests                                                                                                                                                                                                                                                                                                                             |
| `GET /api/github/oauth/login`           | Redirects to GitHub's authorization endpoint. Accepts optional `?state` and `?scopes` query parameters. `?scopes` is a comma-separated list of [supported OAuth scope names](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps#available-scopes)                                                                                                               |
| `GET /api/github/oauth/callback`        | The client's redirect endpoint. This is where the `token` event gets triggered                                                                                                                                                                                                                                                                                                |
| `POST /api/github/oauth/token`          | Exchange an authorization code for an OAuth Access token. If successful, the `token` event gets triggered.                                                                                                                                                                                                                                                                    |
| `GET /api/github/oauth/token`           | Check if token is valid. Must authenticate using token in `Authorization` header. Uses GitHub's [`POST /applications/{client_id}/token`](https://docs.github.com/en/rest/reference/apps#check-a-token) endpoint                                                                                                                                                               |
| `PATCH /api/github/oauth/token`         | Resets a token (invalidates current one, returns new token). Must authenticate using token in `Authorization` header. Uses GitHub's [`PATCH /applications/{client_id}/token`](https://docs.github.com/en/rest/reference/apps#reset-a-token) endpoint.                                                                                                                         |
| `PATCH /api/github/oauth/refresh-token` | Refreshes an expiring token (invalidates current one, returns new access token and refresh token). Must authenticate using token in `Authorization` header. Uses GitHub's [`POST https://github.com/login/oauth/access_token`](https://docs.github.com/en/developers/apps/refreshing-user-to-server-access-tokens#renewing-a-user-token-with-a-refresh-token) OAuth endpoint. |
| `POST /api/github/oauth/token/scoped`   | Creates a scoped token (does not invalidate the current one). Must authenticate using token in `Authorization` header. Uses GitHub's [`POST /applications/{client_id}/token/scoped`](https://docs.github.com/en/rest/reference/apps#create-a-scoped-access-token) endpoint.                                                                                                   |
| `DELETE /api/github/oauth/token`        | Invalidates current token, basically the equivalent of a logout. Must authenticate using token in `Authorization` header.                                                                                                                                                                                                                                                     |
| `DELETE /api/github/oauth/grant`        | Revokes the user's grant, basically the equivalent of an uninstall. must authenticate using token in `Authorization` header.                                                                                                                                                                                                                                                  |

Example: create a GitHub server with express

```js
import express from 'express';
import { App, createNodeMiddleware } from 'octokit';

const expressApp = express();
const octokitApp = new App({
  appId,
  privateKey,
  webhooks: { secret },
  oauth: { clientId, clientSecret },
});

expressApp.use(createNodeMiddleware(app));

expressApp.listen(3000, () => {
  console.log(`Example app listening at http://localhost:3000`);
});
```

## LICENSE

[MIT](LICENSE)
