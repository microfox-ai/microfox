## Type: `ModelMessage`

Represents the fundamental message structure used with the AI SDK. It encompasses various message types that can be used in the `messages` array of functions like `generateText` and `streamText`.

**Note:** The `Core...` message types (`CoreMessage`, `CoreSystemMessage`, etc.) are now deprecated. Please use the `Model...` types instead.

### Message Types

#### `SystemModelMessage`

A system message that contains instructions or context for the model.

```typescript
type SystemModelMessage = {
  role: 'system';
  content: string;
};
```

- **`role`**: `'system'`
- **`content`**: `string` - The content of the system message.

#### `UserModelMessage`

A message from the user. It can contain text, images, and files.

```typescript
type UserModelMessage = {
  role: 'user';
  content: UserContent;
};

type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

- **`role`**: `'user'`
- **`content`**: `UserContent` - The content of the user message.

##### `UserContent` Parts:

###### `TextPart`

```typescript
interface TextPart {
  type: 'text';
  text: string;
}
```

###### `ImagePart`

```typescript
interface ImagePart {
  type: 'image';
  image: DataContent | URL;
  mediaType?: string; // Optional IANA media type
}
```

###### `FilePart`

```typescript
interface FilePart {
  type: 'file';
  data: DataContent | URL;
  filename?: string;
  mediaType: string; // IANA media type
}
```

#### `AssistantModelMessage`

A message from the assistant (the AI model). It can contain text, tool calls, and reasoning steps.

```typescript
type AssistantModelMessage = {
  role: 'assistant';
  content: AssistantContent;
};

type AssistantContent =
  | string
  | Array<TextPart | FilePart | ReasoningPart | ToolCallPart>;
```

- **`role`**: `'assistant'`
- **`content`**: `AssistantContent` - The content of the assistant's message.

##### `AssistantContent` Parts:

###### `ReasoningPart`

```typescript
interface ReasoningPart {
  type: 'reasoning';
  text: string;
}
```

###### `ToolCallPart`

```typescript
interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
}
```

#### `ToolModelMessage`

A message that contains the result of a tool call.

```typescript
type ToolModelMessage = {
  role: 'tool';
  content: Array<ToolResultPart>;
};
```

- **`role`**: `'tool'`
- **`content`**: `Array<ToolResultPart>` - An array of tool results.

##### `ToolResultPart`

```typescript
interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError?: boolean;
  experimental_content?: ToolResultContent;
}
```

###### `ToolResultContent`

`experimental_content` can be an array of text and image parts, similar to `UserContent`.

```typescript
type ToolResultContent = Array<
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; /* base64 encoded */ mediaType?: string }
>;
```

Refer to the documentation of functions that use `ModelMessage` for usage examples.
