## Constructor: `new ApifySdk(options)`

Initializes a new instance of the Apify SDK, which provides an interface to interact with the Apify API. Authentication is handled via an API token.

**Purpose:**
The constructor sets up the SDK with the necessary credentials to make authenticated requests to the Apify API. It will throw an error if the API token is not provided either directly or through the environment variable.

**Parameters:**
- `options` (object): An object containing the configuration for the SDK.
  - `apiToken` (string, optional): Your personal API token for accessing the Apify API. This token is used to authenticate all requests made by the SDK. If not provided, the SDK will attempt to read it from the `APIFY_API_TOKEN` environment variable. You can find your token in your Apify account settings under the 'Integrations' tab.

**Throws:**
- `Error`: Throws an error if the `apiToken` is not provided in the `options` object and the `APIFY_API_TOKEN` environment variable is not set.

**Examples:**

```typescript
// Example 1: Initializing the SDK with an API token
import { ApifySdk } from '@microfox/apify';

const apify = new ApifySdk({
  apiToken: 'your-api-token-here'
});

// Example 2: Initializing the SDK using the environment variable
// Make sure to set the APIFY_API_TOKEN environment variable before running the code
// export APIFY_API_TOKEN='your-api-token-here'

import { ApifySdk } from '@microfox/apify';

const apify = new ApifySdk({});
```