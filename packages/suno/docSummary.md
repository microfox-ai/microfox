## Suno API TypeScript SDK Summary

This document summarizes the Suno API (v1.0.0) for generating audio, providing the necessary information for building a TypeScript SDK. The API uses Bearer token authentication for all endpoints.

**Authentication:**

* **Type:** `Bearer Token`
* **Header:** `Authorization: Bearer YOUR_API_KEY`
* **Obtaining API Key:** Visit the API Key Management Page (URL not provided in documentation, needs to be confirmed).
* **Security Considerations:**  Keep your API Key secure and reset it immediately if compromised.

**Global Error Handling:** (Not explicitly defined, needs clarification)
*  The documentation doesn't specify standard error responses. The SDK should handle potential HTTP error codes (e.g., 400, 401, 500) and provide informative error messages.

**Endpoints:**

The provided documentation only gives a general overview of authentication and doesn't list specific endpoints.  We need more information to create a comprehensive SDK.  The following is a placeholder structure, assuming typical audio generation API functionality.  This needs to be populated with actual endpoint details from the full Suno API documentation.

**1. Music Generation (Placeholder - Requires Full API Spec)**

* **Description:**  Generates music based on provided parameters. (This is an assumption based on the "Next: Music Generation" link).
* **Endpoint:** `/music/generate` (Placeholder)
* **Method:** `POST` (Placeholder)
* **Request Headers:**
    * `Authorization: Bearer YOUR_API_KEY`
* **Request Parameters/Body:** (Placeholder -  Needs types and descriptions)
    * `genre`: `string` (e.g., "rock", "jazz", "classical")
    * `duration`: `number` (seconds)
    * `tempo`: `number` (bpm)
    *  `other_parameters`:  `object` (Depending on API specifics)
* **Response Format:** `application/json` (Placeholder)
* **Response Data Structure:** (Placeholder - Needs types and descriptions)
    * `audio_url`: `string` (URL to download the generated music)
    * `status`: `string` (e.g., "success", "failed")
    * `message`: `string` (Optional message)


**2. Text-to-Speech (Placeholder - Requires Full API Spec)**

* **Description:** Converts text into spoken audio.
* **Endpoint:** `/tts/generate` (Placeholder)
* **Method:** `POST` (Placeholder)
* **Request Headers:**
    * `Authorization: Bearer YOUR_API_KEY`
* **Request Parameters/Body:** (Placeholder - Needs types and descriptions)
    * `text`: `string` (The text to be converted to speech)
    * `voice`: `string` (e.g., "male", "female", specific voice names)
    * `language`: `string` (e.g., "en-US", "es-ES")
* **Response Format:** `application/json` or `audio/mpeg` (Placeholder - Needs confirmation)
* **Response Data Structure (if JSON):** (Placeholder - Needs types and descriptions)
    * `audio_url`: `string` (URL to download the generated audio)
    * `status`: `string`
    * `message`: `string`


**Edge Cases:**

* **Rate Limiting:** The documentation doesn't mention rate limits. The SDK should gracefully handle rate limit errors (e.g., 429 Too Many Requests) if they exist.
* **Error Handling:**  Comprehensive error handling needs to be implemented based on the full API specification, including specific error codes and messages.


**TypeScript SDK Structure (Example):**

```typescript
// Placeholder -  Illustrative example.  Adjust based on the full API spec.

class SunoAPI {
  private apiKey: string;
  private baseUrl: string = "https://api.sunoapi.org/v1"; // Placeholder base URL

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMusic(params: MusicGenerationParams): Promise<MusicGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/music/generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json", // Adjust if needed
      },
      body: JSON.stringify(params),
    });
    // ... handle response and errors ...
  }

 // ... other methods for different endpoints ...
}

interface MusicGenerationParams {
  // ... parameter types ...
}

interface MusicGenerationResponse {
  // ... response types ...
}
```


This summary provides a starting point for building a TypeScript SDK for the Suno API.  The placeholders need to be replaced with concrete details from the complete API documentation.  A robust SDK should handle authentication, requests, responses, error handling, and potentially rate limiting.
