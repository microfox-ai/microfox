## Function: `listRecordings`

Lists recordings based on provided criteria.

**Purpose:**
Retrieves a list of recordings, optionally filtered by studioId or projectId, and paginated.

**Parameters:**

- `options`: object (optional) - An object containing filter and pagination options.
  - `studioId`: string (optional) - The ID of the studio to filter recordings by.
  - `projectId`: string (optional) - The ID of the project to filter recordings by.
  - `page`: number (optional) - The page number to retrieve.

**Return Value:**

- `Promise<ListRecordingsResponse>` - A promise that resolves to a `ListRecordingsResponse` object.
  - `ListRecordingsResponse`: object
    - `page`: number - The current page number.
    - `next_page_url`: string | null - The URL for the next page, or null if there is no next page.
    - `total_items`: number - The total number of items across all pages.
    - `total_pages`: number - The total number of pages.
    - `data`: array<Recording> - An array of `Recording` objects.
      - `Recording`: object
        - `id`: string - The unique identifier of the recording (v1).
        - `recording_id`: string - The unique identifier of the recording (v2).
        - `name`: string - The name of the recording.
        - `project_id`: string - The ID of the project this recording belongs to.
        - `project_name`: string - The name of the project this recording belongs to.
        - `studio_id`: string - The ID of the studio this recording belongs to.
        - `studio_name`: string - The name of the studio this recording belongs to.
        - `status`: "uploading" | "processing" | "ready" - The status of the recording.
        - `created_date`: string - The creation date of the recording.
        - `tracks`: array<Track> - The tracks in the recording.
          - `Track`: object
            - `id`: string - The unique identifier of the track.
            - `type`: "participant" | "screenshare" | "media board" - The type of the track.
            - `status`: "done" | "processing" | "uploading" | "stopped" - The status of the track.
            - `files`: array<File> - The files associated with the track.
              - `File`: object
                - `name`: string (optional) - The name of the file.
                - `size`: number (optional) - The size of the file in bytes.
                - `type`: "txt" | "srt" | "raw_video" | "aligned_video" | "raw_audio" | "compressed_audio" | "cloud_recording" - The type of the file.
                - `download_url`: string - The URL to download the file.
        - `transcription`: Transcription (optional) - The transcription of the recording, if available.
          - `Transcription`: object
            - `status`: "transcribing" | "done" - The status of the transcription.
            - `files`: array<File> - The transcription files.

**Examples:**

```typescript
// Example 1: Listing all recordings
const recordings = await riversideSDK.listRecordings();
console.log(recordings);

// Example 2: Listing recordings for a specific studio
const studioRecordings = await riversideSDK.listRecordings({ studioId: 