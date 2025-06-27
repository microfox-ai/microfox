## Function: `createApifySDK`

A factory function that creates and returns a new instance of the `ApifySdk` class. This is a convenient way to initialize the SDK.

**Purpose:**
To provide a simple and clear entry point for creating an Apify SDK client. It abstracts away the `new` keyword and offers a straightforward setup process.

**Parameters:**
- `options` (object): An object containing the configuration for the SDK.
  - `apiToken` (string, optional): Your personal API token for accessing the Apify API. This token is used to authenticate all requests made by the SDK. If not provided, the SDK will attempt to read it from the `APIFY_API_TOKEN` environment variable. You can find your token in your Apify account settings under the 'Integrations' tab.

**Return Value:**
- `ApifySdk`: Returns a new instance of the `ApifySdk` class, configured with the provided API token.

**Examples:**

```typescript
// Example 1: Creating an SDK instance with an API token
import { createApifySDK } from '@microfox/apify';

const apify = createApifySDK({
  apiToken: 'your-api-token-here'
});

// Example 2: Creating an SDK instance using the environment variable
// Make sure to set the APIFY_API_TOKEN environment variable before running the code
// export APIFY_API_TOKEN='your-api-token-here'

import { createApifySDK } from '@microfox/apify';

const apify = createApifySDK({});
```