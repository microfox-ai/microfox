## Constructor: `FilloutSDK`

Initializes a new instance of the FilloutSDK.

**Purpose:**
The constructor initializes the FilloutSDK, which allows you to interact with the Fillout API.

**Parameters:**

* `options`: An optional object of type `FilloutSDKOptions`.
    * `apiKey`:  A string representing the Fillout API key. This parameter is required if the `FILLOUT_API_KEY` environment variable is not set.

**Return Value:**

* An instance of the `FilloutSDK` class.

**Examples:**

```typescript
// Example 1: Initialization with API key
const filloutSDK = new FilloutSDK({ apiKey: 'YOUR_API_KEY' });

// Example 2: Initialization with environment variable
const filloutSDK = new FilloutSDK(); // FILLOUT_API_KEY must be set
```