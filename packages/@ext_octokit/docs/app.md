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
