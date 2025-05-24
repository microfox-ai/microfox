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
