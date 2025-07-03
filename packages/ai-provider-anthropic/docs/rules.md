## Language Model Capabilities

### Model Support Matrix

| Model                      | Image Input | Object Generation | Tool Usage | Tool Streaming | Reasoning |
| -------------------------- | ----------- | ----------------- | ---------- | -------------- | --------- |
| claude-4-opus-20250514     | ✅          | ✅                | ✅         | ✅             | ✅        |
| claude-4-sonnet-20250514   | ✅          | ✅                | ✅         | ✅             | ✅        |
| claude-3-7-sonnet-20250219 | ✅          | ✅                | ✅         | ✅             | ✅        |
| claude-3-5-sonnet-20241022 | ✅          | ✅                | ✅         | ✅             | ❌        |
| claude-3-5-sonnet-20240620 | ✅          | ✅                | ✅         | ✅             | ❌        |
| claude-3-5-haiku-20241022  | ✅          | ✅                | ✅         | ✅             | ❌        |
| claude-3-opus-20240229     | ✅          | ✅                | ✅         | ✅             | ❌        |
| claude-3-sonnet-20240229   | ✅          | ✅                | ✅         | ✅             | ❌        |
| claude-3-haiku-20240307    | ✅          | ✅                | ✅         | ✅             | ❌        |

### Special Features

- **Reasoning Support**: Available on claude-4-opus-20250514, claude-4-sonnet-20250514, and claude-3-7-sonnet-20250219 models
- **PDF Support**: Available on claude-3-5-sonnet-20241022 and newer models
- **Cache Control**: Available on all models with minimum cacheable prompt lengths:
  - 1024 tokens for Claude 3.7 Sonnet, Claude 3.5 Sonnet and Claude 3 Opus
  - 2048 tokens for Claude 3.5 Haiku and Claude 3 Haiku

### Computer Use Tools

The following built-in tools are available for computer interaction:

1. **Bash Tool**: Execute bash commands
2. **Text Editor Tool**: View and edit text files
3. **Computer Tool**: Control keyboard and mouse actions
