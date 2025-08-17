import { z } from 'zod';
import { JsonSchema } from '@microfox/types';

/**
 * Convert OpenAPI schema to Zod schema
 * Ensures that any property not in the required array is made optional
 * Ensures arrays have proper item schemas for AI SDK compatibility
 */
export function convertOpenApiSchemaToZod(schema: JsonSchema): z.ZodType {
  if (!schema.type) {
    return z.any();
  }

  switch (schema.type) {
    case 'string':
      let stringSchema = z.string();
      // Only use formats supported by Google AI API
      if (schema.format === 'date-time') {
        stringSchema = z.string().datetime();
      }
      if (schema.description) {
        stringSchema = stringSchema.describe(schema.description);
      }
      return stringSchema;

    case 'number':
    case 'integer':
      let numberSchema =
        schema.type === 'integer' ? z.number().int() : z.number();
      if (schema.description) {
        numberSchema = numberSchema.describe(schema.description);
      }
      return numberSchema;

    case 'boolean':
      let booleanSchema = z.boolean();
      if (schema.description) {
        booleanSchema = booleanSchema.describe(schema.description);
      }
      return booleanSchema;

    case 'array':
      // For arrays, always ensure we have a proper item schema
      let itemSchema: z.ZodType;

      if (!schema.items) {
        // Use passthrough object instead of z.record for better JSON schema generation
        itemSchema = z.object({}).passthrough();
      } else if (Array.isArray(schema.items)) {
        if (schema.items.length === 0) {
          itemSchema = z.object({}).passthrough();
        } else {
          const firstItemSchema = schema.items[0];
          if (!firstItemSchema) {
            itemSchema = z.object({}).passthrough();
          } else {
            itemSchema = convertOpenApiSchemaToZod(firstItemSchema);
          }
        }
      } else {
        itemSchema = convertOpenApiSchemaToZod(schema.items);
      }

      let arraySchema = z.array(itemSchema);
      if (schema.description) {
        arraySchema = arraySchema.describe(schema.description);
      }
      return arraySchema;

    case 'object':
      if (!schema.properties || Object.keys(schema.properties).length === 0) {
        // Use passthrough for better JSON schema generation
        return z.object({}).passthrough();
      }

      const shape: Record<string, z.ZodType> = {};

      // Convert all properties first
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        const propZodSchema = convertOpenApiSchemaToZod(propSchema);

        // Check if this property is required
        const isRequired = schema.required && schema.required.includes(key);
        if (isRequired) {
          shape[key] = propZodSchema;
        } else {
          shape[key] = propZodSchema.optional();
        }
      }

      let objectSchema = z.object(shape);
      if (schema.description) {
        objectSchema = objectSchema.describe(schema.description);
      }

      return objectSchema;

    default:
      return z.any();
  }
}
