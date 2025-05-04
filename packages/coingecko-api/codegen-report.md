# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/CoinGeckoSdk.ts | 2236 |
| src/types/index.ts | 1877 |
| src/schemas/index.ts | 2170 |
| src/index.ts | 77 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use this SDK, you need to obtain a CoinGecko Pro API key. Follow these steps:

1. Sign up for a CoinGecko Pro account at https://www.coingecko.com/en/api/pricing
2. Once you have an account, navigate to your dashboard and find your API key
3. Store your API key securely and never share it publicly

To use the SDK, you'll need to provide your API key when creating an instance of the CoinGeckoSdk:

```typescript
import { createCoinGeckoSDK } from '@microfox/coingecko-api';

const sdk = createCoinGeckoSDK('YOUR_API_KEY');
```

Make sure to replace 'YOUR_API_KEY' with your actual CoinGecko Pro API key.

Note: This SDK uses the CoinGecko Pro API, which is a paid service. Each API request consumes one credit. Monitor your usage via the CoinGecko developer dashboard to avoid exceeding your plan limits.



---
**Total Usage:** Total Bytes: 6360 | Tokens: 351140 | Cost: $1.3436