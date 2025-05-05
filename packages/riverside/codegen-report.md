# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/RiversideSdk.ts | 3207 |
| src/types/index.ts | 1350 |
| src/schemas/index.ts | 3571 |
| src/index.ts | 77 |

## Setup Information
- **Auth Type**: apikey


- **Setup Info**: To use the Riverside SDK, you need to obtain an API key by contacting your Riverside customer success member. Once you have the API key, you can initialize the SDK like this:

```typescript
import { createRiversideSDK } from '@microfox/riverside';

const riversideSDK = createRiversideSDK({
  apiKey: 'YOUR_API_KEY_HERE'
});
```

Make sure to keep your API key secure and never expose it in client-side code.

The SDK uses the native `fetch` API available in Node.js 20+. Ensure you're using a compatible Node.js version.

Rate Limiting:
- The SDK respects rate limits for each endpoint.
- Implement retry mechanisms with exponential backoff in your application logic if needed.

Error Handling:
- The SDK throws custom errors for various scenarios (network issues, API errors, etc.).
- Always wrap SDK calls in try-catch blocks to handle potential errors.

Pagination:
- For endpoints that support pagination, the SDK provides helper methods to iterate through pages.

File Downloads:
- The SDK provides methods to download media files and transcriptions.
- Handle the returned streams appropriately in your application.

API Versioning:
- The SDK uses different API versions (v1 and v2) for different endpoints as per the Riverside API.
- This is handled internally by the SDK, but be aware of potential differences in response structures.



---
**Total Usage:** Total Bytes: 8205 | Tokens: 419693 | Cost: $1.6824