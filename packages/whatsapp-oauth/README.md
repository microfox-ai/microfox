# Whatsapp Oauth

<!-- Add your project description here -->
A TypeScript SDK for Whatsapp Oauth.

## Installation

\`\`\`bash
npm install @microfox/whatsapp-oauth
\`\`\`

## Quick Start

\`\`\`typescript
import { WhatsappOauthSdk } from '@microfox/whatsapp-oauth';

// Initialize the SDK
const sdk = new WhatsappOauthSdk({
  apiKey: 'your-api-key',
  // Add other config options
});

// Example usage
const result = await sdk.hello('World');
console.log(result.data);
\`\`\`

## Configuration

\`\`\`typescript
interface WhatsappOauthSdkConfig {
  apiKey: string;        // Required: Your API key
  baseUrl?: string;      // Optional: Custom base URL
  name?: string;         // Optional: SDK instance name
  version?: string;      // Optional: API version
}
\`\`\`

## Methods

### hello(name: string)

Example method - replace with your own API methods.

\`\`\`typescript
const result = await sdk.hello('World');
// Returns: { data: "Hello, World!", success: true, status: 200, message: "Success" }
\`\`\`

<!-- 
## TODO: Add your API documentation here

### getData(id: string)
\`\`\`typescript
const data = await sdk.getData('123');
\`\`\`

### createItem(item: object)
\`\`\`typescript
const result = await sdk.createItem({ name: 'Example' });
\`\`\`
-->

## Development

\`\`\`bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint
\`\`\`

## License

MIT
