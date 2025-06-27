## Language Model Capabilities

### Model Support Matrix

| Model                          | Image Input | Object Generation | Tool Usage | Tool Streaming |
| ------------------------------ | ----------- | ----------------- | ---------- | -------------- |
| gemini-2.5-pro-preview-05-06   | ✅          | ✅                | ✅         | ✅             |
| gemini-2.5-flash-preview-04-17 | ✅          | ✅                | ✅         | ✅             |
| gemini-2.5-pro-exp-03-25       | ✅          | ✅                | ✅         | ✅             |
| gemini-2.0-flash               | ✅          | ✅                | ✅         | ✅             |
| gemini-1.5-pro                 | ✅          | ✅                | ✅         | ✅             |
| gemini-1.5-pro-latest          | ✅          | ✅                | ✅         | ✅             |
| gemini-1.5-flash               | ✅          | ✅                | ✅         | ✅             |
| gemini-1.5-flash-latest        | ✅          | ✅                | ✅         | ✅             |
| gemini-1.5-flash-8b            | ✅          | ✅                | ✅         | ✅             |
| gemini-1.5-flash-8b-latest     | ✅          | ✅                | ✅         | ✅             |

### Special Features

- Search Grounding: Available on gemini-1.5-pro and newer models
- Dynamic Retrieval: Available on gemini-1.5-flash models (not supported with 8B variants)
- Image Generation: Supported by gemini-2.0-flash-exp
- Caching Support: Available on models/gemini-1.5-flash-001 and models/gemini-1.5-pro-001

## Embedding Models

### Model Capabilities

| Model              | Default Dimensions | Custom Dimensions |
| ------------------ | ------------------ | ----------------- |
| text-embedding-004 | 768                | ✅                |

### Task Types Support

- SEMANTIC_SIMILARITY: Optimized for text similarity
- CLASSIFICATION: Optimized for text classification
- CLUSTERING: Optimized for clustering texts
- RETRIEVAL_DOCUMENT: Optimized for document retrieval
- RETRIEVAL_QUERY: Optimized for query-based retrieval
- QUESTION_ANSWERING: Optimized for Q&A
- FACT_VERIFICATION: Optimized for fact checking
- CODE_RETRIEVAL_QUERY: Optimized for code retrieval

## Safety Settings

Available safety categories:

- HARM_CATEGORY_HATE_SPEECH
- HARM_CATEGORY_DANGEROUS_CONTENT
- HARM_CATEGORY_HARASSMENT
- HARM_CATEGORY_SEXUALLY_EXPLICIT

Threshold levels:

- HARM_BLOCK_THRESHOLD_UNSPECIFIED
- BLOCK_LOW_AND_ABOVE
- BLOCK_MEDIUM_AND_ABOVE
- BLOCK_ONLY_HIGH
- BLOCK_NONE

## Known Limitations

- Schema Limitations: Google Generative AI API uses a subset of OpenAPI 3.0 schema
- Not supported Zod features:
  - z.union
  - z.record
- Dynamic retrieval is not supported with 8B model variants
