# WhatsApp AI Agent Example

This example demonstrates how to use the WhatsApp AI Agent to process messages and generate code through WhatsApp.

## Features

- Process incoming WhatsApp messages
- Generate code based on user requests
- Self-improve agent capabilities
- Handle errors gracefully

## Prerequisites

- Node.js >= 20.0.0
- WhatsApp Business API credentials:
  - Phone Number ID
  - Business Account ID
  - Access Token

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your WhatsApp Business API credentials:
```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_ACCESS_TOKEN=your_access_token
```

3. Build the project:
```bash
npm run build
```

## Usage

1. Start the example:
```bash
npm start
```

2. Send a message to your WhatsApp Business number with a coding task, for example:
```
Create a function that calculates the Fibonacci sequence
```

The agent will:
1. Process your message
2. Generate the requested code
3. Send the code back via WhatsApp
4. Optionally improve its capabilities based on the interaction

## Example Code

```typescript
import { WhatsAppBusinessSDK } from '@microfox/whatsapp-business';
import { WhatsAppAIAgent } from '@microfox/whatsapp-business/src/whatsappAIAgent';

// Initialize the WhatsApp Business SDK
const sdk = new WhatsAppBusinessSDK({
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
  businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!,
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
});

// Initialize the WhatsApp AI Agent
const agent = new WhatsAppAIAgent(sdk);

// Process incoming messages
async function handleIncomingMessage(message: { from: string; text?: { body: string } }) {
  await agent.processMessage(message);
}
```

## Extending the Agent

You can extend the agent's capabilities by:

1. Adding new task types in the `handleTask` method
2. Implementing more sophisticated code generation
3. Adding new self-improvement capabilities
4. Integrating with other AI models or services

## Contributing

Feel free to submit issues and enhancement requests! 