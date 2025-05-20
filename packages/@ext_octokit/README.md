# octokit.js

> The all-batteries-included GitHub SDK for Browsers, Node.js, and Deno.

The `octokit` package integrates the three main Octokit libraries

1. **API client** (REST API requests, GraphQL API queries, Authentication)
2. **App client** (GitHub App & installations, Webhooks, OAuth)
3. **Action client** (Pre-authenticated API client for single repository)

## Usage

<table>
<tbody valign=top align=left>
<tr><th>
Node
</th><td>

Install with <code>npm/pnpm install octokit</code>, or <code>yarn add octokit</code>

```js
import { Octokit, App } from 'octokit';
```

</td></tr>
</tbody>
</table>

> [!IMPORTANT]
> As we use [conditional exports](https://nodejs.org/api/packages.html#conditional-exports), you will need to adapt your `tsconfig.json` by setting `"moduleResolution": "node16", "module": "node16"`.
>
> See the TypeScript docs on [package.json "exports"](https://www.typescriptlang.org/docs/handbook/modules/reference.html#packagejson-exports).<br>
> See this [helpful guide on transitioning to ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) from [@sindresorhus](https://github.com/sindresorhus)

## `Octokit` API Client

**standalone minimal Octokit**: [`@octokit/core`](https://github.com/octokit/core.js/#readme).

The `Octokit` client can be used to send requests to [GitHub's REST API](https://docs.github.com/rest/) and queries to [GitHub's GraphQL API](https://docs.github.com/graphql).

**Example**: Get the username for the authenticated user.

```js
// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN });

// Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
const {
  data: { login },
} = await octokit.rest.users.getAuthenticated();
console.log('Hello, %s', login);
```

### Authentication

By default, the `Octokit` API client supports authentication using a static token.

There are different means of authentication that are supported by GitHub, that are described in detail at [octokit/authentication-strategies.js](https://github.com/octokit/authentication-strategies.js/#readme). You can set each of them as the `authStrategy` constructor option, and pass the strategy options as the `auth` constructor option.

For example, in order to authenticate as a GitHub App Installation:

```js
import { createAppAuth } from '@octokit/auth-app';
const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_APP_PRIVATEKEY,
    installationId: process.env.GITHUB_INSTALLATION_ID,
  },
});

// authenticates as app based on request URLs
const {
  data: { slug },
} = await octokit.rest.apps.getAuthenticated();

// creates an installation access token as needed
// assumes that installationId 123 belongs to @octocat, otherwise the request will fail
await octokit.rest.issues.create({
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello world from ' + slug,
});
```

You can use the [`App`](#github-app) or [`OAuthApp`](#oauth-app) SDKs which provide APIs and internal wiring to cover most use cases.

For example, to implement the above using `App`

```js
const app = new App({ appId, privateKey });
const { data: slug } = await app.octokit.rest.apps.getAuthenticated();
const octokit = await app.getInstallationOctokit(123);
await octokit.rest.issues.create({
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello world from ' + slug,
});
```

Learn more about [how authentication strategies work](https://github.com/octokit/authentication-strategies.js/#how-authentication-strategies-work) or how to [create your own](https://github.com/octokit/authentication-strategies.js/#create-your-own-octokit-authentication-strategy-module).

### REST API

There are two ways of using the GitHub REST API, the [`octokit.rest.*` endpoint methods](#octokitrest-endpoint-methods) and [`octokit.request`](#octokitrequest). Both act the same way, the `octokit.rest.*` methods are just added for convenience, they use `octokit.request` internally.

For example

```js
await octokit.rest.issues.create({
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello, world!',
  body: 'I created this issue using Octokit!',
});
```

Is the same as

```js
await octokit.request('POST /repos/{owner}/{repo}/issues', {
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello, world!',
  body: 'I created this issue using Octokit!',
});
```

In both cases a given request is authenticated, retried, and throttled transparently by the `octokit` instance which also manages the `accept` and `user-agent` headers as needed.

`octokit.request` can be used to send requests to other domains by passing a full URL and to send requests to endpoints that are not (yet) documented in [GitHub's REST API documentation](https://docs.github.com/rest).

#### `octokit.rest` endpoint methods

Every GitHub REST API endpoint has an associated `octokit.rest` endpoint method for better code readability and developer convenience. See [`@octokit/plugin-rest-endpoint-methods`](https://github.com/octokit/plugin-rest-endpoint-methods.js/#readme) for full details.

Example: [Create an issue](https://docs.github.com/en/rest/reference/issues#create-an-issue)

```js
await octokit.rest.issues.create({
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello, world!',
  body: 'I created this issue using Octokit!',
});
```

The `octokit.rest` endpoint methods are generated automatically from [GitHub's OpenAPI specification](https://github.com/github/rest-api-description/). We track operation ID and parameter name changes in order to implement deprecation warnings and reduce the frequency of breaking changes.

Under the covers, every endpoint method is just `octokit.request` with defaults set, so it supports the same parameters as well as the `.endpoint()` API.

#### `octokit.request()`

You can call the GitHub REST API directly using `octokit.request`. The `request` API matches GitHub's REST API documentation 1:1 so anything you see there, you can call using `request`. See [`@octokit/request`](https://github.com/octokit/request.js#readme) for all the details.

Example: [Create an issue](https://docs.github.com/en/rest/reference/issues#create-an-issue)

[![Screenshot of REST API reference documentation for Create an issue](assets/create-an-issue-reference.png)](https://docs.github.com/en/rest/reference/issues#create-an-issue)

The `octokit.request` API call corresponding to that issue creation documentation looks like this:

```js
// https://docs.github.com/en/rest/reference/issues#create-an-issue
await octokit.request('POST /repos/{owner}/{repo}/issues', {
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello, world!',
  body: 'I created this issue using Octokit!',
});
```

The 1st argument is the REST API route as listed in GitHub's API documentation. The 2nd argument is an object with all parameters, independent of whether they are used in the path, query, or body.

#### Pagination

All REST API endpoints that paginate return the first 30 items by default. If you want to retrieve all items, you can use the pagination API. The pagination API expects the REST API route as first argument, but you can also pass any of the `octokit.rest.*.list*` methods for convenience and better code readability.

Example: iterate through all issues in a repository

```js
const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
  owner: 'octocat',
  repo: 'hello-world',
  per_page: 100,
});

// iterate through each response
for await (const { data: issues } of iterator) {
  for (const issue of issues) {
    console.log('Issue #%d: %s', issue.number, issue.title);
  }
}
```

Using the [async iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) is the most memory efficient way to iterate through all items. But you can also retrieve all items in a single call

```js
const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner: 'octocat',
  repo: 'hello-world',
  per_page: 100,
});
```

#### Media Type formats

Media type formats can be set using `mediaType: { format }` on every request.

Example: retrieve the raw content of a `package.json` file

```js
const { data } = await octokit.rest.repos.getContent({
  mediaType: {
    format: 'raw',
  },
  owner: 'octocat',
  repo: 'hello-world',
  path: 'package.json',
});
console.log('package name: %s', JSON.parse(data).name);
```

Learn more about [Media type formats](https://docs.github.com/en/rest/overview/media-types).

#### Request error handling

**Standalone module:** [`@octokit/request-error`](https://github.com/octokit/request-error.js/#readme)

For request error handling, import `RequestError` and use `try...catch` statement.

```typescript
import { RequestError } from 'octokit';
```

```typescript
try {
  // your code here that sends at least one Octokit request
  await octokit.request('GET /');
} catch (error) {
  // Octokit errors are instances of RequestError, so they always have an `error.status` property containing the HTTP response code.
  if (error instanceof RequestError) {
    // handle Octokit error
    // error.message; // Oops
    // error.status; // 500
    // error.request; // { method, url, headers, body }
    // error.response; // { url, status, headers, data }
  } else {
    // handle all other errors
    throw error;
  }
}
```

## App client

The `App` client combines features for GitHub Apps, Webhooks, and OAuth

### GitHub App

**Standalone module**: [`@octokit/app`](https://github.com/octokit/app.js/#readme)

For integrators, GitHub Apps are a means of authentication and authorization. A GitHub app can be registered on a GitHub user or organization account. A GitHub App registration defines a set of permissions and webhooks events it wants to receive and provides a set of credentials in return. Users can grant access to repositories by installing them.

Some API endpoints require the GitHub app to authenticate as itself using a JSON Web Token (JWT). For requests affecting an installation, an installation access token has to be created using the app's credentials and the installation ID.

The `App` client takes care of all that for you.

Example: Dispatch a repository event in every repository the app is installed on

```js
import { App } from 'octokit';

const app = new App({ appId, privateKey });

for await (const { octokit, repository } of app.eachRepository.iterator()) {
  // https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event
  await octokit.rest.repos.createDispatchEvent({
    owner: repository.owner.login,
    repo: repository.name,
    event_type: 'my_event',
    client_payload: {
      foo: 'bar',
    },
  });
  console.log('Event dispatched for %s', repository.full_name);
}
```

Example: Get an `octokit` instance authenticated as an installation

```js
const octokit = await app.getInstallationOctokit(123);
```

Learn more about [apps](https://docs.github.com/apps).

### Webhooks

**Standalone module**: [`@octokit/webhooks`](https://github.com/octokit/webhooks.js/#readme)

When installing an app, events that the app registration requests will be sent as requests to the webhook URL set in the app's registration.

Webhook event requests are signed using the webhook secret, which is also part of the app's registration. You must verify that secret before handling the request payload.

The `app.webhooks.*` APIs provide methods to receiving, verifying, and handling webhook events.

Example: create a comment on new issues

```js
import { createServer } from 'node:http';
import { App, createNodeMiddleware } from 'octokit';

const app = new App({
  appId,
  privateKey,
  webhooks: { secret },
});

app.webhooks.on('issues.opened', ({ octokit, payload }) => {
  return octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: 'Hello, World!',
  });
});

// Your app can now receive webhook events at `/api/github/webhooks`
createServer(createNodeMiddleware(app)).listen(3000);
```

For serverless environments, you can explicitly verify and receive an event

```js
await app.webhooks.verifyAndReceive({
  id: request.headers['x-github-delivery'],
  name: request.headers['x-github-event'],
  signature: request.headers['x-hub-signature-256'],
  payload: request.body,
});
```

Learn more about [GitHub webhooks](https://docs.github.com/webhooks).

### OAuth

**Standalone module:** [`@octokit/oauth-app`](https://github.com/octokit/oauth-app.js/#readme)

Both OAuth Apps and GitHub Apps support authenticating GitHub users using OAuth, see [Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/authorizing-oauth-apps) and [Identifying and authorizing users for GitHub Apps](https://docs.github.com/en/developers/apps/identifying-and-authorizing-users-for-github-apps).

There are some differences:

- Only OAuth Apps support scopes. GitHub apps have permissions, and access is granted via installations of the app on repositories.
- Only GitHub Apps support expiring user tokens
- Only GitHub Apps support creating a scoped token to reduce the permissions and repository access

`App` is for GitHub Apps. If you need OAuth App-specific functionality, use [`OAuthApp` instead](https://github.com/octokit/oauth-app.js/).

Example: Watch a repository when a user logs in using the OAuth web flow

```js
import { createServer } from 'node:http';
import { App, createNodeMiddleware } from 'octokit';

const app = new App({
  oauth: { clientId, clientSecret },
});

app.oauth.on('token.created', async ({ token, octokit }) => {
  await octokit.rest.activity.setRepoSubscription({
    owner: 'octocat',
    repo: 'hello-world',
    subscribed: true,
  });
});

// Your app can receive the OAuth redirect at /api/github/oauth/callback
// Users can initiate the OAuth web flow by opening /api/github/oauth/login
createServer(createNodeMiddleware(app)).listen(3000);
```

For serverless environments, you can explicitly exchange the `code` from the OAuth web flow redirect for an access token.
`app.oauth.createToken()` returns an authentication object and emits the "token.created" event.

```js
const { token } = await app.oauth.createToken({
  code: request.query.code,
});
```

Example: create a token using the device flow.

```js
const { token } = await app.oauth.createToken({
  async onVerification(verification) {
    await sendMessageToUser(
      request.body.phoneNumber,
      `Your code is ${verification.user_code}. Enter it at ${verification.verification_uri}`,
    );
  },
});
```

Example: Create an OAuth App Server with default scopes

```js
import { createServer } from 'node:http';
import { OAuthApp, createNodeMiddleware } from 'octokit';

const app = new OAuthApp({
  clientId,
  clientSecret,
  defaultScopes: ['repo', 'gist'],
});

app.oauth.on('token', async ({ token, octokit }) => {
  await octokit.rest.gists.create({
    description: 'I created this gist using Octokit!',
    public: true,
    files: {
      'example.js': `/* some code here */`,
    },
  });
});

// Your app can receive the OAuth redirect at /api/github/oauth/callback
// Users can initiate the OAuth web flow by opening /api/oauth/login
createServer(createNodeMiddleware(app)).listen(3000);
```

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
