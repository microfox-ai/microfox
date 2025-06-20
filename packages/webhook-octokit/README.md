# @microfox/webhook-octokit

A TypeScript package for receiving and handling GitHub webhooks using Octokit. This package provides a simple and type-safe way to interact with GitHub webhooks in your applications.

## Installation

```bash
npm install @microfox/webhook-octokit
# or
yarn add @microfox/webhook-octokit
# or
pnpm add @microfox/webhook-octokit
```

## Features

- 🔒 Secure webhook signature verification
- 📦 TypeScript support with full type definitions
- 🎯 Event-based webhook handling
- 🔄 Support for all GitHub webhook events
- 🛡️ Built-in security features

## Usage

```typescript
import { OctokitWebhook } from '@microfox/webhook-octokit';

// Initialize the webhook handler with your secret
const webhook = new OctokitWebhook({
  secret: 'your-github-webhook-secret',
});

// Handle specific events
webhook.on('push', event => {
  console.log('Push event received:', event.payload);
});

// Handle multiple events
webhook.on(['issues', 'pull_request'], event => {
  console.log(`${event.name} event received:`, event.payload);
});

// Handle all events
webhook.onAny(event => {
  console.log(`Received ${event.name} event:`, event.payload);
});

// Verify webhook signatures
const isValid = await webhook.verifySignature(payload, signature);
```

## API Reference

### `OctokitWebhook`

The main class for handling GitHub webhooks.

#### Constructor

```typescript
constructor(props: { secret: string })
```

- `secret`: Your GitHub webhook secret used for signature verification

#### Methods

- `sign(payload: string)`: Signs a payload with the webhook secret
- `verifySignature(payload: string, signature: string)`: Verifies a webhook signature
- `on(event: WebhookEvents | WebhookEvents[], handler: Function)`: Registers a handler for specific events
- `onAny(handler: Function)`: Registers a handler for all events

## Requirements

- Node.js >= 20.0.0
- TypeScript >= 5.6.3

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📖 [Documentation](https://github.com/microfox-ai/microfox)
- 🐛 [Issue Tracker](https://github.com/microfox-ai/microfox/issues)
- 💬 [Discussions](https://github.com/microfox-ai/microfox/discussions)

## Related Packages

- `@octokit/webhooks` - The underlying GitHub webhooks framework
- `@microfox/webhook-core` - Core Microfox webhook utilities
