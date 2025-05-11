## Type: `CoreMessage`

Represents the fundamental message structure used with AI SDK Core functions. It encompasses various message types that can be used in the `messages` field of any AI SDK Core functions.  You can access the Zod schema for `CoreMessage` with the `coreMessageSchema` export.


### CoreMessage Types

#### `CoreSystemMessage`

A system message that can contain system information.  Using the "system" property instead of a system message is recommended to enhance resilience against prompt injection attacks.

```typescript
type CoreSystemMessage = {
  role: 'system';
  content: string;
};
```

- **`role`**: (string) Always set to 'system'.
- **`content`**: (string) The system message content.  Can be any string value.

You can access the Zod schema for `CoreSystemMessage` with the `coreSystemMessageSchema` export.


#### `CoreUserMessage`

A user message that can contain text or a combination of text, images, and files.

```typescript
type CoreUserMessage = {
  role: 'user';
  content: UserContent;
};

type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

- **`role`**: (string) Always set to 'user'.
- **`content`**: (UserContent) The user message content. Can be a string or an array of `TextPart`, `ImagePart`, and `FilePart` objects.

You can access the Zod schema for `CoreUserMessage` with the `coreUserMessageSchema` export.

##### `UserContent` Types:
###### `TextPart`
```typescript
export interface TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
}
```
- **`type`**: (string) Always set to 'text'.
- **`text`**: (string) The text content. Can be any string value.

###### `ImagePart`
```typescript
export interface ImagePart {
  type: 'image';
  /**
   * Image data. Can either be:
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the image
   */
  image: DataContent | URL;
  /**
   * Optional mime type of the image.
   * We recommend leaving this out as it will be detected automatically.
   */
  mimeType?: string;
}
```
- **`type`**: (string) Always set to 'image'.
- **`image`**: (DataContent | URL) The image data. Can be a base64 encoded string, a Uint8Array, an ArrayBuffer, a Buffer, or a URL pointing to the image.
- **`mimeType`**: (string, optional) The MIME type of the image. This is optional and will be detected automatically if not provided.

###### `FilePart`
```typescript
export interface FilePart {
  type: 'file';
  /**
   * File data. Can either be:
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the file
   */
  data: DataContent | URL;
  /**
   * Mime type of the file.
   */
  mimeType: string;
}
```
- **`type`**: (string) Always set to 'file'.
- **`data`**: (DataContent | URL) The file data. Can be a base64 encoded string, a Uint8Array, an ArrayBuffer, a Buffer, or a URL pointing to the file.
- **`mimeType`**: (string) The MIME type of the file.


#### `CoreAssistantMessage`

An assistant message that can contain text, tool calls, or a combination of both.

```typescript
type CoreAssistantMessage = {
  role: 'assistant';
  content: AssistantContent;
};

type AssistantContent = string | Array<TextPart | ToolCallPart>;
```

- **`role`**: (string) Always set to 'assistant'.
- **`content`**: (AssistantContent) The assistant message content. Can be a string or an array of `TextPart` and `ToolCallPart` objects.

You can access the Zod schema for `CoreAssistantMessage` with the `coreAssistantMessageSchema` export.

##### `AssistantContent` Types:
###### `ToolCallPart`
```typescript
export interface ToolCallPart {
  type: 'tool-call';
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  args: unknown;
}
```
- **`type`**: (string) Always set to 'tool-call'.
- **`toolCallId`**: (string) The ID of the tool call. Used to match the tool call with the tool result.  Should be a unique identifier.
- **`toolName`**: (string) The name of the tool being called. Should be a valid tool name.
- **`args`**: (unknown) The arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.


#### `CoreToolMessage`

A tool message that contains the result of one or more tool calls.

```typescript
type CoreToolMessage = {
  role: 'tool';
  content: ToolContent;
};

type ToolContent = Array<ToolResultPart>;
```

- **`role`**: (string) Always set to 'tool'.
- **`content`**: (ToolContent) An array of `ToolResultPart` objects, representing the results of tool calls.

You can access the Zod schema for `CoreToolMessage` with the `coreToolMessageSchema` export.

##### `ToolContent` Type:
###### `ToolResultPart`
```typescript
export interface ToolResultPart {
  type: 'tool-result';
  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call. This is a JSON-serializable object.
   */
  result: unknown;
  /**
   * Multi-part content of the tool result. Only for tools that support multipart results.
   */
  experimental_content?: ToolResultContent;
  /**
   * Optional flag if the result is an error or an error message.
   */
  isError?: boolean;
}
```
- **`type`**: (string) Always set to 'tool-result'.
- **`toolCallId`**: (string) The ID of the tool call that this result is associated with. Should match the `toolCallId` in the corresponding `ToolCallPart`.
- **`toolName`**: (string) The name of the tool that generated this result.
- **`result`**: (unknown) The result of the tool call. This is a JSON-serializable object.
- **`experimental_content`**: (ToolResultContent, optional) Multi-part content of the tool result. Only for tools that support multipart results.
- **`isError`**: (boolean, optional) Indicates whether the result is an error.


###### `ToolResultContent`
```typescript
export type ToolResultContent = Array<
| {
    type: 'text';
    text: string;
  }
| {
    type: 'image';
    data: string; // base64 encoded png image, e.g. screenshot
    mimeType?: string; // e.g. 'image/png';
  }
>;
```
- An array of objects, each with a `type` property.
    - If `type` is 'text':
        - **`text`**: (string) The text content.
    - If `type` is 'image':
        - **`data`**: (string) Base64 encoded image data.
        - **`mimeType`**: (string, optional) The MIME type of the image (e.g., 'image/png').


No examples provided as this is a type definition.  Refer to the documentation of functions that use `CoreMessage` for usage examples.
