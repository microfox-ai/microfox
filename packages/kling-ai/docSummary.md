```markdown
# Kling AI API TypeScript SDK Documentation

This document details the Kling AI API endpoints and data structures for integrating with the Kling AI platform.  This documentation is targeted towards the new system launched on May 22, 2025 (UTC+8), with a base URL of `https://api-singapore.klingai.com`.

## General Information

**API Base URL:** `https://api-singapore.klingai.com`

**Authentication:** JWT (JSON Web Token, RFC 7519)

**Authorization Header:** `Authorization: Bearer <API_TOKEN>`

**API Token Generation (TypeScript Example):**

```typescript
import * as jwt from 'jsonwebtoken';

function generateApiToken(accessKey: string, secretKey: string): string {
  const headers = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const payload = {
    iss: accessKey,
    exp: Math.floor(Date.now() / 1000) + 1800, // Expires in 30 minutes
    nbf: Math.floor(Date.now() / 1000) - 5,      // Valid 5 seconds ago
  };
  return jwt.sign(payload, secretKey, { header: headers });
}

const accessKey = "YOUR_ACCESS_KEY"; // Replace with your actual access key
const secretKey = "YOUR_SECRET_KEY"; // Replace with your actual secret key
const apiToken = generateApiToken(accessKey, secretKey);

console.log(apiToken);
```

**Error Codes:**

| HTTP Status Code | Service Code | Definition of Service Code | Explanation of Service Code | Suggested Solutions |
|---|---|---|---|---|
| 200 | 0 | Request | - | - |
| 401 | 1000 | Authentication failed | Authentication failed | Check if the Authorization is correct |
| 401 | 1001 | Authentication failed | Authorization is empty | Fill in the correct Authorization in the Request Header |
| 401 | 1002 | Authentication failed | Authorization is invalid | Fill in the correct Authorization in the Request Header |
| 401 | 1003 | Authentication failed | Authorization is not yet valid | Check the start effective time of the token, wait for it to take effect or reissue |
| 401 | 1004 | Authentication failed | Authorization has expired | Check the validity period of the token and reissue it |
| ... | ... | ... | ... | ... |


## API Endpoints


### 1. Text to Video

**Description:** Generates a video from a text prompt.

* **Create Task:**
    * **Endpoint:** `/v1/videos/text2video`
    * **Method:** `POST`
    * **Request Body:**
        ```typescript
        interface TextToVideoRequestBody {
          model_name?: 'kling-v1' | 'kling-v1-6' | 'kling-v2-master';
          prompt: string;
          negative_prompt?: string;
          cfg_scale?: number; // 0-1
          mode?: 'std' | 'pro';
          camera_control?: {
            type?: 'simple' | 'down_back' | 'forward_up' | 'right_turn_forward' | 'left_turn_forward';
            config?: {
              horizontal?: number; // -10-10
              vertical?: number; // -10-10
              pan?: number; // -10-10
              tilt?: number; // -10-10
              roll?: number; // -10-10
              zoom?: number; // -10-10
            };
          };
          aspect_ratio?: '16:9' | '9:16' | '1:1';
          duration?: 5 | 10;
          callback_url?: string;
          external_task_id?: string;
        }
        ```
    * **Response Body:**
        ```typescript
        interface TextToVideoResponse {
          code: number;
          message: string;
          request_id: string;
          data: {
            task_id: string;
            task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
            task_info: {
              external_task_id?: string;
            };
            created_at: number;
            updated_at: number;
          };
        }
        ```

* **Query Task (Single):**
    * **Endpoint:** `/v1/videos/text2video/{task_id | external_task_id}`
    * **Method:** `GET`
    * **Path Parameters:** `task_id` or `external_task_id`
    * **Response Body:** (Includes `task_result` field when successful)
        ```typescript
        interface TextToVideoQueryResponse extends TextToVideoResponse {
          data: TextToVideoResponse['data'] & {
            task_status_msg?: string;
            task_result?: {
              videos: {
                id: string;
                url: string;
                duration: string;
              }[];
            };
          };
        }
        ```

