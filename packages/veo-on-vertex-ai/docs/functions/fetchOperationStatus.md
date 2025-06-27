## Function: `fetchOperationStatus`

Fetches the current status of a long-running video generation operation. This allows you to check if the task is still in progress, has completed successfully, or has failed.

**Purpose:**
After initiating a video generation with `generateVideo`, you receive an operation name. This function uses that name to query the API for the latest status of the task. It's essential for tracking asynchronous jobs and retrieving the final result once the operation is complete.

**Parameters:**
- `model` (VeoModel): The Veo model that was used to start the generation. Valid values are `'veo-2.0-generate-001'` or `'veo-3.0-generate-preview'`.
- `request` (VeoFetchOperationRequest): An object containing the operation name.
  - `operationName` (string): The unique identifier of the operation, as returned by the `generateVideo` function.

**Return Value:**
- A `Promise` that resolves to a `VeoFetchOperationResponse` object, which describes the state of the operation.
  - `name` (string): The name of the operation being queried.
  - `done` (boolean): A boolean flag indicating the completion status. `true` if the operation is finished (either successfully or with an error), and `false` if it is still running.
  - `response` (object, optional): This field is present only when `done` is `true` and the operation was successful. It contains the results of the video generation.
    - `@type` (string): The type of the response payload.
    - `generatedSamples` (array<object>): An array of the generated video samples.
      - `video` (object): Contains details about the generated video file.
        - `uri` (string): The Google Cloud Storage (GCS) URI where the generated video is stored.
        - `encoding` (string): The encoding format of the video file.

**Throws:**
- An `Error` if the API request fails, for example, if the operation name is invalid or there are permission issues.

**Examples:**

```typescript
// Assumes 'sdk' is an initialized instance of VeoonVertexAIAPISdk and 'operationName' is a valid string from a generateVideo call.
// const sdk = createVeoonVertexAIAPISDK();
// const operationName = 'projects/.../locations/.../operations/...';

async function checkStatus(operationName: string) {
  try {
    const statusResponse = await sdk.fetchOperationStatus('veo-2.0-generate-001', { operationName });

    console.log(`Operation: ${statusResponse.name}`);
    console.log(`Is Done: ${statusResponse.done}`);

    if (statusResponse.done && statusResponse.response) {
      console.log('Operation completed successfully!');
      statusResponse.response.generatedSamples.forEach((sample, index) => {
        console.log(`  Sample ${index + 1}: ${sample.video.uri}`);
      });
    } else if (statusResponse.done) {
      console.log('Operation completed with an error or no response.');
    } else {
      console.log('Operation is still in progress...');
    }
  } catch (error) {
    console.error('Failed to fetch operation status:', error);
  }
}

// Example usage:
// checkStatus('<your-operation-name>');
```