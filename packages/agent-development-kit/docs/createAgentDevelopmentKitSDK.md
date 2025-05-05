## Constructor: `createAgentDevelopmentKitSDK`

Creates a new instance of the AgentDevelopmentKitSDK. The SDK interacts with a backend service to manage agents, sessions, and events, and provides methods for running agents and tools.

**Purpose:**
Initializes a new instance of the AgentDevelopmentKitSDK, providing methods to interact with the Agent Development Kit backend.

**Parameters:**
- `baseUrl`: string, required. The base URL of the backend service.

**Return Value:**
- `AgentDevelopmentKitSDK`: An instance of the AgentDevelopmentKitSDK.

**Examples:**
```typescript
// Example 1: Minimal usage with required arguments
import { createAgentDevelopmentKitSDK } from '@microfox/agent-development-kit';
const adk = createAgentDevelopmentKitSDK("https://your-backend-url.com");
```