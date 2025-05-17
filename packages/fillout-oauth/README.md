# Microfox Fillout OAuth

TypeScript OAuth package for Fillout

## Installation

```bash
npm install @microfox/fillout-oauth @microfox/fillout-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `FILLOUT_CLIENT_ID`: Your Fillout OAuth client ID. ** (Required)**
- `FILLOUT_CLIENT_SECRET`: Your Fillout OAuth client secret. ** (Required)**
- `FILLOUT_REDIRECT_URI`: Your configured redirect URI. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**FilloutOAuthSdk** (Constructor)](./docs/FilloutOAuthSdk.md): Initializes the client.
- [getAuthorizationUrl](./docs/getAuthorizationUrl.md)
- [getAccessToken](./docs/getAccessToken.md)
- [invalidateToken](./docs/invalidateToken.md)
- [checkAccessToken](./docs/checkAccessToken.md)
- [setBaseUrl](./docs/setBaseUrl.md)
- [createFilloutOAuth](./docs/createFilloutOAuth.md)

