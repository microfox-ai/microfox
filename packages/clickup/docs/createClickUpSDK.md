# createClickUpSDK

Creates an instance of the ClickUpSDK.

## Parameters

- **config** (ClickUpSDKConfig): Configuration object for the SDK.
  - **apiKey** (string): Your ClickUp API key.
  - **baseUrl** (string, optional): The base URL for the ClickUp API. Defaults to `https://api.clickup.com`.

## Return Type

ClickUpSDK

## Usage Example

```typescript
import { createClickUpSDK } from 'clickup-typescript-sdk';

const clickUp = createClickUpSDK({ apiKey: 'YOUR_API_KEY' });
```

## Authentication

This function requires an API key for authentication. See the extra information for details on how to obtain an API key.