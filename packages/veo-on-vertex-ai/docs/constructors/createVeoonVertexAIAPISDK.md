## Function: `createVeoonVertexAIAPISDK`

A factory function that creates and returns a new instance of the `VeoonVertexAIAPISdk` client. This is the recommended and convenient way to instantiate the SDK.

**Purpose:**
This function simplifies the process of creating an SDK client instance. It abstracts the class instantiation and provides a clear entry point for users of the library.

**Parameters:**
- `projectId` (string, optional): Your Google Cloud project ID. This is a unique identifier for your Google Cloud project. If this parameter is not provided, the SDK will attempt to use the value from the `GOOGLE_CLOUD_PROJECT` environment variable.
- `location` (string, optional): The Google Cloud location for your Vertex AI resources (e.g., 'us-central1'). This specifies the regional endpoint for the API. If this parameter is not provided, the SDK will attempt to use the value from the `GOOGLE_CLOUD_LOCATION` environment variable.

**Return Value:**
- An instance of `VeoonVertexAIAPISdk` configured with the provided or environment-based project ID and location.

**Examples:**

```typescript
// Example 1: Create a client with explicit parameters
// Replace '<your-gcp-project-id>' and '<your-gcp-location>' with your actual project ID and location.
const sdk1 = createVeoonVertexAIAPISDK('<your-gcp-project-id>', '<your-gcp-location>');

// Example 2: Create a client using environment variables
// Make sure GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION are set in your environment.
// For example:
// export GOOGLE_CLOUD_PROJECT="<your-gcp-project-id>"
// export GOOGLE_CLOUD_LOCATION="<your-gcp-location>"
const sdk2 = createVeoonVertexAIAPISDK();
```