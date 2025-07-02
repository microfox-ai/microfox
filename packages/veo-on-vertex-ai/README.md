# Veo on Vertex AI SDK

A TypeScript SDK for interacting with the Veo API on Google Cloud's Vertex AI platform.

## Installation

```bash
npm install @microfox/veo-on-vertex-ai
```

## Environment Variables

To use this package, you need to set the following environment variables:

- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID. This is required to identify the project to use for Vertex AI services. ** (Required)**
- `GOOGLE_CLOUD_LOCATION`: The Google Cloud location for your Vertex AI resources (e.g., 'us-central1'). This is required to specify the regional endpoint for the API. ** (Required)**

## API Reference

For detailed documentation on the constructor and all available functions, please refer to the following files:

- [**VeoonVertexAIAPISdk** (Constructor)](./docs/VeoonVertexAIAPISdk.md): Initializes the client.
- [createVeoonVertexAIAPISDK](./docs/createVeoonVertexAIAPISDK.md)
- [fetchOperationStatus](./docs/fetchOperationStatus.md)
- [generateVideo](./docs/generateVideo.md)
- [pollOperation](./docs/pollOperation.md)

