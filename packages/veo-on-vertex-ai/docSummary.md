## Veo on Vertex AI API Summary for TypeScript SDK Generation

This document summarizes the Veo on Vertex AI API for the purpose of generating a TypeScript SDK.  It covers video generation from text and image prompts.

**Authentication:** All endpoints require Bearer token authentication using a Google Cloud access token. This can be obtained using the `gcloud auth print-access-token` command.

**Base URL:** `https://LOCATION-aiplatform.googleapis.com/v1`

**Models:**

* `veo-2.0-generate-001` (GA)
* `veo-3.0-generate-preview` (Preview) - Note: This model has specific requirements like mandatory audio generation and doesn't support 9:16 aspect ratio.

---

### 1. Generate Video (Long-running Operation)

**Description:** Initiates a long-running video generation process based on a text and/or image prompt.

**Endpoint:** `/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:predictLongRunning`

**Method:** `POST`

**Request Headers:**

* `Authorization`: `Bearer ${ACCESS_TOKEN}`
* `Content-Type`: `application/json`

**Request Body:**

```typescript
interface VeoGenerateVideoRequest {
  instances: {
    prompt?: string; // Required for text-to-video, optional for image-to-video
    image?: {
      bytesBase64Encoded?: string; // Base64 encoded image string
      gcsUri?: string;           // Google Cloud Storage URI
      mimeType: string;         // Required if using image. e.g., "image/jpeg", "image/png"
    };
  }[];
  parameters: {
    aspectRatio?: "16:9" | "9:16"; // Defaults to "16:9". "9:16" not supported by veo-3.0-generate-preview
    negativePrompt?: string;
    personGeneration?: "allow_adult" | "dont_allow"; // Defaults to "allow_adult"
    sampleCount?: number; // 1-4, defaults to 1
    seed?: number;        // 0-4294967295
    storageUri?: string;  // GCS URI for output, e.g., "gs://BUCKET_NAME/SUBDIRECTORY"
    durationSeconds?: number; // Required. 5-8 for veo-2.0-generate-001, 8 for veo-3.0-generate-preview
    enhancePrompt?: boolean; // Defaults to true
    generateAudio?: boolean; // Required for veo-3.0-generate-preview, not supported by veo-2.0-generate-001. Must be true.
  };
}
```

**Edge Cases:**

* Ensure `mimeType` is provided if `image` is used.
* Validate `durationSeconds` based on the chosen model.
* `aspectRatio`: "9:16" is not supported for `veo-3.0-generate-preview`.
* `generateAudio` is required and must be `true` for `veo-3.0-generate-preview`.

**Response:**

```typescript
interface VeoGenerateVideoResponse {
  name: string; // Operation name for polling
}
```


### 2. Fetch Long-running Operation Status

**Description:** Retrieves the status and result of a video generation operation.

**Endpoint:** `/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:fetchPredictOperation`

**Method:** `POST`

**Request Headers:**

* `Authorization`: `Bearer ${ACCESS_TOKEN}`
* `Content-Type`: `application/json`

**Request Body:**

```typescript
interface VeoFetchOperationRequest {
  operationName: string; // Operation name from Generate Video response
}
```

**Response:**

```typescript
interface VeoFetchOperationResponse {
  name: string;
  done: boolean;
  response?: {
    "@type": "type.googleapis.com/cloud.ai.large_models.vision.GenerateVideoResponse";
    generatedSamples: {
      video: {
        uri: string; // GCS URI or base64 encoded video if storageUri was not provided
        encoding: string; // e.g., "video/mp4"
      };
    }[];
  };
}

```

**Edge Cases:**

* Handle the case where `response` is undefined if the operation is not complete.


---

**TypeScript SDK Considerations:**

* Create separate interfaces for request and response bodies.
* Implement helper functions for encoding/decoding base64 images.
* Implement polling logic for the long-running operation.
* Handle potential errors and edge cases gracefully.
* Provide clear documentation and type definitions for all functions and parameters.
* Consider using a library for managing long-running operations to simplify the polling process.
* Provide separate functions or classes for each model to handle model-specific requirements.
* Implement validation for input parameters to prevent common errors.


This detailed summary provides the necessary information to generate a robust and type-safe TypeScript SDK for interacting with the Veo on Vertex AI API. Remember to consult the official documentation for the most up-to-date information and any potential updates.
