# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/StripeSdk.ts | 3737 |
| src/types/index.ts | 7139 |
| src/schemas/index.ts | 5727 |
| src/index.ts | 71 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use the Stripe SDK, you need to obtain an API key from the Stripe Dashboard:

1. Sign up for a Stripe account at https://dashboard.stripe.com/register
2. Once logged in, go to Developers > API keys in the dashboard
3. Use the "Secret key" for authentication. Test mode keys start with `sk_test_`, while live mode keys start with `sk_live_`

To use the SDK:

1. Install the package: `npm install @microfox/stripe`
2. Import and initialize the SDK:

```typescript
import { createStripeSDK } from '@microfox/stripe';

const stripe = createStripeSDK({
  apiKey: 'your_stripe_api_key_here',
  // Optional parameters
  stripeAccount: 'acct_CONNECTED_ACCOUNT_ID', // For connected accounts
  apiVersion: '2025-04-30.basil', // Specify API version
});
```

3. Make API calls using the initialized SDK:

```typescript
const balance = await stripe.getBalance();
console.log(balance);
```

Remember to keep your API key secure and never expose it in client-side code.



---
**Total Usage:** Total Bytes: 16674 | Tokens: 615963 | Cost: $2.2943