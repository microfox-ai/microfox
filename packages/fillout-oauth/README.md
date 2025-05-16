# Microfox Fillout OAuth

TypeScript OAuth package for Fillout

## Installation

```bash
npm install @microfox/fillout-oauth @microfox/fillout-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `FILLOUT_CLIENT_ID`: Your Fillout application client ID. ** (Required)**
- `FILLOUT_CLIENT_SECRET`: Your Fillout application client secret. ** (Required)**
- `FILLOUT_REDIRECT_URI`: Your registered redirect URI. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**FilloutOAuthSdk** (Constructor)](./docs/FilloutOAuthSdk.md): Initializes the client.
- [getAuthorizationUrl](./docs/getAuthorizationUrl.md)
- [getAccessToken](./docs/getAccessToken.md)
- [validateAuthorizationResponse](./docs/validateAuthorizationResponse.md)
- [isAccessTokenValid](./docs/isAccessTokenValid.md)

