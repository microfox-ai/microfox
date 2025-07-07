## Constructor: `createSunoSDK`

The `createSunoSDK` function initializes and returns a new instance of the `SunoSDK` client. It configures the client with the necessary API key for authenticating with the Suno API. The API key is essential for all subsequent API calls.

**Purpose:**
The main purpose of this constructor is to create and configure a `SunoSDK` object that is ready to interact with the Suno API. It handles the API key retrieval, which can be provided directly or from an environment variable, and throws an error if the key is not found, ensuring that the SDK instance is always properly authenticated.

**Parameters:**

- `options` (optional, `SunoSDKOptions` object): An optional configuration object.
  - `apiKey` (optional, `string`): Your API key for the Suno API. If you do not provide the key here, the SDK will automatically look for it in the `SUNO_API_KEY` environment variable. An error will be thrown if the API key is not provided in either the options or the environment variable.

**Return Value:**

- (`SunoSDK`): An instance of the `SunoSDK` class, ready to be used for making API calls to generate music or speech.

**Examples:**

```typescript
// Example 1: Initialize using an environment variable
// Make sure to set the SUNO_API_KEY environment variable before running.
// export SUNO_API_KEY='your-api-key-here'

import { createSunoSDK } from '@microfox/suno';

const sunoSDKFromEnv = createSunoSDK();
```

```typescript
// Example 2: Initialize by passing the API key directly
import { createSunoSDK } from '@microfox/suno';

const apiKey = 'your-suno-api-key';
const sunoSDKFromOptions = createSunoSDK({ apiKey });
```

```typescript
// Example 3: Handling initialization errors
// This example will throw an error if the API key is not set in the environment
// or passed directly to the constructor.
import { createSunoSDK } from '@microfox/suno';

try {
  const sunoSDK = createSunoSDK();
} catch (error) {
  console.error(error.message); // "API key is required. Please provide it in the constructor or set the SUNO_API_KEY environment variable."
}
```
