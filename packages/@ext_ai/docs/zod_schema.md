## Function: `zodSchema`

Converts a Zod schema into a JSON schema object compatible with the AI SDK. This function allows you to use Zod schemas for generating structured data and defining tool schemas.  While the AI SDK can automatically convert Zod schemas internally, this function provides explicit control over the conversion process, particularly for handling recursive schemas and enabling references.

**Purpose:**

To provide a convenient way to convert Zod schemas into a format usable by the AI SDK for structured data generation and tool definition.  It offers explicit control over the conversion process, allowing for optimization and handling of complex scenarios like recursive schemas.

**Parameters:**

* `zodSchema`: `z.Schema` (required)
    * The Zod schema definition to be converted. This parameter accepts any valid Zod schema object.
* `options`: object (optional)
    * Additional options for controlling the schema conversion.
        * `useReferences`: boolean (optional, default: `false`)
            * Enables support for schema references, which is crucial for handling recursive schemas (e.g., those using `z.lazy`). Note that not all language models and providers support schema references.

**Return Value:**

`Schema`

An AI SDK compatible `Schema` object. This object contains:

* `schema`: object - The generated JSON schema representation of the input Zod schema. This is the core schema used by the AI SDK.
* `validator`: function - A validation function derived from the Zod schema. This function can be used to validate data against the schema.


**Examples:**

```typescript
// Example 1: Basic usage with a simple schema
import { zodSchema } from 'ai';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string(),
  age: z.number().int().positive(),
  email: z.string().email(),
});

const aiSDKSchema = zodSchema(userSchema);

// Example 2: Using useReferences for recursive schemas
import { zodSchema } from 'ai';
import { z } from 'zod';

const baseCategorySchema = z.object({
  name: z.string(),
});

type Category = z.infer<typeof baseCategorySchema> & {
  subcategories: Category[];
};

const categorySchema: z.ZodType<Category> = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array()),
});

const aiSDKSchema = zodSchema(
  z.object({
    category: categorySchema,
  }),
  { useReferences: true },
);

// Example 3: Direct usage of Zod schema (automatic conversion)
import { generateObject } from 'ai';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
});

const product = await generateObject(productSchema, { /* other options */ });


// Example 4: Handling validation errors
import { zodSchema } from 'ai';
import { z } from 'zod';

const dataSchema = z.object({ value: z.number().positive() });
const sdkSchema = zodSchema(dataSchema);

try {
  const invalidData = { value: -1 };
  sdkSchema.validator(invalidData); // This will throw a ZodError
} catch (error) {
  console.error("Validation error:", error.message);
}

// Example 5: Accessing the JSON schema directly
import { zodSchema } from 'ai';
import { z } from 'zod';

const simpleSchema = z.object({ name: z.string() });
const sdkSchema = zodSchema(simpleSchema);

console.log(sdkSchema.schema); // Output the JSON schema object

```
