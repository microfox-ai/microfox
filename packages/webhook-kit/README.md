# @microfox/webhook-kit

A central webhook kit for building unified webhook integrations in Microfox. It provides a common interface for various webhook providers through a pluggable adapter system.

## Features

- **Unified Interface**: A single `WebhookKit` class to manage multiple webhook providers.
- **Pluggable Adapters**: Easily add support for new providers (e.g., GitHub, Slack) using pre-built webhook packages.
- **Simplified Verification**: Common `sign` and `verify` methods exposed through a base `Webhook` class from `@microfox/webhook-core`.
- **Dynamic Routing**: Designed to work seamlessly with dynamic API routes (e.g., `api/webhooks/[provider]`).

## Installation

This package is designed to be used with provider-specific webhook packages. Install the kit along with the packages for the providers you need:

```bash
npm install @microfox/webhook-kit @microfox/webhook-octokit @microfox/webhook-slack
# or
yarn add @microfox/webhook-kit @microfox/webhook-octokit @microfox/webhook-slack
# or
pnpm add @microfox/webhook-kit @microfox/webhook-octokit @microfox/webhook-slack
```

## Prerequisites

Ensure you have the necessary environment variables for the webhook providers you are using. For example:

- `GITHUB_WEBHOOK_SECRET`: Your webhook secret for GitHub.
- `SLACK_SIGNING_SECRET`: Your signing secret for Slack.
- `SLACK_BOT_TOKEN`: Your bot token for Slack.

## Usage

Here's how to set up and use `WebhookKit` in a Next.js application.

### 1. Initialize WebhookKit and Adapters

It's best practice to initialize `WebhookKit` in a central file so it can be reused across your application.

`// lib/webhooks.ts`

```typescript
import { WebhookKit } from '@microfox/webhook-kit';
import { OctokitWebhook } from '@microfox/webhook-octokit';
import { SlackWebhookSdk } from '@microfox/webhook-slack';

// Initialize the Octokit (GitHub) webhook adapter
const octokitWebhook = new OctokitWebhook({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

// Attach event listeners to the Octokit adapter
octokitWebhook.on('push', (event: any) => {
  console.log('Received a GitHub push event:', event.payload);
  // Add your business logic here
});

octokitWebhook.onAny((event: any) => {
  console.log(`Received a GitHub ${event.name} event`);
});

// Initialize the Slack webhook adapter
const slackWebhook = new SlackWebhookSdk(
  process.env.SLACK_SIGNING_SECRET!,
  process.env.SLACK_BOT_TOKEN!,
);

// Attach event listeners for Slack
slackWebhook.onEvent('app_mention', async ({ event }) => {
  console.log('Received an app_mention event:', event);
  // Add your logic here
});

// Create a new WebhookKit instance
export const webhookKit = new WebhookKit();

// Add the configured webhooks to the kit
webhookKit.addWebhook('github', octokitWebhook);
webhookKit.addWebhook('slack', slackWebhook);
```

### 2. Create a Dynamic API Route

Create a dynamic API route to handle incoming webhooks from different providers. The provider name from the URL will be used to look up the correct webhook adapter in the `WebhookKit`.

`// app/api/webhooks/[provider]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { webhookKit } from '@/lib/webhooks'; // Adjust the import path as needed
import { WebhookVerificationError } from '@microfox/webhook-kit';

export async function POST(
  req: NextRequest,
  { params }: { params: { provider: string } },
) {
  const provider = params.provider;

  if (!provider) {
    return NextResponse.json(
      { error: 'Provider is required' },
      { status: 400 },
    );
  }

  try {
    // Construct a WebhookRequest object from the NextRequest
    const request = {
      headers: req.headers,
      body: await req.text(),
    };

    // Use the webhookKit to receive and process the webhook
    await webhookKit.receive(provider, request);

    return NextResponse.json(
      { message: 'Webhook received successfully' },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(`Error handling webhook for ${provider}:`, error);

    const errorMessage =
      error instanceof WebhookVerificationError
        ? `Webhook verification failed: ${error.message}`
        : 'An internal error occurred.';

    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
```

## API Reference

### `WebhookKit`

The main class for managing multiple webhook providers.

- **`constructor()`**: Creates a new `WebhookKit` instance.
- **`addWebhook(name: string, webhook: Webhook<any>)`**: Registers a webhook provider instance with a given name.
- **`getWebhook(name: string): Webhook<any> | undefined`**: Retrieves a registered webhook provider by name.
- **`async receive(name: string, request: WebhookRequest): Promise<void>`**: Receives and processes an incoming webhook request for the specified provider.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/microfox-ai/microfox)
- 🐛 [Issue Tracker](https://github.com/microfox-ai/microfox/issues)
- 💬 [Discussions](https://github.com/microfox-ai/microfox/discussions)

## Related Packages

- `@microfox/webhook-core`: The core package providing base webhook functionality.
- `@microfox/webhook-octokit`: Webhook adapter for GitHub.
- `@microfox/webhook-slack`: Webhook adapter for Slack.
