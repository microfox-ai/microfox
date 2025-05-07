## Constructor: `AmazonRekognitionFaceDetectionSdk`

Initializes a new instance of the AmazonRekognitionFaceDetectionSdk.

**Purpose:**
The constructor initializes the SDK with AWS credentials and the region. It validates the provided credentials and sets up the endpoint for making requests to the Amazon Rekognition API.

**Parameters:**

- `config`: `SdkConfig` - An object containing the configuration parameters for the SDK.
  - `accessKeyId`: `string` (optional) - The AWS access key ID. If not provided, it will be retrieved from the `AWS_ACCESS_KEY_ID` environment variable.
  - `secretAccessKey`: `string` (optional) - The AWS secret access key. If not provided, it will be retrieved from the `AWS_SECRET_ACCESS_KEY` environment variable.
  - `region`: `string` (optional) - The AWS region. Defaults to `us-east-1`. If not provided, it will be retrieved from the `AWS_REGION` environment variable.

**Return Value:**

- `AmazonRekognitionFaceDetectionSdk` - A new instance of the AmazonRekognitionFaceDetectionSdk.

**Examples:**

```typescript
// Example 1: Using environment variables
const sdk = new AmazonRekognitionFaceDetectionSdk({});

// Example 2: Providing config
const sdk = new AmazonRekognitionFaceDetectionSdk({
  accessKeyId: "YOUR_ACCESS_KEY_ID",
  secretAccessKey: "YOUR_SECRET_ACCESS_KEY",
  region: "us-west-2",
});
```