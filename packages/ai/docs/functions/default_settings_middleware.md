## Function: `defaultSettingsMiddleware`

Creates a middleware that applies default settings to language model calls. This is useful for establishing consistent default parameters across multiple model invocations.

### Purpose

To provide a middleware for setting default parameters for language model calls, ensuring consistency and reducing boilerplate. Explicitly provided parameters in individual calls will override these defaults.

### Parameters

- `options`: object
  - `settings`: object - An object containing default parameter values to apply to language model calls. These can include any valid `CallSettings` properties, such as `temperature`, `maxOutputTokens`, etc.

### Return Value

- `LanguageModelV2Middleware`: A middleware object that can be applied to a language model using the `withMiddleware` method.

### Example

The middleware is applied to a model using the `.withMiddleware()` method.

```typescript
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { defaultSettingsMiddleware } from 'ai';

// Create a model with default settings
const modelWithDefaults = openai('gpt-4').withMiddleware(
  defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxOutputTokens: 800,
    },
  }),
);

// Use the model with defaults.
// The call will use temperature: 0.5 and maxOutputTokens: 800.
const result1 = await generateText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
});

// Override defaults in a specific call.
// This call will use temperature: 0.2 and maxOutputTokens: 1000.
const result2 = await generateText({
  model: modelWithDefaults,
  prompt: 'Another prompt',
  temperature: 0.2,
  maxOutputTokens: 1000,
});
```
