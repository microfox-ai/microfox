## Amazon Rekognition Face Detection TypeScript SDK Summary

This document summarizes the Amazon Rekognition `DetectFaces` API endpoint for generating a TypeScript SDK.

### 1. API Endpoint and Method

* **Endpoint:** `rekognition.<region>.amazonaws.com` (Replace `<region>` with the desired AWS region)
* **Method:** `POST`
* **Operation:** `DetectFaces`
* **Description:** Detects faces in an image provided as an image byte array or an Amazon S3 object. Returns bounding boxes, facial landmarks, attributes (age range, gender, emotions, etc.), and quality information for each detected face.

### 2. Request Headers

* **Content-Type:** `application/x-amz-json-1.1`
* **X-Amz-Target:** `RekognitionService.DetectFaces`
* **Authorization:**  AWS Signature Version 4 (see Authentication section)

### 3. Request Body (JSON)

```typescript
interface S3Object {
  Bucket: string;
  Name: string;
}

interface Image {
  Bytes?: string; // Base64 encoded image bytes
  S3Object?: S3Object;
}

interface DetectFacesRequest {
  Image: Image;
  Attributes: Attribute[]; // "ALL" | "DEFAULT" | specific attributes
}

type Attribute = "ALL" | "DEFAULT" | "FACE_OCCLUDED" | "EYE_DIRECTION" | "AGE_RANGE" | "SMILE" | "EYEGLASSES" | "SUNGLASSES" | "GENDER" | "BEARD" | "MUSTACHE" | "EYES_OPEN" | "MOUTH_OPEN" | "EMOTIONS" | ... ; // Add all other attributes as needed.
```

**Request Parameters:**

* **Image:**  Required. Specifies the input image.  Can be either `Bytes` (base64 encoded image) or `S3Object`.
    * **Bytes:** Base64-encoded image bytes.  Type: `string`
    * **S3Object:** Location of image in S3. Type: `S3Object`
        * **Bucket:**  Name of the S3 bucket. Type: `string`
        * **Name:**  S3 object key (filename). Type: `string`
* **Attributes:** Optional.  An array of strings indicating which attributes to return.  Type: `Attribute[]`.
    * `"ALL"`: Returns all facial attributes.
    * `"DEFAULT"`: Returns a default subset of attributes (BoundingBox, Confidence, Pose, Quality, and Landmarks).
    * Specific attributes (e.g., `"FACE_OCCLUDED"`, `"EYE_DIRECTION"` etc.): Returns the specified attributes in addition to the default set.


### 4. Response Format (JSON)

```typescript
// ... (Types for BoundingBox, AgeRange, Smile, Eyeglasses, etc. - see example response below) ...

interface Landmark {
  Type: string;
  X: number;
  Y: number;
}

interface Pose {
  Roll: number;
  Yaw: number;
  Pitch: number;
}

interface Quality {
  Brightness: number;
  Sharpness: number;
}

interface Emotion {
  Type: string;
  Confidence: number;
}

interface FaceDetail {
  BoundingBox: BoundingBox;
  AgeRange?: AgeRange;
  Smile?: Smile;
  // ... other attributes (Eyeglasses, Sunglasses, Gender, etc.)
  Landmarks: Landmark[];
  Pose: Pose;
  Quality: Quality;
  Confidence: number;
  FaceOccluded?: FaceOccluded; // Optional, only if requested
  EyeDirection?: EyeDirection; // Optional, only if requested
  Emotions?: Emotion[]; // Optional, only if requested
}



interface DetectFacesResponse {
  FaceDetails: FaceDetail[];
  ResponseMetadata: { // Standard AWS response metadata
    RequestId: string;
    HTTPStatusCode: number;
    // ... other metadata fields
  };
}

```

(Refer to the example response in the original documentation for the structure of `BoundingBox`, `AgeRange`, `Smile`, `Eyeglasses`, `Sunglasses`, `Gender`, `Beard`, `Mustache`, `EyesOpen`, `MouthOpen`, `FaceOccluded`, `EyeDirection` types. Ensure all types are accurately represented in the TypeScript definitions.)


### 5. Authentication

* **AWS Signature Version 4:**  The request must be signed using AWS credentials (access key ID and secret access key). The SDK should handle this signing process automatically.  The credentials can be provided in several ways (environment variables, shared credentials file, etc.).

### 6.  Edge Cases and Additional Information

* **Image Size:**  Rekognition has limits on the size of images it can process. The SDK should handle these limits gracefully and provide informative error messages.
* **Number of Faces:** Rekognition detects up to 100 largest faces in an image.
* **Attribute Selection:** The `Attributes` parameter significantly impacts response time.  Requesting `"ALL"` attributes can be slower.  The SDK should allow users to specify only the attributes they need.
* **Error Handling:** The SDK should robustly handle errors from the Rekognition API, providing clear error messages and status codes.
* **Throttling:**  The Rekognition API is subject to throttling. The SDK should implement retry logic with exponential backoff to handle throttling gracefully.


This summary provides the essential information for generating a TypeScript SDK for Amazon Rekognition's `DetectFaces` operation. Be sure to consult the official AWS documentation for the most up-to-date information and details.  Thorough testing is crucial to ensure the SDK functions correctly and handles all edge cases.
