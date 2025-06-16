## Constructor: `KlingaiSDK`

The `KlingaiSDK` constructor initializes a new instance of the SDK, which is the primary interface for interacting with the Klingai API. It requires an API key for authentication, which can be provided directly or through an environment variable.

**Purpose:**
To create and configure an instance of the Klingai SDK, enabling access to its various methods for video and image manipulation.

**Parameters:**

- **`options`** (object, required): An object containing the configuration for the SDK instance.
  - **`apiKey`** (string, optional): Your Klingai API key. If not provided, the SDK will attempt to read it from the `KLINGAI_API_KEY` environment variable. An error will be thrown if the API key is not found in either the options or the environment.

**Examples:**

The recommended way to create an instance of the SDK is by using the exported `createKlingaiSDK` factory function.

```typescript
// Example 1: Initializing the SDK with an API key
import { createKlingaiSDK } from '@microfox/klingai';

const klingai = createKlingaiSDK({
  apiKey: 'your-klingai-api-key'
});

// Example 2: Initializing the SDK using an environment variable
// Make sure to set the KLINGAI_API_KEY environment variable beforehand
// export KLINGAI_API_KEY=your-klingai-api-key

import { createKlingaiSDK } from '@microfox/klingai';

const klingai = createKlingaiSDK({});
```