## Function: `streamObject`

Streams a typed, structured object for a given prompt and schema using a language model. It can be used to force the language model to return structured data, suitable for tasks like information extraction, synthetic data generation, or classification.

**Purpose:**

This function facilitates generating structured data from a language model by leveraging schemas. It supports streaming the output, allowing for real-time processing of the generated object.  It offers different output modes (object, array, no-schema) to cater to various use cases.

**Parameters:**

* `model`: **LanguageModel** (required)
    * The language model to use.  For example: `openai('gpt-4-turbo')`.  This parameter expects a configured language model instance.
* `output`: **'object' | 'array' | 'no-schema' | undefined** (optional, default: 'object')
    * Specifies the type of output to generate.
        * `'object'`: Generates a single JSON object based on the provided schema.
        * `'array'`: Generates a JSON array where each element conforms to the provided schema.
        * `'no-schema'`: Generates a JSON object or array without schema validation.
* `mode`: **'auto' | 'json' | 'tool'** (optional, default: 'auto' for 'object' output, 'json' for 'no-schema' output)
    * The mode to use for object generation.  Not all models support all modes.
        * `'auto'`: Automatically selects the appropriate mode.
        * `'json'`:  Instructs the model to generate JSON output directly. Required for 'no-schema' output.
        * `'tool'`: Uses a tool-calling mechanism for object generation.
* `schema`: **Zod Schema | JSON Schema** (optional)
    * The schema that describes the structure of the object to generate.  This is used for guiding the model and validating the output.  You can provide a Zod schema or a JSON schema (using the `jsonSchema` function). In 'array' mode, the schema describes the structure of each array element. Not available with 'no-schema' output.
* `schemaName`: **string | undefined** (optional)
    * Optional name for the output. Used by some providers for additional guidance. Not available with 'no-schema' output.
* `schemaDescription`: **string | undefined** (optional)
    * Optional description of the output. Used by some providers for additional guidance. Not available with 'no-schema' output.
* `system`: **string** (required)
    * The system prompt to guide the model's behavior.
* `prompt`: **string** (required)
    * The input prompt to generate the object from.
* `messages`: **Array<CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage> | Array<UIMessage>** (required)
    * A list of messages representing a conversation. Automatically converts UI messages from the `useChat` hook.  Each message type has a specific structure (detailed below).
* `maxTokens`: **number | undefined** (optional)
    * Maximum number of tokens to generate.
* `temperature`: **number | undefined** (optional)
    * Temperature setting for controlling the randomness of the output.
* `topP`: **number | undefined** (optional)
    * Nucleus sampling, an alternative to temperature for controlling randomness.
* `topK`: **number | undefined** (optional)
    * Samples from the top K most likely tokens.
* `presencePenalty`: **number | undefined** (optional)
    * Penalty for repeating information already present in the prompt.
* `frequencyPenalty`: **number | undefined** (optional)
    * Penalty for repeating the same words or phrases.
* `seed`: **number | undefined** (optional)
    * Seed for random sampling, enabling deterministic results if supported.
* `maxRetries`: **number | undefined** (optional, default: 2)
    * Maximum number of retries for failed requests.
* `abortSignal`: **AbortSignal | undefined** (optional)
    * An abort signal to cancel the request.
* `headers`: **Record<string, string> | undefined** (optional)
    * Additional HTTP headers for the request.
* `experimental_telemetry`: **TelemetrySettings | undefined** (optional)
    * Experimental telemetry configuration.
* `providerOptions`: **Record<string, Record<string, JSONValue>> | undefined** (optional)
    * Provider-specific options.
* `onError`: **(event: OnErrorResult) => Promise<void> | void | undefined** (optional)
    * Callback function for handling errors during streaming.
* `onFinish`: **(result: OnFinishResult) => void | undefined** (optional)
    * Callback function invoked when the LLM response is complete.


**Return Value:**

An object containing the following:

* `usage`: **Promise<CompletionTokenUsage>**
    * Resolves with token usage information when the response is finished.
* `object`: **Promise<T>**
    * Resolves with the generated object (typed according to the schema) when the response is finished.
* `partialObjectStream`: **AsyncIterableStream<DeepPartial<T>>**
    * A stream of increasingly complete partial objects.
* `elementStream`: **AsyncIterableStream<ELEMENT>**
    * A stream of array elements (only available in "array" mode).
* `textStream`: **AsyncIterableStream<string>**
    * A stream of text chunks representing the JSON output.
* `fullStream`: **AsyncIterableStream<ObjectStreamPart<T>>**
    * A stream of various events, including partial objects, errors, and finish events.
* `pipeTextStreamToResponse`: **(response: ServerResponse, init?: ResponseInit) => void**
    * Writes the text stream to a Node.js response object.
* `toTextStreamResponse`: **(init?: ResponseInit) => Response**
    * Creates a text stream response.


**Message Types (for `messages` parameter):**

* **CoreSystemMessage:** `{ role: 'system', content: string }`
* **CoreUserMessage:** `{ role: 'user', content: string | Array<TextPart | ImagePart | FilePart> }`
* **CoreAssistantMessage:** `{ role: 'assistant', content: string | Array<TextPart | ReasoningPart | RedactedReasoningPart | ToolCallPart> }`
* **CoreToolMessage:** `{ role: 'tool', content: Array<ToolResultPart> }`
* **(Nested Message Part Types):**  `TextPart`, `ImagePart`, `FilePart`, `ReasoningPart`, `RedactedReasoningPart`, `ToolCallPart`, `ToolResultPart` - These are further nested object types within the message content and have their own specific fields (refer to the original documentation for details).

**Other Types:**

* **TelemetrySettings:** `{ isEnabled?: boolean; recordInputs?: boolean; recordOutputs?: boolean; functionId?: string; metadata?: Record<string, any>; }`
* **OnErrorResult:** `{ error: unknown }`
* **OnFinishResult:** `{ usage: CompletionTokenUsage; providerMetadata: Record<string, Record<string, JSONValue>> | undefined; object: T | undefined; error: unknown | undefined; warnings: Warning[] | undefined; response?: Response }`
* **CompletionTokenUsage:** `{ promptTokens: number; completionTokens: number; totalTokens: number; providerMetadata?: Record<string, Record<string, JSONValue>>; }`
* **Response:** `{ id: string; model: string; timestamp: Date; headers?: Record<string, string>; request?: Promise<RequestMetadata>; }`
* **RequestMetadata:** `{ body: string }`
* **ResponseMetadata:** `{ id: string; model: string; timestamp: Date; headers?: Record<string, string>; }`
* **ResponseInit:** `{ status?: number; statusText?: string; headers?: Record<string, string>; }`
* **ObjectStreamPart<T>**: This is a union type that can be `ObjectPart`, `TextDeltaPart`, `ErrorPart`, or `FinishPart`. Each of these has its own specific fields.


**Examples:**

Refer to the examples provided in the original documentation for "Example: stream an object using a schema", "Example: stream an array using a schema", and "Example: generate JSON without a schema".  These examples demonstrate different usage patterns for `streamObject`, including using schemas, generating arrays, and handling JSON output without schema validation.  They also showcase how to consume the resulting streams.