* **Query Task (List):**
    * **Endpoint:** `/v1/videos/text2video`
    * **Method:** `GET`
    * **Query Parameters:** `pageNum` (default: 1), `pageSize` (default: 30)
    * **Response Body:** (Array of `TextToVideoQueryResponse` data objects)
        ```typescript
        interface TextToVideoQueryListResponse {
          code: number;
          message: string;
          request_id: string;
          data: TextToVideoQueryResponse['data'][];
        }
        ```

### 2. Image to Video

**(Similar structure to Text to Video.  See documentation for specific request/response details.)**

* **Create Task:** `/v1/videos/image2video` (POST)
* **Query Task (Single):** `/v1/videos/image2video/{task_id | external_task_id}` (GET)
* **Query Task (List):** `/v1/videos/image2video` (GET)


### 3. Multi-Image to Video

**(Similar structure to Text to Video.  See documentation for specific request/response details.)**

* **Create Task:** `/v1/videos/multi-image2video` (POST)
* **Query Task (Single):** `/v1/videos/multi-image2video/{task_id | external_task_id}` (GET)
* **Query Task (List):** `/v1/videos/multi-image2video` (GET)


### 4. Video Extension

**(Similar structure to Text to Video.  See documentation for specific request/response details.)**

* **Create Task:** `/v1/videos/video-extend` (POST)
* **Query Task (Single):** `/v1/videos/video-extend/{task_id}` (GET)
* **Query Task (List):** `/v1/videos/video-extend` (GET)


### 5. Lip-Sync

**(Similar structure to Text to Video.  See documentation for specific request/response details.)**

* **Create Task:** `/v1/videos/lip-sync` (POST)
* **Query Task (Single):** `/v1/videos/lip-sync/{task_id}` (GET)
* **Query Task (List):** `/v1/videos/lip-sync` (GET)


### 6. Video Effects

**(Similar structure to Text to Video.  See documentation for specific request/response details.)**

* **Create Task:** `/v1/videos/effects` (POST)
* **Query Task (Single):** `/v1/videos/effects/{task_id | external_task_id}` (GET)
* **Query Task (List):** `/v1/videos/effects` (GET)


### 7. Image Generation

**(Similar structure to Text to Video.  See documentation for specific request/response details.)**

* **Create Task:** `/v1/images/generations` (POST)
* **Query Task (Single):** `/v1/images/generations/{task_id}` (GET)
* **Query Task (List):** `/v1/images/generations` (GET)


### 8. Virtual Try-On (Functionality Try)

**(Documentation not provided.  Endpoint assumed based on available information.)**

* **Create Task:** `/v1/tryon` (POST)  *(Assumed)*
* **Query Task (Single):** `/v1/tryon/{task_id}` (GET) *(Assumed)*
* **Query Task (List):** `/v1/tryon` (GET) *(Assumed)*


##  Edge Cases and Considerations

* **Base64 Encoding:**  Ensure correct Base64 encoding of images and audio without the `data:` prefix.
* **Image/Video Expiration:** Generated assets are cleared after 30 days.
* **Parameter Mutual Exclusivity:**  Pay close attention to parameters that cannot be used together (e.g., `image` and `image_tail` vs. `dynamic_masks`/`static_mask` vs. `camera_control` in Image to Video).
* **Model Compatibility:** Different model versions support different parameters and modes. Refer to the "Capability Map" (not provided in the original documentation) for details.
* **Rate Limiting:**  Be mindful of potential rate limits and implement retry mechanisms.
* **Typescript SDK Development:**  This summary provides a strong foundation for generating a Typescript SDK.  Further refinement may be needed based on actual API responses and edge case handling.


This comprehensive summary should provide the necessary information to create a robust and type-safe TypeScript SDK for the Kling AI API.  Remember to replace placeholder values with your actual credentials and adjust the code as needed based on your specific integration requirements.
```