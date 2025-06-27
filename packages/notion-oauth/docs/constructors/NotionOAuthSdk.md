## Constructor: `NotionOAuthSdk`

Initializes a new instance of the `NotionOAuthSdk` client. This client is used to handle the Notion OAuth 2.0 flow, including generating authorization URLs and exchanging authorization codes for access tokens.

**Purpose:**
The constructor configures the SDK with the necessary credentials for your public Notion integration. These credentials are required for all subsequent interactions with the Notion OAuth API.

**Parameters:**

- `config`: `NotionOAuthConfig` (object) - Required. A configuration object containing your Notion integration's credentials.
  - `clientId`: `string` - Required. The Client ID for your public Notion integration. This can be found in your integration settings on the Notion website. It can also be provided via the `NOTION_OAUTH_CLIENT_ID` environment variable.
  - `clientSecret`: `string` - Required. The Client Secret for your public Notion integration. This can be found in your integration settings. It can also be provided via the `NOTION_OAUTH_CLIENT_SECRET` environment variable.
  - `redirectUri`: `string` - Required. The Redirect URI that you have configured in your Notion integration's "OAuth Domain & URIs" settings. This is where Notion will send the user back to after they authorize your application.

**Examples:**

```typescript
// Example: Initializing the SDK with credentials
import { NotionOAuthSdk } from '@microfox/notion-oauth';

const notionOAuth = new NotionOAuthSdk({
  clientId: process.env.NOTION_OAUTH_CLIENT_ID!,
  clientSecret: process.env.NOTION_OAUTH_CLIENT_SECRET!,
  redirectUri: 'https://your-app.com/oauth/callback'
});
```