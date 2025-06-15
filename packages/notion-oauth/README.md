# Microfox Notion OAuth

A TypeScript OAuth package for Notion.

## Installation

```bash
npm install @microfox/notion-oauth
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `NOTION_OAUTH_CLIENT_ID`: The Client ID for your public Notion integration. Find this under the 'OAuth Domain & URIs' tab in your integration settings at https://www.notion.so/my-integrations. ** (Required)**
- `NOTION_OAUTH_CLIENT_SECRET`: The Client Secret for your public Notion integration. Find this under the 'Secrets' tab in your integration settings at https://www.notion.so/my-integrations. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**NotionOAuthSdk** (Constructor)](./docs/NotionOAuthSdk.md): Initializes the client.
- [exchangeCodeForToken](./docs/exchangeCodeForToken.md)
- [getAuthUrl](./docs/getAuthUrl.md)
- [validateAccessToken](./docs/validateAccessToken.md)

