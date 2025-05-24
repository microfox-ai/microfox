# octokit.js

> The all-batteries-included GitHub SDK for Browsers, Node.js, and Deno.

## Usage

Install with <code>npm/pnpm install octokit</code>, or <code>yarn add octokit</code>

```js
import { Octokit, App } from 'octokit';
```

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
// assumes that installationId belongs to @octocat, otherwise the request will fail
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
const octokit = await app.getInstallationOctokit(
  process.env.GITHUB_INSTALLATION_ID,
);
await octokit.rest.issues.create({
  owner: 'octocat',
  repo: 'hello-world',
  title: 'Hello world from ' + slug,
});
```

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

#### `octokit.rest` endpoint methods

Every GitHub REST API endpoint has an associated `octokit.rest` endpoint method for better code readability and developer convenience. See [`@octokit/plugin-rest-endpoint-methods`](https://github.com/octokit/plugin-rest-endpoint-methods.js/#readme) for full details.

#### `octokit.request()`

You can call the GitHub REST API directly using `octokit.request`. The `request` API matches GitHub's REST API documentation 1:1 so anything you see there, you can call using `request`. See [`@octokit/request`](https://github.com/octokit/request.js#readme) for all the details.

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
