## Function: `extractReasoningMiddleware`

Extracts XML-tagged reasoning sections from AI-generated text and exposes them separately from the main text content. This allows separating the AI's reasoning process from its final output.

**Purpose:**

To isolate and expose the reasoning steps taken by an AI model during text generation, making the reasoning process transparent and accessible.

**Parameters:**

* `options`: object - Configuration options for the middleware.
    * `tagName`: string - **Required**. The name of the XML tag used to enclose the reasoning sections (without angle brackets).  For example, if the reasoning is enclosed in `<reasoning>` tags, the `tagName` would be "reasoning".
    * `separator`: string - **Optional**. The separator string used between the reasoning section and the main text content. Defaults to a newline character (`\n`).
    * `startWithReasoning`: boolean - **Optional**. Indicates whether the response always begins with a reasoning section, even if the initial XML tag is omitted. Defaults to `false`.


**Return Value:**

A `LanguageModelV1Middleware` function. This middleware function processes both streaming and non-streaming responses.  It modifies the response by:

1. Extracting content enclosed within the specified XML tags as the reasoning.
2. Removing the XML tags and the extracted reasoning content from the main text.
3. Adding a `reasoning` property to the result object. This property contains the extracted reasoning content.
4. Ensuring proper separation between text sections using the provided `separator`.

For streaming responses, the middleware works with the `LanguageModelV1StreamPart` type.  The `reasoning` property will be included in each stream part.

**Examples:**

```typescript
// Example 1: Basic usage
import { extractReasoningMiddleware } from 'ai';

const middleware = extractReasoningMiddleware({ tagName: 'reasoning' });

// Example usage with a language model (not shown here, as it's outside the scope of this function's documentation)
// The middleware would be applied to the language model's output.

// Example input text (from the language model, before middleware):
// <reasoning>I am thinking step by step.</reasoning>The answer is 42.

// Example output after middleware:
// {
//   text: 'The answer is 42.',
//   reasoning: 'I am thinking step by step.'
// }


// Example 2: Custom separator
import { extractReasoningMiddleware } from 'ai';

const middleware = extractReasoningMiddleware({ tagName: 'thought', separator: ' --- ' });

// Example input text (from the language model, before middleware):
// <thought>I considered various factors.</thought>---The final decision is...

// Example output after middleware:
// {
//   text: 'The final decision is...',
//   reasoning: 'I considered various factors.'
// }


// Example 3: Starting with reasoning and omitted initial tag
import { extractReasoningMiddleware } from 'ai';

const middleware = extractReasoningMiddleware({ tagName: 'reason', startWithReasoning: true, separator: '|' });

// Example input text (from the language model, before middleware):
// I am reasoning first.|The answer is later.

// Example output after middleware:
// {
//   text: 'The answer is later.',
//   reasoning: 'I am reasoning first.'
// }


// Example 4: Streaming response (simplified example)
import { extractReasoningMiddleware } from 'ai';

const middleware = extractReasoningMiddleware({ tagName: 'reasoning' });

// Example stream chunks (simplified):
// Chunk 1: '<reasoning>Thinking...</reasoning>The'
// Chunk 2: ' answer is '
// Chunk 3: '42.'

// Example output stream chunks after middleware (simplified):
// Chunk 1: { text: 'The', reasoning: 'Thinking...' }
// Chunk 2: { text: ' answer is ', reasoning: '' }
// Chunk 3: { text: '42.', reasoning: '' }

```
