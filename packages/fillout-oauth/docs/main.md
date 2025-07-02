# Microfox Fillout OAuth

TypeScript OAuth package for Fillout

## Installation

```bash
npm install @microfox/fillout-oauth @microfox/fillout-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `FILLOUT_CLIENT_ID`: The client ID for your Fillout application. ** (Required)**
- `FILLOUT_CLIENT_SECRET`: The client secret for your Fillout application. ** (Required)**
- `FILLOUT_REDIRECT_URI`: The redirect URI for your Fillout application. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**FilloutOAuthSdk** (Constructor)](./docs/FilloutOAuthSdk.md): Initializes the client.
- [getAuthorizationUrl](./docs/getAuthorizationUrl.md)
- [getAccessToken](./docs/getAccessToken.md)
- [validateAccessToken](./docs/validateAccessToken.md)

