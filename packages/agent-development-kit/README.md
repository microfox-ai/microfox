# Agent Development Kit SDK

A TypeScript SDK for Agent Development Kit, mirroring the functionality of the existing Python version.

## Installation

```bash
npm install @microfox/agent-development-kit
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `ADK_BACKEND_URL`: The base URL of the backend service. (Optional)

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**createAgentDevelopmentKitSDK** (Constructor)](./docs/createAgentDevelopmentKitSDK.md): Initializes the client.
- [createSession](./docs/createSession.md)
- [getSession](./docs/getSession.md)
- [appendEvent](./docs/appendEvent.md)
- [runAgent](./docs/runAgent.md)
- [runTool](./docs/runTool.md)
- [requestAuth](./docs/requestAuth.md)
- [handleAuthCallback](./docs/handleAuthCallback.md)
- [createLlmAgent](./docs/createLlmAgent.md)
- [createSequentialAgent](./docs/createSequentialAgent.md)
- [createParallelAgent](./docs/createParallelAgent.md)
- [createLoopAgent](./docs/createLoopAgent.md)
- [createTool](./docs/createTool.md)

