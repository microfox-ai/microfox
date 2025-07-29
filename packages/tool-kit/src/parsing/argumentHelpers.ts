import { JsonSchema } from '@microfox/types';

/**
 * Merges additional properties into the 'body' part of a given JSON schema.
 * This function modifies the input schema directly, following specific rules for different 'body' types.
 *
 * @param {JsonSchema & { properties?: Record<string, any>; required?: string[] }} schema - The main JSON schema to modify. This object will be mutated.
 * @param {JsonSchema & { properties?: Record<string, any>; required?: string[] }} additionalSchema - The schema containing properties and required fields to add.
 */
export function addPropertiesToBody(
  schema: JsonSchema & {
    properties?: Record<string, any>;
    required?: string[];
  },
  additionalSchema: JsonSchema & {
    properties?: Record<string, any>;
    required?: string[];
  },
) {
  if (
    !additionalSchema.properties ||
    Object.keys(additionalSchema.properties).length === 0
  ) {
    return; // Nothing to add
  }

  // Ensure the top-level schema has a properties object
  if (!schema.properties) {
    schema.properties = {};
  }

  let bodySchema = schema.properties.body;

  // Case 1: Body schema doesn't exist, create it as an object.
  if (!bodySchema) {
    schema.properties.body = {
      type: 'object',
      properties: additionalSchema.properties,
      ...(additionalSchema.required && { required: additionalSchema.required }),
    };
    return;
  }

  // Case 2: Body schema is an object, append properties to it.
  if (bodySchema.type === 'object') {
    if (!bodySchema.properties) {
      bodySchema.properties = {};
    }
    bodySchema.properties = {
      ...bodySchema.properties,
      ...additionalSchema.properties,
    };

    if (additionalSchema.required) {
      if (!bodySchema.required) {
        bodySchema.required = [];
      }
      bodySchema.required = [
        ...new Set([...bodySchema.required, ...additionalSchema.required]),
      ];
    }
    return;
  }

  // Case 3: Body schema is an array. Append properties to the first object in 'items'.
  if (bodySchema.type === 'array' && bodySchema.items) {
    const itemsToModify = Array.isArray(bodySchema.items)
      ? bodySchema.items[0]
      : bodySchema.items;

    if (itemsToModify && itemsToModify.type === 'object') {
      if (!itemsToModify.properties) {
        itemsToModify.properties = {};
      }
      itemsToModify.properties = {
        ...itemsToModify.properties,
        ...additionalSchema.properties,
      };

      if (additionalSchema.required) {
        if (!itemsToModify.required) {
          itemsToModify.required = [];
        }
        itemsToModify.required = [
          ...new Set([...itemsToModify.required, ...additionalSchema.required]),
        ];
      }
    }
  }
}
