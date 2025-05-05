# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/NotionSdk.ts | 5569 |
| src/types/index.ts | 827 |
| src/schemas/index.ts | 5294 |
| src/index.ts | 71 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use the Notion SDK, you need to obtain an API key from Notion. Here's how to set it up:

1. Go to https://www.notion.so/my-integrations and create a new integration.
2. Choose the appropriate capabilities for your integration (read, update, insert, etc.).
3. Once created, you'll receive an "Internal Integration Token" which serves as your API key.
4. Store this API key securely and never expose it in client-side code.

To use the SDK:

1. Install the package: `npm install @microfox/notion`
2. Import the SDK in your TypeScript/JavaScript file:
   ```typescript
   import { createNotionSDK } from '@microfox/notion';
   ```
3. Create an instance of the SDK:
   ```typescript
   const notion = createNotionSDK({
     apiKey: 'your-api-key-here'
   });
   ```
4. You can now use the SDK to interact with the Notion API:
   ```typescript
   const page = await notion.pages.retrieve({ page_id: 'your-page-id' });
   ```

Remember to handle errors appropriately and never share your API key publicly.



---
**Total Usage:** Total Bytes: 11761 | Tokens: 419174 | Cost: $1.6937