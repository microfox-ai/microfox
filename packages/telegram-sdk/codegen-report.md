# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/TelegramSdk.ts | 2292 |
| src/types/index.ts | 841 |
| src/schemas/index.ts | 1687 |
| src/index.ts | 75 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use the Telegram SDK, you need to obtain an API key from Telegram. Follow these steps:

1. Create a Telegram account if you don't have one.
2. Visit https://my.telegram.org/auth and log in.
3. Go to "API development tools" and fill out the form to create a new application.
4. Once created, you'll receive an `api_id` and `api_hash`. These will be used as your API key.

To use the SDK, you'll need to set the following environment variables:
- TELEGRAM_API_ID: Your API ID
- TELEGRAM_API_HASH: Your API Hash

Example usage:

```typescript
import { createTelegramSDK } from '@microfox/telegram-sdk';

const sdk = createTelegramSDK({
  apiId: process.env.TELEGRAM_API_ID,
  apiHash: process.env.TELEGRAM_API_HASH,
});

// Now you can use the SDK methods
const result = await sdk.account.acceptAuthorization({
  // ... parameters
});
```

Note: This SDK uses API key authentication. Make sure to keep your API credentials secure and never share them publicly.



---
**Total Usage:** Total Bytes: 4895 | Tokens: 426308 | Cost: $1.6805