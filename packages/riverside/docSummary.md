## Riverside API TypeScript SDK Summary

This summary provides the necessary information to generate a TypeScript SDK for the Riverside.fm Business API.  It details endpoints, data structures, authentication, and other crucial aspects for implementation.

**Authentication:**

* API Key (Bearer token):  Obtained by contacting your Riverside customer success member.  This key should be included in the `Authorization` header for all requests as `BEARER YOUR_API_KEY`.

**Data Structures (TypeScript Interfaces):**

```typescript
interface Production {
  id: string;
  name: string;
  created_date: string;
  studios: Studio[];
  num_recordings: number;
}

interface Studio {
  id: string;
  name: string;
  created_date: string;
  projects: Project[];
  num_recordings: number;
}

interface Project {
  id: string;
  name: string;
  created_date: string;
  num_recordings: number;
}

interface Recording {
  id: string;  // v1
  recording_id: string; // v2
  name: string;
  project_id: string;
  project_name: string;
  studio_id: string;
  studio_name: string;
  status: "uploading" | "processing" | "ready";
  created_date: string;
  tracks: Track[];
  transcription?: Transcription;
}

interface Track {
  id: string;
  type: "participant" | "screenshare" | "media board";
  status: "done" | "processing" | "uploading" | "stopped";
  files: File[];
}

interface File {
  name?: string;  // Present in v1 download file response
  size?: number;  // Present in v1 download file response
  type: "txt" | "srt" | "raw_video" | "aligned_video" | "raw_audio" | "compressed_audio" | "cloud_recording";
  download_url: string;
}

interface Transcription {
  status: "transcribing" | "done";
  files: File[];
}

interface ListRecordingsResponse {
  page: number;
  next_page_url: string | null;
  total_items: number;
  total_pages: number;
  data: Recording[];
}

```

**Endpoints:**

| Endpoint | Method | Description | Authentication | Request Parameters | Request Body | Response | Rate Limit | Edge Cases |
|---|---|---|---|---|---|---|---|---|
| `/api/v2/productions` | `GET` | Lists all productions with associated studios, projects, and recordings. | API Key | None | None | `Production[]` | 3 minutes | None |
| `/api/v2/recordings` | `GET` | Lists recordings, optionally filtered by `studioId` or `projectId`. Supports pagination. | API Key | `studioId` (string, optional), `projectId` (string, optional), `page` (number, optional, defaults to 0) | None | `ListRecordingsResponse` | 30 seconds per unique request | Only one filter parameter allowed at a time.  Handle pagination using `next_page_url`. |
| `/api/v1/recordings/{recording_id}` | `GET` | Retrieves a single recording by ID. | API Key | `recording_id` (string, path parameter) | None | `Recording` | 30 seconds per unique recording | Handle 404 Not Found. |
| `/api/v1/download/file/{file_id}` | `GET` | Downloads a media file. | API Key | `file_id` (string, path parameter) | None | File stream (binary data) | 30 seconds per unique file | Handle different content types in the response. |
| `/api/v1/download/transcription/{file_id}` | `GET` | Downloads a transcription file. | API Key | `file_id` (string, path parameter), `type` (string, query parameter - "srt" or "txt") | None | File stream (text data) | 3 minutes per unique request | Ensure correct handling of `type` parameter. |
| `/api/v1/recordings/{recording_id}` | `DELETE` | Deletes a recording. | API Key | `recording_id` (string, path parameter) | None | 204 No Content | None specified | Handle 404 Not Found. |


**SDK Considerations:**

* **TypeScript:** Use the provided interfaces for type safety.
* **Error Handling:** Implement robust error handling for all API calls, including checking HTTP status codes and potential network issues.
* **Rate Limiting:** Respect the rate limits for each endpoint to avoid request failures.  Implement retry mechanisms with exponential backoff.
* **Pagination:** For `/api/v2/recordings`, handle pagination using the `next_page_url` field.
* **File Downloads:** Implement appropriate methods for downloading and handling binary file data for media files and text data for transcriptions.
* **API Versioning:** Be mindful of the different API versions (v1 and v2) used for different endpoints.  Clearly document these differences in the SDK.


This comprehensive summary should provide a solid foundation for building a robust and type-safe TypeScript SDK for the Riverside.fm Business API. Remember to consult the original documentation for any updates or clarifications.
