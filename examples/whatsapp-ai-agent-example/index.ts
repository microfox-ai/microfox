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

// Example of processing a message
async function handleIncomingMessage(message: { from: string; text?: { body: string } }) {
  try {
    // Process the message with the AI agent
    await agent.processMessage(message);
  } catch (error) {
    console.error('Error handling message:', error);
  }
}

// Example of improving agent capabilities
async function improveAgentCapability() {
  try {
    const result = await agent.improveCapability(
      'codeGeneration',
      'Current implementation uses simple keyword matching',
      'Implement more sophisticated code generation using AI'
    );
    console.log('Improvement result:', result);
  } catch (error) {
    console.error('Error improving capability:', error);
  }
}

// Example usage
const exampleMessage = {
  from: '+1234567890',
  text: {
    body: 'Create a function that calculates the Fibonacci sequence'
  }
};

// Process the example message
handleIncomingMessage(exampleMessage);

// Improve agent capabilities
improveAgentCapability(); 