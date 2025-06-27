## Function: `jsonSchema`

Creates a JSON schema object compatible with the AI SDK. This is an alternative to Zod schemas for defining and validating structured data, and is useful for dynamic schemas (e.g., from OpenAPI definitions).

### Purpose

To define and validate structured data using the JSON Schema standard. It can be used with `generateObject` and `streamObject`, and for defining tool parameters.

### Parameters

- `schema`: `JSONSchema7` - The JSON Schema 7 definition. (Required)
- `options`: `SchemaOptions` - Optional.
  - `validate`: `(value: unknown) => { success: true; value: OBJECT } | { success: false; error: Error }` - An optional custom validation function.

### Return Value

- A JSON schema object that can be used in the AI SDK.

### Examples

```typescript
import { generateObject, jsonSchema, streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';

// Example 1: Basic schema
const userSchema = jsonSchema({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
  },
  required: ['name'],
});

// Example 2: Using the schema with generateObject
const { object: user } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: userSchema,
  prompt: 'Generate a user profile for a 30-year-old named Alex.',
});

// Example 3: Using the schema with streamObject
const { partialObjectStream } = await streamObject({
  model: openai('gpt-4-turbo'),
  schema: userSchema,
  prompt: 'Generate another user profile for a designer named Jane.',
});

for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```
