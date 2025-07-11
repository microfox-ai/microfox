import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import { generateObject } from 'ai';
import dedent from 'dedent';
import { anthropic } from '@ai-sdk/anthropic';
import path from 'path';
import * as fs from 'fs';

export const genPathSpecAgent = new AiRouter();

const schema = z.object({
  functionName: z
    .string()
    .describe('The name of the function to generate the spec for.'),
  packageName: z.string().describe('The name of the package.'),
});

async function generateOpenAPIPath(
  functionName: string,
  docContent: string,
  constructors: any[],
): Promise<any> {

  const schema = z
    .object({
      summary: z
        .string()
        .describe('One clear sentence describing what this function does'),
      description: z
        .string()
        .describe('2-3 sentences explaining the function purpose and behavior'),
      parameters: z
        .object({
          type: z.literal('object').describe('Type must be object'),
          description: z.string().describe('Description of the parameters object'),
          properties: z.record(z.any()).describe('Properties of the object'),
          required: z.array(z.string()).optional().describe('Required properties'),
        })
        .describe('Parameters object schema for the function arguments'),
      responses: z
        .record(
          z.object({
            description: z.string().describe('Response description'),
            content: z
              .record(
                z.object({
                  schema: z.any().describe('Response schema'),
                }),
              )
              .optional()
              .describe('Response content'),
          }),
        )
        .describe('OpenAPI responses object'),
    })
    .catchall(z.any());

  const systemPrompt = dedent`You are an expert at analyzing function documentation and generating OpenAPI specifications.


  ## Principles
  1. First carefully analyze the function documentation
  2. Plan what needs to be done, including:
     - Identifying ALL parameters of the function
     - Planning the OpenAPI request body schema based on the parameters
     - Planning the OpenAPI responses schema for the function
  3. Criticize your plan and refine it to be specific to this task
  4. Write complete, production-ready code with no TODOs or placeholders
  5. Recheck your code for any linting or TypeScript errors


  ## Process
  Your task is to analyze function documentation and generate OpenAPI path for the function:
  1. Generate a clear summary (one sentence)
  2. Generate a detailed description (2-3 sentences)
  3. Generate a single 'parameters' JSON schema object that represents all of the function's arguments.
  4. Generate a complete OpenAPI responses schema

  ## CRITICAL ANALYSIS RULES:

  ### Parameters Structure:
  The 'parameters' property you generate should be a single JSON Schema object representing the function's arguments. Typically, this will be an object with properties for each argument.
  - If the function takes a single object as an argument, model that object's properties.
  - If the function takes multiple arguments, model them as properties of a single object.

  **Example:**
  \`\`\`json
  {
    "type": "object",
    "description": "Configuration object containing all function parameters.",
    "properties": {
      "param1": { "type": "string", "description": "First parameter description." },
      "param2": { "type": "number", "description": "Second parameter description." },
      "param3": { 
        "type": "object", 
        "properties": { "nested": { "type": "boolean" } }
      }
    },
    "required": ["param1"]
  }
  \`\`\`


  ### Responses Schema:
  Generate complete OpenAPI responses with:
  - 200: Success response with appropriate schema
  - 400: Client error (bad request)
  - 500: Server error
  - and any other status codes that are relevant to the function
  `;

  const userPrompt = dedent`Analyze this function documentation and generate the required specification:

  **Function:** ${functionName}

  **Documentation:**
  \`\`\`markdown
  ${docContent}
  \`\`\`

  Please analyze the Parameters section carefully and generate:
  1. summary: One clear sentence describing what this function does
  2. description: 2-3 sentences explaining the function's purpose and behavior
  3. parameters: A single JSON schema object representing the function's arguments, with type "object" and properties for each argument.
  4. responses: Complete OpenAPI responses schema with 200, 400, 500 status codes and any other status codes that are relevant to the function

  Focus on the parameter structure - create a single object that encapsulates all parameters.`;

  try {
    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-20240620'),
      system: systemPrompt,
      prompt: userPrompt,
      schema,
      maxRetries: 3,
    });


    // Build the complete OpenAPI path from AI-generated content + package info
    let aiContent = result.object;

    return {
      post: {
        operationId: functionName,
        summary: aiContent.summary,
        description: aiContent.description,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  body: {
                    type: 'object',
                    description: `Body of the ${functionName} sls call`,
                    properties: {
                      arguments: aiContent.parameters,
                      constructor: {
                        type: 'string',
                        description: 'Name of the constructor to use.',
                        enum: constructors.map(c => c.name),
                      },
                    },
                    required: ['arguments'],
                  },
                },
              },
            },
          },
        },
        responses: aiContent.responses,
      },
    };
  } catch (error) {
    console.error(
      `❌ Error generating OpenAPI path for ${functionName}:`,
      error,
    );
    throw `Error generating OpenAPI path for ${functionName}: ${error}`;
  }
}

genPathSpecAgent
  .actAsTool('/', {
    description: 'Generates the OpenAPI path specification for a single function.',
    inputSchema: schema as any,
  })
  .agent('/', async (ctx) => {
    const packageName = ctx.request.params?.packageName as string
    const functionName = ctx.request.params?.functionName as string
    console.log('genPathSpecAgent', packageName, functionName);
    try {
      const pathSpec = await generateOpenAPIPath(
        functionName,
        ctx.state[packageName].docs.functions[functionName],
        ctx.state[packageName].packageInfo.constructors.filter((c: any) => c.functionalities.includes(functionName)),
      );

      const pathKey = `/${functionName.replace(/\./g, '-')}`;

      // create/update function path spec openapi.json
      const openapiDir = path.join(ctx.state[packageName].slsDir, 'openapi');
      if (!fs.existsSync(openapiDir)) {
        fs.mkdirSync(openapiDir, { recursive: true });
      }
      const openapiPath = path.join(openapiDir, `${functionName}.json`);
      if (fs.existsSync(openapiPath)) {
        fs.unlinkSync(openapiPath);
      }
      fs.writeFileSync(openapiPath, JSON.stringify(pathSpec, null, 2));

      // create/update sls openapi.json
      const slsOpenapiPath = path.join(ctx.state[packageName].slsDir, 'openapi.json');
      const slsOpenapi = JSON.parse(fs.readFileSync(slsOpenapiPath, 'utf8'));
      slsOpenapi.paths[pathKey] = pathSpec;
      fs.writeFileSync(slsOpenapiPath, JSON.stringify(slsOpenapi, null, 2));

      ctx.response.write({
        type: 'data-json',
        data: { pathKey, pathSpec },
      });
    } catch (error: any) {
      ctx.response.write({ type: 'text', text: `Error generating path spec for ${functionName}: ${error.message}` });
    }
  });
