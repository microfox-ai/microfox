## Constructor: `VeoonVertexAIAPISdk`

Initializes a new instance of the `VeoonVertexAIAPISdk` client. This constructor sets up the configuration required to communicate with the Veo on Vertex AI API, including the Google Cloud project ID and location.

**Purpose:**
The constructor's main purpose is to configure the SDK with the necessary project and location details, which are essential for making API requests to the correct Vertex AI endpoint. It offers flexibility by allowing these details to be provided either directly as arguments or through environment variables.

**Parameters:**
- `projectId` (string, optional): Your Google Cloud project ID. This is a unique identifier for your Google Cloud project. If this parameter is not provided, the SDK will attempt to use the value from the `GOOGLE_CLOUD_PROJECT` environment variable.
- `location` (string, optional): The Google Cloud location for your Vertex AI resources (e.g., 'us-central1'). This specifies the regional endpoint for the API. If this parameter is not provided, the SDK will attempt to use the value from the `GOOGLE_CLOUD_LOCATION` environment variable.

**Throws:**
- An `Error` is thrown if the `projectId` is not provided either as a parameter or through the `GOOGLE_CLOUD_PROJECT` environment variable.
- An `Error` is thrown if the `location` is not provided either as a parameter or through the `GOOGLE_CLOUD_LOCATION` environment variable.

**Examples:**

```typescript
// Example 1: Initialize SDK using constructor parameters
// Replace '<your-gcp-project-id>' and '<your-gcp-location>' with your actual project ID and location.
const sdkWithParams = new VeoonVertexAIAPISdk('<your-gcp-project-id>', '<your-gcp-location>');

// Example 2: Initialize SDK using environment variables
// Make sure GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION are set in your environment.
// For example:
// export GOOGLE_CLOUD_PROJECT="<your-gcp-project-id>"
// export GOOGLE_CLOUD_LOCATION="<your-gcp-location>"
const sdkWithEnv = new VeoonVertexAIAPISdk();

// Example 3: Using the factory function (recommended)
// This provides a clear and convenient way to create an SDK instance.
const sdkFromFactory = createVeoonVertexAIAPISDK('<your-gcp-project-id>', '<your-gcp-location>');
```