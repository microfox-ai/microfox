# Supported Models

This document lists the models supported by the `@microfox/ai-provider-vertex` package.

## Language Models

### Google

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming |
| :--- | :---: | :---: | :---: | :---: |
| `gemini-2.0-flash-001` | - | - | - | - |
| `gemini-2.0-flash-exp` | - | - | - | - |
| `gemini-1.5-flash` | ✅ | ✅ | ✅ | ✅ |
| `gemini-1.5-pro` | ✅ | ✅ | ✅ | ✅ |

### Anthropic on Vertex

| Model | Image Input | Object Generation | Tool Usage | Tool Streaming | Computer Use |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `claude-3-7-sonnet@20250219` | - | - | - | - | - |
| `claude-3-5-sonnet-v2@20241022`| - | - | - | - | - |
| `claude-3-5-sonnet@20240620` | ✅ | ✅ | ✅ | ✅ | - |
| `claude-3-5-haiku@20241022` | - | - | - | - | - |
| `claude-3-sonnet@20240229` | ✅ | ✅ | ✅ | ✅ | - |
| `claude-3-haiku@20240307` | ✅ | ✅ | ✅ | ✅ | - |
| `claude-3-opus@20240229` | ✅ | ✅ | ✅ | ✅ | - |

*Note: Model capabilities are based on information from the [AI SDK Documentation](https://ai-sdk.dev/providers/ai-sdk-providers/google-vertex) and may be subject to change.*

## Embedding Models

| Model | Max Values Per Call | Parallel Calls |
| :--- | :---: | :---: |
| `text-embedding-004` | 2048 | - |

## Image Generation Models

| Model | Aspect Ratios |
| :--- | :--- |
| `imagen-3.0-generate-002` | 1:1, 3:4, 4:3, 9:16, 16:9 |
| `imagen-3.0-fast-generate-001`| 1:1, 3:4, 4:3, 9:16, 16:9 | 