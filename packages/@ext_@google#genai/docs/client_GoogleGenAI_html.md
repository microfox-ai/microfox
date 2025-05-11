## Class: `GoogleGenAI`

The Google GenAI SDK.  It provides access to GenAI features through either the Gemini API or the Vertex AI API. The choice of API is determined by the `vertexai` option in `GoogleGenAIOptions`.

When using the Gemini API, an `apiKey` must be provided in `GoogleGenAIOptions`. When using the Vertex AI API, both `project` and `location` must be provided in `GoogleGenAIOptions`.


## Constructor: `constructor`

```typescript
new GoogleGenAI(options: GoogleGenAIOptions): GoogleGenAI
```

**Purpose:**
Initializes a new instance of the `GoogleGenAI` SDK.

**Parameters:**

- `options`: `GoogleGenAIOptions` -  Required. Options for configuring the SDK.

    - `apiKey`: `string` - Optional. The API key for accessing the Gemini API. Required if `vertexai` is `false`.
    - `vertexai`: `boolean` - Optional. Whether to use the Vertex AI API. Defaults to `false`.
    - `project`: `string` - Optional. The Google Cloud project ID. Required if `vertexai` is `true`.
    - `location`: `string` - Optional. The location of the Vertex AI resources. Required if `vertexai` is `true`.


**Return Value:**

- `GoogleGenAI` - A new instance of the `GoogleGenAI` SDK.


**Examples:**

```typescript
// Example 1: Initializing the SDK for using the Gemini API
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY' });

// Example 2: Initializing the SDK for using the Vertex AI API
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  vertexai: true,
  project: 'YOUR_PROJECT_ID',
  location: 'YOUR_PROJECT_LOCATION'
});
```


## Property: `caches`

```typescript
readonly caches: Caches;
```

**Purpose:**
Provides access to cache management functionalities.

**Return Value:**

- `Caches` - An object providing methods for interacting with caches.  Further documentation for the `Caches` object is needed.


## Property: `chats`

```typescript
readonly chats: Chats;
```

**Purpose:**
Provides access to chat functionalities.

**Return Value:**

- `Chats` - An object providing methods for interacting with chats. Further documentation for the `Chats` object is needed.


## Property: `files`

```typescript
readonly files: Files;
```

**Purpose:**
Provides access to file management functionalities.

**Return Value:**

- `Files` - An object providing methods for interacting with files. Further documentation for the `Files` object is needed.


## Property: `live`

```typescript
readonly live: Live;
```

**Purpose:**
Provides access to live interaction functionalities.

**Return Value:**

- `Live` - An object providing methods for live interactions. Further documentation for the `Live` object is needed.


## Property: `models`

```typescript
readonly models: Models;
```

**Purpose:**
Provides access to model management functionalities.

**Return Value:**

- `Models` - An object providing methods for interacting with models. Further documentation for the `Models` object is needed.


## Property: `operations`

```typescript
readonly operations: Operations;
```

**Purpose:**
Provides access to long-running operation management functionalities.

**Return Value:**

- `Operations` - An object providing methods for interacting with long-running operations. Further documentation for the `Operations` object is needed.


## Property: `tunings`

```typescript
readonly tunings: Tunings;
```

**Purpose:**
Provides access to tuning management functionalities.

**Return Value:**

- `Tunings` - An object providing methods for interacting with tunings. Further documentation for the `Tunings` object is needed.


## Property: `vertexai`

```typescript
readonly vertexai: boolean;
```

**Purpose:**
Indicates whether the SDK is configured to use the Vertex AI API.

**Return Value:**

- `boolean` - `true` if using Vertex AI, `false` if using the Gemini API.


## Environment Variables

- **`GEMINI_API_KEY`**:
    - **Display Name:** Gemini API Key
    - **Description:** The API key for authenticating with the Gemini API.  This is required when using the Gemini API (`vertexai: false`).
    - **Required:**  When `vertexai` is `false`.
    - **Format:** String

- **`GOOGLE_PROJECT_ID`**:
    - **Display Name:** Google Cloud Project ID
    - **Description:** The ID of your Google Cloud project. This is required when using the Vertex AI API (`vertexai: true`).
    - **Required:** When `vertexai` is `true`.
    - **Format:** String

- **`GOOGLE_PROJECT_LOCATION`**:
    - **Display Name:** Google Cloud Project Location
    - **Description:** The location of your Google Cloud project resources. This is required when using the Vertex AI API (`vertexai: true`).
    - **Required:** When `vertexai` is `true`.
    - **Format:** String
