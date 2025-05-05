## Function: `listCaptions`

Lists captions for a given video.

**Purpose:**
Retrieves a list of captions for a video.

**Parameters:**

* `params`: `ListCaptionsParams` (required). An object containing the following properties:
    * `part`: `array<string>` (required). Specifies the parts of the caption resource to include in the response. Valid values include `snippet`, etc.
    * `videoId`: `string` (required). The ID of the video for which to retrieve captions.
    * `id`: `array<string>` (optional). A list of caption IDs to retrieve.
    * `onBehalfOfContentOwner`: `string` (optional). The content owner