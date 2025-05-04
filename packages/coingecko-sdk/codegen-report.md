# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/CoinGeckoSdk.ts | 2586 |
| src/types/index.ts | 924 |
| src/schemas/index.ts | 5424 |
| src/index.ts | 91 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use the CoinGecko Pro API SDK:

1. Sign up for a CoinGecko Pro API account at https://www.coingecko.com/en/api/pricing
2. Obtain your API key from the CoinGecko Pro dashboard
3. Install the SDK: `npm install @microfox/coingecko-sdk`
4. Import and initialize the SDK in your project:

```typescript
import { createCoinGeckoSDK } from '@microfox/coingecko-sdk';

const sdk = createCoinGeckoSDK({
  apiKey: 'YOUR_API_KEY_HERE',
});
```

5. Use the SDK methods to interact with the CoinGecko Pro API

Note: It's recommended to use environment variables to store your API key securely.



---
**Total Usage:** Total Bytes: 9025 | Tokens: 353587 | Cost: $1.3599