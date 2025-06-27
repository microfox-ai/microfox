# Microfox X SDK

A lightweight, type-safe SDK for interacting with the X (Twitter) API v2

## Installation

```bash
npm install @microfox/twitter
```

## Environment Variables

The following environment variables are used by this SDK:

- `X_API_KEY`: Your X API key. (Required)
- `X_API_SECRET`: Your X API secret key. (Required)
- `X_ACCESS_TOKEN`: Your X access token. (Required)
- `X_ACCESS_SECRET`: Your X access token secret. (Required)

## Additional Information

Use the `createXSDK` constructor to create a new X client.

The SDK supports both v2 API endpoints for tweets and users.

Media uploads are supported through the v1.1 API endpoint.

## API Reference

For detailed documentation on the constructor and all available functions, see:

- [createXSDK](./docs/createXSDK.md)
- [create](./docs/create.md)
- [get](./docs/get.md)
- [getMultiple](./docs/getMultiple.md)
- [delete](./docs/delete.md)
- [getByUsername](./docs/getByUsername.md)
- [getByUsernames](./docs/getByUsernames.md)
- [getById](./docs/getById.md)
- [getByIds](./docs/getByIds.md)
- [getMe](./docs/getMe.md)
- [upload](./docs/upload.md)
- [generateOAuthHeader](./docs/generateOAuthHeader.md)
