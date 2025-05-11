## Function: `jsonSchema`

Creates a JSON schema object compatible with the AI SDK. This function allows you to define and validate structured data using JSON Schema, offering flexibility for dynamic situations (e.g., using OpenAPI definitions) or integration with other validation libraries. It serves as an alternative to Zod schemas.  It can be used with `generateObject` and `streamObject` to generate structured data and in tools.

**Purpose:**

To define and validate structured data within the AI SDK using JSON Schema. This is particularly useful when dealing with dynamic schemas or when integrating with external validation libraries.

**Parameters:**

* `schema`: JSONSchema7 - The JSON schema definition.  This parameter is **required**.  It follows the JSON Schema 7 specification.  See [https://json-schema.org/](https://json-schema.org/) for more details on JSON Schema 7.
* `options`: SchemaOptions - Additional options for the JSON schema. This parameter is **optional**.

**`SchemaOptions` Type:**

```typescript
type SchemaOptions<OBJECT extends object = object> = {
  validate?: (value: unknown) => { success: true; value: OBJECT } | { success: false; error: Error };
};
```

* `validate`: (value: unknown) => { success: true; value: OBJECT } | { success: false; error: Error } -  An optional validation function. If provided, this function will be used to validate values against the schema.  If the validation is successful, the function should return an object with `success: true` and the validated `value`. If validation fails, it should return an object with `success: false` and an `error` object.


**Return Value:**

A JSON schema object compatible with the AI SDK. The returned object is of type `JSONSchema7`.  This object can be used with functions like `generateObject` and `streamObject` and in tools.


**Examples:**

```typescript
// Example 1: Basic usage with a simple schema
import { jsonSchema } from 'ai';

const mySchema = jsonSchema({
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'integer' }
  },
  required: ['name']
});


// Example 2: Complex schema with nested objects and arrays
import { jsonSchema } from 'ai';

const recipeSchema = jsonSchema({
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              amount: { type: 'string' }
            },
            required: ['name', 'amount']
          }
        },
        steps: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['name', 'ingredients', 'steps']
    }
  },
  required: ['recipe']
});


// Example 3: Using a custom validation function
import { jsonSchema } from 'ai';

const userSchema = jsonSchema({
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' }
  },
  required: ['email']
}, {
  validate: (value) => {
    if (typeof value !== 'object' || value === null || !('email' in value) || typeof value.email !== 'string' || !value.email.endsWith('@example.com')) {
      return { success: false, error: new Error('Invalid email format. Must end with @example.com') };
    }
    return { success: true, value: value as { email: string } };
  }
});

// Example 4: Using the schema with generateObject
import { generateObject, jsonSchema } from 'ai';

const productSchema = jsonSchema({
  type: 'object',
  properties: {
    name: { type: 'string' },
    price: { type: 'number' }
  },
  required: ['name', 'price']
});

const product = await generateObject(productSchema, 'Generate a product.');


```
