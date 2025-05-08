## Constructor: `createRiversideSDK`

Initializes a new instance of the RiversideSDK.

**Purpose:**
Creates a new instance of the RiversideSDK, which allows you to interact with the Riverside.fm API.

**Parameters:**

- `options`: object - An object containing the SDK options.
  - `apiKey`: string (required) - Your Riverside.fm API key.

**Return Value:**

- `RiversideSDK` - An instance of the RiversideSDK.

**Examples:**

```typescript
// Example: Creating a new RiversideSDK instance
const riversideSDK = createRiversideSDK({
  apiKey: process.env.RIVERSIDE_API_KEY
});
```