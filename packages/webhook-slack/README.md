# @microfox/webhook-slack

A powerful TypeScript package for handling Slack webhooks and events in AWS Lambda environments. Built on top of Slack Bolt framework, this SDK provides a simplified interface for receiving and processing Slack events, commands, actions, and messages.

## Features

- 🔐 **Secure webhook verification** with automatic signature validation
- 📨 **Message handling** with pattern matching support
- ⚡ **Slash command processing** with built-in acknowledgment
- 🎯 **Interactive component handling** (buttons, select menus, etc.)
- 📋 **Dialog submission processing**
- ⌨️ **Shortcut handling** for global and message shortcuts
- 🎪 **Custom event processing** for any Slack event type
- 🚀 **AWS Lambda optimized** with built-in receiver
- 🛡️ **TypeScript support** with full type safety
- ⚠️ **Custom error handling** with specific error types

## Installation

```bash
npm install @microfox/webhook-slack
```

## Prerequisites

Before using this package, you'll need:

1. A Slack app with appropriate permissions
2. Bot token (`xoxb-...`) from your Slack app
3. Signing secret from your Slack app
4. AWS Lambda environment (for webhook handling)

## Quick Start

```typescript
import { SlackWebhookSdk } from '@microfox/webhook-slack';

// Initialize the SDK
const slackSdk = new SlackWebhookSdk(
  process.env.SLACK_SIGNING_SECRET,
  process.env.SLACK_BOT_TOKEN,
);

// Handle messages
slackSdk.onMessage(async ({ message, say }) => {
  await say(`Hello! You said: ${message.text}`);
});

// Handle slash commands
slackSdk.onCommand('/hello', async ({ command, ack, respond }) => {
  await ack();
  await respond(`Hello ${command.user_name}!`);
});

// AWS Lambda handler
export const handler = async (event, context, callback) => {
  return await slackSdk.handleEvent(event, context, callback);
};
```

## Environment Variables

Set these environment variables in your Lambda function:

```bash
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_BOT_TOKEN=xoxb-your-bot-token
```

## API Reference

### Constructor

```typescript
new SlackWebhookSdk(secret?: string, botToken?: string)
```

- `secret`: Slack signing secret (defaults to `SLACK_SIGNING_SECRET` env var)
- `botToken`: Slack bot token (defaults to `SLACK_BOT_TOKEN` env var)

### Message Handling

#### `onMessage(callback)`

Listen to all messages in channels where your bot is present.

```typescript
slackSdk.onMessage(async ({ message, say, context, body }) => {
  console.log('Received message:', message.text);
  await say('Message received!');
});
```

#### `onPatternedMessage(pattern, callback)`

Listen to messages matching a specific pattern.

```typescript
// String pattern
slackSdk.onPatternedMessage('hello', async ({ message, say }) => {
  await say('Hello there!');
});

// Regex pattern
slackSdk.onPatternedMessage(/^help/i, async ({ message, say }) => {
  await say('How can I help you?');
});
```

### Slash Commands

#### `onCommand(command, callback)`

Handle slash commands.

```typescript
slackSdk.onCommand('/weather', async ({ command, ack, respond }) => {
  await ack(); // Acknowledge the command

  const location = command.text;
  await respond({
    text: `Weather for ${location}: Sunny, 72°F`,
    response_type: 'in_channel', // or 'ephemeral'
  });
});
```

### Interactive Components

#### `onAction(actionId, callback)`

Handle button clicks, select menu selections, and other interactive components.

```typescript
slackSdk.onAction('approve_button', async ({ action, ack, respond }) => {
  await ack();
  await respond('Request approved!');
});
```

#### `onDialogSubmission(dialogCallbackId, callback)`

Handle dialog form submissions.

```typescript
slackSdk.onDialogSubmission('feedback_dialog', async ({ dialog, ack }) => {
  await ack();
  // Process dialog submission
  console.log('Dialog data:', dialog.submission);
});
```

### Shortcuts

#### `onShortcut(shortcutId, callback)`

Handle global shortcuts and message shortcuts.

```typescript
slackSdk.onShortcut('create_task', async ({ shortcut, ack, respond }) => {
  await ack();
  // Handle shortcut
});
```

### Custom Events

#### `onEvent(eventType, callback)`

Handle any Slack event type.

```typescript
slackSdk.onEvent('app_mention', async ({ event, context, body }) => {
  console.log('Bot was mentioned:', event);
});

slackSdk.onEvent('reaction_added', async ({ event }) => {
  console.log('Reaction added:', event.reaction);
});
```

### Lambda Handler

#### `handleEvent(event, context, callback)`

Main method to handle incoming AWS Lambda events.

```typescript
export const handler = async (event, context, callback) => {
  try {
    return await slackSdk.handleEvent(event, context, callback);
  } catch (error) {
    console.error('Error handling Slack event:', error);
    throw error;
  }
};
```

## Error Handling

The SDK provides custom error types for better error handling:

```typescript
import {
  WebhookVerificationError,
  WebhookParseError,
} from '@microfox/webhook-slack';

try {
  await slackSdk.handleEvent(event, context, callback);
} catch (error) {
  if (error instanceof WebhookVerificationError) {
    console.error('Webhook signature verification failed:', error.message);
  } else if (error instanceof WebhookParseError) {
    console.error('Failed to parse webhook payload:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Advanced Usage

### Multiple Event Handlers

You can register multiple handlers for the same event type:

```typescript
// Both handlers will be called
slackSdk.onMessage(async ({ message, say }) => {
  // Log all messages
  console.log('Message logged:', message.text);
});

slackSdk.onMessage(async ({ message, say }) => {
  // Auto-respond to questions
  if (message.text?.includes('?')) {
    await say('I see you have a question!');
  }
});
```

### Context and Metadata

Access additional context and metadata in your handlers:

```typescript
slackSdk.onMessage(async ({ message, context, body }) => {
  console.log('Team ID:', context.teamId);
  console.log('User ID:', context.userId);
  console.log('Channel ID:', message.channel);
  console.log('Full event body:', body);
});
```

### Rich Message Formatting

Send rich messages with blocks and attachments:

```typescript
slackSdk.onCommand('/status', async ({ ack, respond }) => {
  await ack();

  await respond({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*System Status*\n:white_check_mark: All systems operational',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Refresh' },
            action_id: 'refresh_status',
          },
        ],
      },
    ],
  });
});
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

This package is part of the Microfox AI project. See the main repository for license information.

## Support

- 📖 [Documentation](https://github.com/microfox-ai/microfox)
- 🐛 [Issue Tracker](https://github.com/microfox-ai/microfox/issues)
- 💬 [Discussions](https://github.com/microfox-ai/microfox/discussions)

## Related Packages

- `@slack/bolt` - The underlying Slack Bolt framework
- `@microfox/core` - Core Microfox utilities
