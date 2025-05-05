# Packagefox: Code Generation Report

## Generated Files
| File | Size (bytes) |
|------|-------------|
| src/AgentDevelopmentKitSdk.ts | 3035 |
| src/types/index.ts | 3725 |
| src/schemas/index.ts | 789 |
| src/index.ts | 165 |

## Setup Information
- **Auth Type**: none


- **Setup Info**: The Agent Development Kit SDK does not require authentication for its core functionality. However, it provides mechanisms for handling authentication for individual tools that may require it.

To use the SDK:

1. Install the package:
   npm install @microfox/agent-development-kit

2. Import and create an instance of the SDK:
   import { createAgentDevelopmentKitSDK } from '@microfox/agent-development-kit';
   const adk = createAgentDevelopmentKitSDK('https://your-backend-url.com');

3. The SDK assumes the existence of a backend service exposing REST endpoints for agent interaction. Make sure to provide the correct backend URL when initializing the SDK.

4. For tools requiring authentication, you'll need to implement the necessary authentication flow in your application. The SDK provides helpers for managing authentication, but you'll need to handle the actual authentication process (e.g., OAuth flows) in your application.

5. Environment variables:
   - ADK_BACKEND_URL: The URL of your backend service (optional, can be passed directly to the SDK constructor)

Note: This SDK is designed to work with a backend service that implements the Agent Development Kit functionality. Ensure that your backend service is properly set up and exposes the required endpoints for the SDK to function correctly.



---
**Total Usage:** Total Bytes: 7714 | Tokens: 429003 | Cost: $1.7063