## Function: `smoothStream`

Creates a TransformStream for the `streamText` transform option to smooth out text streaming by buffering and releasing complete words or lines with configurable delays. This function enhances the reading experience during text streaming responses by presenting complete chunks of text rather than character by character output.  It handles non-text chunks, such as step-finish events, by passing them through immediately.

**Purpose:**

To improve the user experience of streaming text responses by buffering and releasing complete words or lines with configurable delays, creating a more natural reading flow.

**Parameters:**

* `delayInMs` (optional): `number | null`
    * The delay in milliseconds between outputting each chunk.
    * Defaults to 10ms.
    * Set to `null` to disable delays.
* `chunking` (optional): `"word" | "line" | RegExp | (buffer: string) => string | undefined | null`
    * Controls how the text is chunked for streaming.
    * `"word"`: Streams word by word (default).  Note: Word-based chunking may not work well with languages that don't use spaces as delimiters (e.g., Chinese, Japanese).
    * `"line"`: Streams line by line.
    * `RegExp`:  A regular expression to define custom chunk boundaries. The matched portion is streamed.
    * `(buffer: string) => string | undefined | null`: A custom callback function for chunking. The function receives the current buffer and should return the chunk to be streamed. Return `null` or `undefined` if no chunk is ready.

**Return Value:**

A `TransformStream`. This stream buffers incoming text, releases it in chunks according to the `chunking` parameter, and adds delays between chunks based on `delayInMs`. Non-text chunks are passed through directly.

**Examples:**

```typescript
import { smoothStream, streamText } from 'ai';

// Example 1: Minimal usage with default delay and word chunking
const result1 = streamText({
  model: 'someModel', // Replace with your model
  prompt: 'some prompt', // Replace with your prompt
  experimental_transform: smoothStream(),
});

// Example 2: Custom delay and line chunking
const result2 = streamText({
  model: 'someModel',
  prompt: 'some prompt',
  experimental_transform: smoothStream({
    delayInMs: 20,
    chunking: 'line',
  }),
});

// Example 3: Chunking with a regular expression (splitting on underscores)
const result3 = streamText({
  model: 'someModel',
  prompt: 'some_prompt_with_underscores',
  experimental_transform: smoothStream({
    chunking: /_+/, // Splits on underscores
  }),
});


// Example 4: Custom chunking callback (finding a specific string)
const result4 = streamText({
  model: 'someModel',
  prompt: 'Waiting for some string to appear.',
  experimental_transform: smoothStream({
    chunking: (text) => {
      const findString = 'some string';
      const index = text.indexOf(findString);
      if (index === -1) {
        return null; // No chunk ready yet
      }
      return text.slice(0, index + findString.length);
    },
  }),
});

// Example 5: Disabling delay
const result5 = streamText({
  model: 'someModel',
  prompt: 'some prompt',
  experimental_transform: smoothStream({
    delayInMs: null,
  }),
});


// Example 6: Handling non-latin languages (Chinese)
const result6 = streamText({
  model: 'someModel',
  prompt: '你好世界', // Hello World in Chinese
  experimental_transform: smoothStream({
    chunking: /[\u4E00-\u9FFF]|\S+\s+/, // Chunk Chinese characters
  }),
});

// Example 7: Handling non-latin languages (Japanese)
const result7 = streamText({
  model: 'someModel',
  prompt: 'こんにちは世界', // Hello World in Japanese
  experimental_transform: smoothStream({
    chunking: /[\u3040-\u309F\u30A0-\u30FF]|\S+\s+/, // Chunk Japanese characters
  }),
});

```
