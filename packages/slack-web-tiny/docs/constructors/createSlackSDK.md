## Constructor: `createSlackSDK`

Creates a new instance of the Slack Web Tiny SDK.

**Purpose:**
Initializes a new client for interacting with the Slack API.

**Parameters:**

- `config`: object<SlackSDKConfig>
  - An object containing the configuration options for the SDK.

**Return Value:**

- `SlackSDK`: An instance of the Slack Web Tiny SDK.

**SlackSDKConfig Type:**

```typescript
export interface SlackSDKConfig {
  botToken: string; // Bot token for authentication
  authType: 'header' | 'query'; // Authentication type ('header' or 'query')
  baseUrl?: string; // Base URL for the Slack API (optional, defaults to 'https://slack.com/api')
}
```

**Examples:**

```typescript
// Example 1: Minimal usage with header authentication
const sdk1 = createSlackSDK({
  botToken: process.env.SLACK_BOT_TOKEN,
});

// Example 2: Query authentication with custom base URL
const sdk2 = createSlackSDK({
  botToken: process.env.SLACK_BOT_TOKEN,
  authType: 'query',
  baseUrl: 'https://custom.slack.domain/api',
});
```
