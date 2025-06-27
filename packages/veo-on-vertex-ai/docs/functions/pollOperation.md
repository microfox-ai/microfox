## Function: `pollOperation`

Polls a long-running video generation operation until it is complete or a timeout is reached. It repeatedly calls `fetchOperationStatus` at a specified interval, simplifying the process of waiting for a result.

**Purpose:**
This function provides a convenient way to wait for an asynchronous `generateVideo` task to finish. Instead of manually calling `fetchOperationStatus` in a loop, you can use `pollOperation` to handle the polling logic automatically. It resolves once the video is ready or throws an error if it takes too long.

**Parameters:**
- `model` (VeoModel): The Veo model that was used to start the generation. Valid values are `'veo-2.0-generate-001'` or `'veo-3.0-generate-preview'`.
- `operationName` (string): The unique identifier of the operation, as returned by the `generateVideo` function.
- `intervalMs` (number, optional, default: 5000): The interval, in milliseconds, at which to poll for the operation's status. The default is 5 seconds.
- `timeoutMs` (number, optional, default: 600000): The maximum time, in milliseconds, to wait for the operation to complete. If the operation is not `done` within this period, the function will throw a timeout error. The default is 10 minutes (600,000 ms).

**Return Value:**
- A `Promise` that resolves to the final `VeoFetchOperationResponse` object once the operation's `done` property becomes `true`. This response object will contain the final status and the video results if successful.

**Throws:**
- An `Error` if the polling duration exceeds the `timeoutMs` before the operation is complete.
- An `Error` if any of the underlying `fetchOperationStatus` calls fail for reasons other than the operation not being ready.

**Examples:**

```typescript
// Assumes 'sdk' is an initialized instance of VeoonVertexAIAPISdk and 'operationName' is a valid string from a generateVideo call.
// const sdk = createVeoonVertexAIAPISDK();
// const operationName = 'projects/.../locations/.../operations/...';

// Example 1: Poll an operation with default settings (5s interval, 10min timeout)
async function waitForVideo(operationName: string) {
  try {
    console.log('Polling for operation result...');
    const finalResponse = await sdk.pollOperation('veo-2.0-generate-001', operationName);
    
    console.log('Operation finished!');
    if (finalResponse.response) {
      finalResponse.response.generatedSamples.forEach((sample, index) => {
        console.log(`  Generated Video URI ${index + 1}: ${sample.video.uri}`);
      });
    } else {
      console.log('Operation completed but returned no response data.');
    }
  } catch (error) {
    console.error('Error while polling for operation:', error.message);
  }
}

// Example 2: Poll with a custom interval and a shorter timeout
async function waitForVideoQuickly(operationName: string) {
  try {
    console.log('Polling for operation result with custom settings...');
    // Poll every 10 seconds, with a total timeout of 2 minutes
    const finalResponse = await sdk.pollOperation('veo-2.0-generate-001', operationName, 10000, 120000);

    console.log('Operation finished!');
    if (finalResponse.response) {
      console.log(`Video is available at: ${finalResponse.response.generatedSamples[0].video.uri}`);
    }
  } catch (error) {
    console.error('Error while polling for operation:', error.message);
  }
}

// Example usage:
// waitForVideo('<your-operation-name>');
// waitForVideoQuickly('<your-operation-name>');
```