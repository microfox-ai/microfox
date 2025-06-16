## Function: `createKlingaiSDK`

A factory function that creates and initializes a new instance of the `KlingaiSDK` class. It serves as a convenient entry point for using the SDK, abstracting the direct instantiation of the class.

**Purpose:**
To provide a simple and clear method for creating a configured instance of the Klingai SDK, ready to interact with the API.

**Parameters:**

- **`options`** (object, required): An object containing the configuration for the SDK instance.
  - **`apiKey`** (string, optional): Your Klingai API key. If this is not provided, the SDK will automatically attempt to use the `KLINGAI_API_KEY` environment variable. If no key is found in either place, the constructor will throw an error.

**Return Value:**

- **`KlingaiSDK`**: A fully initialized instance of the `KlingaiSDK` class, which can be used to make calls to the various API methods.

**Examples:**

```typescript
// Example 1: Creating an SDK instance by providing the API key directly
import { createKlingaiSDK } from '@microfox/klingai';

const klingai = createKlingaiSDK({
  apiKey: 'your-klingai-api-key'
});

// Example 2: Creating an SDK instance using an environment variable
// Ensure the KLINGAI_API_KEY environment variable is set
// export KLINGAI_API_KEY=your-klingai-api-key

import { createKlingaiSDK } from '@microfox/klingai';

const klingaiWithEnv = createKlingaiSDK({});
```