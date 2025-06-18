## Constructor: `createKlingaiSDK`

The `createKlingaiSDK` function is the entry point for initializing the Klingai SDK. It creates and configures an instance of the `KlingaiSDK` class with the required API credentials. The SDK instance handles JWT token generation and management automatically, ensuring seamless and secure communication with the Klingai API.

**Purpose:**
To set up the Klingai SDK with the necessary `accessKey` and `secretKey` for API authentication, returning a ready-to-use SDK client instance.

**Parameters:**

- `options` (object, required): An object containing the configuration for the SDK.
  - `accessKey` (string, required): Your unique access key for the Klingai API. This key is used to identify your application. It can be obtained from your Klingai platform dashboard. It is recommended to store this key securely, for example, in an environment variable like `KLINGAI_ACCESS_KEY`.
  - `secretKey` (string, required): Your secret key for generating JWT tokens. This key is used to sign the authentication tokens sent with each request. It is critical to keep this key confidential. It is recommended to store this key securely, for example, in an environment variable like `KLINGAI_SECRET_KEY`.

**Return Value:**

- (object): An instance of the `KlingaiSDK` class, equipped with all the methods to interact with the Klingai API.

**Examples:**

```typescript
// Example 1: Basic initialization using environment variables
import { createKlingaiSDK } from '@microfox/klingai';

// Ensure you have KLINGAI_ACCESS_KEY and KLINGAI_SECRET_KEY set in your environment
const klingai = createKlingaiSDK({
  accessKey: process.env.KLINGAI_ACCESS_KEY,
  secretKey: process.env.KLINGAI_SECRET_KEY
});

// The 'klingai' instance is now ready to be used.
async function generateVideo() {
  try {
    const response = await klingai.textToVideo({
      prompt: "A futuristic city with flying cars"
    });
    console.log('Task submitted successfully:', response);
  } catch (error) {
    console.error('Error generating video:', error);
  }
}

generateVideo();
```

```typescript
// Example 2: Initialization with hardcoded credentials (not recommended for production)
import { createKlingaiSDK } from '@microfox/klingai';

const klingai = createKlingaiSDK({
  accessKey: '<your_access_key>',
  secretKey: '<your_secret_key>'
});

// You can now use the 'klingai' instance to make API calls.
console.log('Klingai SDK initialized.');
```
