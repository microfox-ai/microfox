## Function: `simulateReadableStream`

Creates a ReadableStream that emits provided values sequentially with configurable delays. This is useful for testing streaming functionality or simulating time-delayed data streams.

**Purpose:**

To simulate a ReadableStream with custom delays between emitted chunks, facilitating testing and development of streaming components.

**Parameters:**

* `chunks`: array<`T`> - **Required**. An array of values to be emitted by the stream.  `T` represents the type of the elements in the array.
* `initialDelayInMs`: number | null | undefined - Optional. Initial delay in milliseconds before emitting the first value. Defaults to `0`. Set to `null` to skip the initial delay entirely.
* `chunkDelayInMs`: number | null | undefined - Optional. Delay in milliseconds between emitting each value. Defaults to `0`. Set to `null` to skip delays between chunks.


**Return Value:**

`ReadableStream<T>`. A ReadableStream that emits each value from the `chunks` array sequentially. The stream waits for `initialDelayInMs` before emitting the first value (if not `null`) and waits for `chunkDelayInMs` between emitting subsequent values (if not `null`). The stream closes automatically after all chunks have been emitted.  `T` represents the type of the elements emitted by the stream, matching the type of elements in the `chunks` array.


**Examples:**

```typescript
import { simulateReadableStream } from 'ai';

// Example 1: Basic Usage
const stream1 = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
});

// Example 2: With Delays
const stream2 = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: 1000, // Wait 1 second before first chunk
  chunkDelayInMs: 500, // Wait 0.5 seconds between chunks
});

// Example 3: Without Delays
const stream3 = simulateReadableStream({
  chunks: ['Hello', ' ', 'World'],
  initialDelayInMs: null, // No initial delay
  chunkDelayInMs: null, // No delay between chunks
});

// Example 4: With numbers
const stream4 = simulateReadableStream({
  chunks: [1, 2, 3],
  initialDelayInMs: 500,
  chunkDelayInMs: 250,
});

// Example 5: With objects
const stream5 = simulateReadableStream({
  chunks: [{ name: 'Alice' }, { name: 'Bob' }],
  initialDelayInMs: 100,
  chunkDelayInMs: 50,
});

// Example 6: Empty chunks array
const stream6 = simulateReadableStream({
  chunks: [],
});


// Example 7: Only initial delay
const stream7 = simulateReadableStream({
  chunks: ['Hello', 'World'],
  initialDelayInMs: 2000,
});

// Example 8: Only chunk delay
const stream8 = simulateReadableStream({
  chunks: ['Hello', 'World'],
  chunkDelayInMs: 100,
});
```
