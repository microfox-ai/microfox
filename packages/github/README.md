# GitHub

TypeScript SDK for interacting with the GitHub API.

## Installation

```bash
npm install @microfox/github @microfox/fillout-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `GITHUB_CLIENT_ID`: Your GitHub OAuth app's client ID. ** (Required)**
- `GITHUB_CLIENT_SECRET`: Your GitHub OAuth app's client secret. ** (Required)**
- `GITHUB_REDIRECT_URI`: The redirect URI you specified when creating the OAuth app. ** (Required)**
- `SCOPES`: The scopes for the OAuth app. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**GitHubSDK** (Constructor)](./docs/GitHubSDK.md): Initializes the client.
- [getAuthorizationUrl](./docs/getAuthorizationUrl.md)
- [getAccessToken](./docs/getAccessToken.md)
- [validateAccessToken](./docs/validateAccessToken.md)
- [connectGitHubRepository](./docs/connectGitHubRepository.md)
- [disconnectGitHubRepository](./docs/disconnectGitHubRepository.md)
- [getConnectedRepositories](./docs/getConnectedRepositories.md)

