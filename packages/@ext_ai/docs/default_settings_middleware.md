## Function: `defaultSettingsMiddleware`

Applies default settings to language model calls. This is useful for establishing consistent default parameters across multiple model invocations.

**Purpose:**

Provides a middleware function to set default parameters for language model calls, ensuring consistency and reducing boilerplate.  Explicitly provided parameters in individual calls will override these defaults.

**Parameters:**

* `options`: <object> An object containing the following properties:
    * `settings`: <object>  An object containing default parameter values to apply to language model calls. These can include any valid `LanguageModelV1CallOptions` properties and optional provider metadata.  The structure of `LanguageModelV1CallOptions` and `providerMetadata` are not explicitly defined in the provided context and should be referenced in the `ai` library documentation.


**Return Value:**

<object> A middleware object that performs the following actions:

* Merges the default settings with the parameters provided in each model call.
* Prioritizes explicitly provided parameters over defaults.
* Merges provider metadata objects.

**Examples:**

```typescript
// Example 1: Basic usage with temperature and maxTokens
import { streamText } from 'ai';
import { wrapLanguageModel } from 'ai';
import { defaultSettingsMiddleware } from 'ai';
import { openai } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: openai.ChatTextGenerator({ model: 'gpt-4' }),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxTokens: 800,
    },
  }),
});

const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
  // This will override the default temperature
  temperature: 0.8,
});


// Example 2: Using provider metadata
import { streamText } from 'ai';
import { wrapLanguageModel } from 'ai';
import { defaultSettingsMiddleware } from 'ai';
import { openai } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: openai.ChatTextGenerator({ model: 'gpt-4' }),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxTokens: 800,
      providerMetadata: {
        openai: {
          tags: ['production'],
        },
      },
    },
  }),
});

const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
});


// Example 3: Overriding default settings
import { streamText } from 'ai';
import { wrapLanguageModel } from 'ai';
import { defaultSettingsMiddleware } from 'ai';
import { openai } from 'ai';

const modelWithDefaults = wrapLanguageModel({
  model: openai.ChatTextGenerator({ model: 'gpt-4' }),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.5,
      maxTokens: 800,
    },
  }),
});

const result = await streamText({
  model: modelWithDefaults,
  prompt: 'Your prompt here',
  temperature: 0.2, // Overrides default temperature of 0.5
  maxTokens: 1000,   // Overrides default maxTokens of 800
});

```
