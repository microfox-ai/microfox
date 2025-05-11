## Function: `valibotSchema`

Converts a Valibot schema into a JSON schema object compatible with the AI SDK. This function takes a Valibot schema as input and returns a typed schema that can be used for generating structured data and in tools.  `valibotSchema` is currently experimental.

**Purpose:**

To bridge the gap between Valibot schemas and the AI SDK, allowing developers to leverage Valibot for schema definition and validation within the AI SDK's functionalities like structured data generation and tool usage.

**Parameters:**

- `valibotSchema`: GenericSchema<unknown, T> - The Valibot schema definition.  This parameter is required.  It represents the Valibot schema that needs to be converted into an AI SDK compatible schema.  The `GenericSchema` type is a generic type from Valibot representing a schema.  The `unknown` type argument represents the input type to the schema, and the `T` type argument represents the output type of the schema after validation.  For example, if the schema validates that an input is a string, `unknown` would be the input type and `string` would be the output type `T`.


**Return Value:**

- `Schema`: object - An AI SDK compatible `Schema` object. This object contains both the JSON schema representation and validation functionality derived from the provided Valibot schema.  The structure of the returned `Schema` object is not explicitly defined in the provided context, but it's implied to be an internal type within the AI SDK that facilitates structured data handling and tool integration.


**Examples:**

```typescript
// Example 1: Basic usage with a simple object schema
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, array } from 'valibot';

const recipeSchema = valibotSchema(
  object({
    name: string(),
    ingredients: array(
      object({
        name: string(),
        amount: string(),
      }),
    ),
    steps: array(string()),
  }),
);

// Example 2: Using the generated schema (Illustrative -  Schema usage not explicitly defined in provided context)
// Assuming the AI SDK has a function like 'generateStructuredData' that accepts the Schema object
// const generatedData = generateStructuredData(recipeSchema, { /* input data */ });

// Example 3:  More complex schema with different types (Illustrative)
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, number, boolean, array, union, literal } from 'valibot';

const complexSchema = valibotSchema(
  object({
    title: string(),
    count: number(),
    isActive: boolean(),
    tags: array(string()),
    status: union([literal('pending'), literal('active'), literal('completed')]),
    details: object({
      description: string(),
      value: number(),
    }),
  }),
);


// Example 4: Handling optional fields (Illustrative)
import { valibotSchema } from '@ai-sdk/valibot';
import { object, string, number, optional } from 'valibot';

const optionalSchema = valibotSchema(
  object({
    name: string(),
    age: optional(number()),
  }),
);

```


