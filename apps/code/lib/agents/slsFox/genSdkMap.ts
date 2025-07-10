import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import { generateObject } from 'ai';
import path from 'path';
import * as fs from 'fs';
import { anthropic } from '@ai-sdk/anthropic';
import { PackageInfo } from '@/types/PackageInfo';

export const genSdkMapAgent = new AiRouter();

const schema = z.object({
  packageName: z.string().describe('The name of the package (e.g., "google-sheets").'),
});

async function generateSDKInitContent(
  packageInfo: PackageInfo,
): Promise<string> {
  const schema = z.object({
    sdkInitCode: z
      .string()
      .describe('Complete TypeScript code for the sdkInit.ts file'),
  });

  const systemPrompt = `You are an expert TypeScript developer. Your task is to generate a complete \`sdkInit.ts\` file. This file exports a function \`sdkInit\` that takes a configuration object and returns a \`Record<string, Function>\` which maps function names to their bound SDK method implementations.

  Here is an example of the expected output file:
  \`\`\`typescript
  import { createSdk } from '@microfox/some-sdk';

  interface SDKConfig {
    constructorName: string;
    [key: string]: any;
  }

  export const sdkInit = (config: SDKConfig): Record<string, Function> => {
    const { constructorName, API_KEY, ...options } = config;

    if (!API_KEY) {
      throw new Error('API_KEY is required');
    }

    switch (constructorName) {
      case 'createSdk':
        const sdk = createSdk({
          apiKey: API_KEY,
          ...options,
        });
        const sdkMap: Record<string, Function> = {};
        sdkMap.functionOne = sdk.functionOne.bind(sdk);
        sdkMap.functionTwo = sdk.functionTwo.bind(sdk);
        return sdkMap;
      default:
        // Fallback or handle default case appropriately
        const defaultSdk = createSdk({
          apiKey: API_KEY,
          ...options,
        });
        const defaultSdkMap: Record<string, Function> = {};
        defaultSdkMap.functionOne = defaultSdk.functionOne.bind(defaultSdk);
        defaultSdkMap.functionTwo = defaultSdk.functionTwo.bind(defaultSdk);
        return defaultSdkMap;
    }
  };

  export { createSdk };
  \`\`\`
  
  ## Your Task:
  Generate the \`sdkInit.ts\` file by following these rules:
  
  1.  **Imports**: Import all necessary constructor functions from the package \`${packageInfo.name}\`.
  2.  **SDKConfig Interface**: Create an interface named \`SDKConfig\`. It should include \`constructorName: string\` and use \`[key: string]: any;\` to allow for other properties.
  3.  **sdkInit Function**:
      *   It must accept one argument, \`config: SDKConfig\`.
      *   The return type must be \`Record<string, Function>\`.
      *   Inside the function, destructure \`constructorName\` and all required credential keys from the \`config\` object.
      *   Implement a \`switch\` statement on \`constructorName\`.
      *   For each \`case\`, instantiate the corresponding SDK client.
      *   After instantiation, create a \`sdkMap: Record<string, Function> = {}\`.
      *   For **every** function listed in that constructor's functionalities, populate the \`sdkMap\`. For a function named \`exampleFunc\`, the entry should be \`sdkMap.exampleFunc = sdk.exampleFunc.bind(sdk);\`.
      *   Return the populated \`sdkMap\`.
      *   Include a \`default\` case that uses the first constructor as a fallback, performs the same mapping, and returns the map.
  4.  **Exports**: After the \`sdkInit\` function, re-export all the imported constructor functions.`;

  // Create a more detailed representation of constructors for the prompt
  const constructorDetails = packageInfo.constructors
    .map(c => {
      const requiredKeys = [
        ...(c.requiredKeys || []),
        ...(c.internalKeys || []),
        // ...(c.botConfig || []),
      ]
        .map(k => k.key)
        .join(', ');

      const functionalities = (c.functionalities || []).join(', ');

      return `- Constructor Name: ${c.name}
    - Required Keys: ${requiredKeys || 'None'}
    - Functionalities: ${functionalities || 'None'}`;
    })
    .join('\n');

  const userPrompt = `Generate the complete \`sdkInit.ts\` file for the following package:
  
  **Package Name:** \`${packageInfo.name}\`
  
  **Constructors and their functions:**
  ${constructorDetails}
  
  Please generate the complete \`sdkInit.ts\` file as per the instructions and example provided in the system prompt. Ensure all functionalities for each constructor are mapped correctly.`;

  try {
    const { object: result, usage } = await generateObject({
      model: anthropic('claude-3-5-sonnet-20240620'),
      system: systemPrompt,
      prompt: userPrompt,
      schema,
      maxRetries: 3,
    });

    return result.sdkInitCode;
  } catch (error) {
    console.error(`❌ Error generating SDK init content:`, error);
    throw error;
  }
}

genSdkMapAgent
  .actAsTool('/', {
    description: 'Generates the sdkInit.ts file content which maps SDK methods.',
    inputSchema: schema as any,
  })
  .agent('/', async (ctx) => {
    const { packageName } = ctx.request

    try {
      const sdkInitContent = await generateSDKInitContent(ctx.state[packageName].packageInfo);
      fs.writeFileSync(path.join(ctx.state[packageName].slsDir, 'src', 'sdkInit.ts'), sdkInitContent);
      console.log('✅ Generated sdkInit.ts');
      ctx.response.write({
        type: 'data-text',
        data: sdkInitContent,
      });
    } catch (error: any) {
      ctx.response.write({ type: 'text', text: `Error generating sdkInit.ts content: ${error.message}` });
    }
  });
