import { OpenAPIDoc, SchemaConfig } from './types';

/**
 * Parse and validate the schema configuration
 */
export async function parseSchema(
  config: SchemaConfig | OpenAPIDoc | string,
): Promise<OpenAPIDoc> {
  let parsedSchema: OpenAPIDoc;

  if (typeof config === 'string') {
    // Handle string as either JSON text or URL
    try {
      parsedSchema = JSON.parse(config);
    } catch (error) {
      // If it's not valid JSON, try to fetch it as a URL
      try {
        const response = await fetch(config);
        if (!response.ok) {
          throw new Error(`Failed to fetch schema from URL: ${config}`);
        }
        parsedSchema = await response.json();
      } catch (fetchError: any) {
        throw new Error(
          `Invalid schema JSON string and failed to fetch as URL: ${fetchError.message || String(fetchError)}`,
        );
      }
    }
  } else if (config && typeof config === 'object') {
    if ('type' in config) {
      // Handle SchemaConfig object
      if (
        config.type === 'object' &&
        config.schema &&
        typeof config.schema !== 'string'
      ) {
        parsedSchema = config.schema;
      } else if (
        config.type === 'text' &&
        config.schema &&
        typeof config.schema === 'string'
      ) {
        try {
          parsedSchema = JSON.parse(config.schema);
        } catch (error) {
          throw new Error('Invalid schema JSON string');
        }
      } else if (config.type === 'url' && config.url) {
        // Fetch from URL
        try {
          const response = await fetch(config.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch schema from URL: ${config.url}`);
          }
          parsedSchema = await response.json();
        } catch (error: any) {
          throw new Error(
            `Failed to fetch schema from URL: ${error.message || String(error)}`,
          );
        }
      } else {
        throw new Error(
          'Invalid schema configuration: missing required properties for the specified type',
        );
      }
    } else {
      // Assume it's a raw OpenAPIDoc object
      parsedSchema = config as OpenAPIDoc;
    }
  } else {
    throw new Error('Invalid schema configuration');
  }

  return parsedSchema;
}
