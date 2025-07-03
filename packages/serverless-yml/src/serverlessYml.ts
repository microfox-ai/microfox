import YAML from 'yaml';

// Validation function to check serverless.yml configuration
export const validateServerlessYML = (
  yamlContent: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  let isValid = true;

  try {
    const config = YAML.parse(yamlContent);

    // Check if functions section exists
    if (!config.functions) {
      errors.push('No functions section found in serverless.yml');
      isValid = false;
      return { isValid, errors };
    }

    // Check each function
    Object.entries(config.functions).forEach(
      ([functionName, functionConfig]: [string, any]) => {
        // Skip getDocs function as it's a special case
        if (functionName === 'getDocs') return;

        // Check if events exist
        if (!functionConfig.events || !Array.isArray(functionConfig.events)) {
          errors.push(`Function ${functionName} has no events defined`);
          isValid = false;
          return;
        }

        // Check if there's at least one HTTP event
        const hasHttpEvent = functionConfig.events.some(
          (event: any) => event.http,
        );
        if (!hasHttpEvent) {
          errors.push(`Function ${functionName} has no HTTP event defined`);
          isValid = false;
        }

        // Check if handler exists
        if (!functionConfig.handler) {
          errors.push(`Function ${functionName} has no handler defined`);
          isValid = false;
        }
      },
    );
  } catch (error) {
    errors.push(
      `Failed to parse serverless.yml: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
    isValid = false;
  }

  return { isValid, errors };
};
