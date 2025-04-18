# createBraveSDK

The `createBraveSDK` function is used to initialize and create an instance of the Brave SDK. This function sets up the necessary configuration for making API requests to the Brave Search API.

## Syntax

```typescript
function createBraveSDK(options: BraveSDKOptions): BraveSDK;
```

## Parameters

The function accepts a single parameter:

- `options` (required): An object of type `BraveSDKOptions` containing the configuration options for the SDK.

### BraveSDKOptions

The `BraveSDKOptions` interface has the following properties:

- `apiKey` (required): A string representing your Brave Search API key.
- `baseUrl` (optional): A string representing the base URL for the Brave Search API. If not provided, it defaults to 'https://api.search.brave.com/res/v1'.

## Return Value

The function returns a new instance of the `BraveSDK` class.

## Usage Example

```typescript
import { createBraveSDK } from 'brave-search-sdk';

const braveSDK = createBraveSDK({
  apiKey: 'your-api-key-here',
  // Optional: Specify a custom base URL if needed
  // baseUrl: 'https://custom-api-url.com/v1'
});
```

## Authentication

To use the Brave SDK, you need to obtain an API key from the Brave Search API dashboard. Follow these steps to get your API key:

1. Go to the Brave Search API dashboard (you may need to sign up or log in).
2. Navigate to the API Keys section.
3. Generate a new API key for your project.
4. Copy the generated API key and use it when initializing the SDK.

Make sure to keep your API key secure and never share it publicly.

## Error Handling

If invalid options are provided (e.g., missing API key), the function will throw a `ZodError`. It's recommended to wrap the function call in a try-catch block to handle potential errors:

```typescript
try {
  const braveSDK = createBraveSDK({
    apiKey: 'your-api-key-here',
  });
} catch (error) {
  console.error('Error creating Brave SDK:', error);
}
```

## Notes

- The created SDK instance will use the provided API key for all subsequent API requests.
- If you need to use multiple API keys or switch between different configurations, you can create multiple SDK instances using this function.
- The SDK uses Zod for input validation, ensuring that the provided options meet the required format and constraints.

Remember to handle your API key securely and avoid exposing it in client-side code or public repositories.
