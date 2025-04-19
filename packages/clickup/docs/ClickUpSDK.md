# ClickUpSDK Constructor

Initializes a new instance of the ClickUp SDK.

## Parameters

- **config** (ClickUpSDKConfig): An object containing the API key and optional base URL.
  - **apiKey** (string): Your ClickUp API key. Required.
  - **baseUrl** (string, optional): The base URL for the ClickUp API. Defaults to `https://api.clickup.com`.

## Usage Examples

```typescript
import { createClickUpSDK } from 'clickup-typescript-sdk';

// Initialize with API key
const clickUp = createClickUpSDK({ apiKey: 'YOUR_API_KEY' });

// Initialize with API key and custom base URL
const clickUpCustomUrl = createClickUpSDK({ apiKey: 'YOUR_API_KEY', baseUrl: 'https://your-custom-domain.com/api' });
```

## Code Example

```typescript
import { createClickUpSDK } from 'clickup-typescript-sdk';

const clickUp = createClickUpSDK({ apiKey: process.env.CLICKUP_API_KEY });

await clickUp.getSpaces('YOUR_TEAM_ID');
```

## Authentication

This SDK uses API key authentication. You need to obtain an API key from your ClickUp account settings. See the extra information for details on how to get an API key.

## Error Handling

The constructor validates the provided config using a Zod schema. If the config is invalid, it will throw an error.

## Additional Information

- It's recommended to store your API key in an environment variable for security.
- The SDK uses a mix of v2 and v3 endpoints. Be aware of the differences in terminology between versions.