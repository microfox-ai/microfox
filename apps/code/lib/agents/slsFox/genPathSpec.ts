import { AiRouter } from '@microfox/ai-router';
import { z } from 'zod';
import { generateObject } from 'ai';
import dedent from 'dedent';
import { anthropic } from '@ai-sdk/anthropic';
import path from 'path';
import * as fs from 'fs';

export const genPathSpecAgent = new AiRouter<any, any, any>();

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
        .record(z.string(), z.any())
        .describe(
          'Parameters JSON schema. If the function takes a single object argument, this schema\'s type is "object". For all other cases (multiple arguments or single primitive argument), the type is "array", and it contains a \'properties\' object with the real argument names as keys.',
        ),
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
     - Identifying all parameters and their types.
     - Determining if the function takes a single object argument vs. other signatures.
     - Planning the OpenAPI request body schema based on the rules below.
     - Planning the OpenAPI responses schema.
  3. Criticize your plan and refine it to be specific to this task.
  4. Write complete, production-ready code with no TODOs or placeholders.

  ## Process
  Your task is to analyze function documentation and generate an OpenAPI path for the function:
  1. Generate a clear summary (one sentence).
  2. Generate a detailed description (2-3 sentences).
  3. Generate the 'parameters' JSON schema by strictly following the rules below.
  4. Generate a complete OpenAPI responses schema.

  ## CRITICAL ANALYSIS RULES FOR PARAMETERS SCHEMA:

  You MUST generate a JSON Schema for the function's arguments. The structure of this schema depends on the function's signature. Follow these rules precisely.

  ### Rule 1: Single Object Argument
  If the function takes **exactly one argument** AND that argument is an **object**, then the generated schema MUST have \`"type": "object"\`. The \`properties\` of the schema should be the properties of that single object argument.

  **Example (Single Object Argument):**
  For a function \`myFunc(options: { id: string, force: boolean })\`, the parameters schema MUST be:
  \`\`\`json
  {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "force": { "type": "boolean" }
    },
    "required": ["id"]
  }
  \`\`\`

  ### Rule 2: Multiple Arguments or Single Primitive Argument
  In ALL other cases (i.e., the function takes multiple arguments, OR it takes a single argument that is a primitive like a string or number), the generated schema MUST have \`"type": "array"\`. This schema MUST ALSO contain a \`properties\` object where the keys are the **actual names of the function arguments**.

  **Example (Multiple Arguments):**
  For a function \`myFunc(userId: string, text: string)\`, the parameters schema MUST be:
  \`\`\`json
  {
    "type": "array",
    "description": "Container for function arguments.",
    "properties": {
      "userId": {
        "type": "string",
        "description": "userId: The ID of the user."
      },
      "text": {
        "type": "string",
        "description": "text: The message content."
      }
    },
    "required": ["userId", "text"]
  }
  \`\`\`

  **Example (Single String Argument):**
  For a function \`myFunc(channelId: string)\`, the parameters schema MUST be:
  \`\`\`json
  {
    "type": "array",
    "description": "Container for function arguments.",
    "properties": {
      "channelId": {
        "type": "string",
        "description": "channelId: The ID of the channel."
      }
    },
    "required": ["channelId"]
  }
  \`\`\`

  ### Responses Schema:
  Generate complete OpenAPI responses with:
  - 200: Success response with appropriate schema
  - 400: Client error (bad request)
  - 500: Server error
  `;

  const userPrompt = dedent`Analyze this function documentation and generate the required specification following the rules precisely.

  **Function:** ${functionName}

  **Documentation:**
  \`\`\`markdown
  ${docContent}
  \`\`\`

  Please analyze the **Arguments** section carefully and generate:
  1. summary: One clear sentence describing what this function does.
  2. description: 2-3 sentences explaining the function's purpose and behavior.
  3. parameters: A JSON schema for the function's arguments. You must follow the rules:
     - If it's a single object argument, the schema type is "object".
     - Otherwise, the schema type is "array" and it must contain a "properties" field with the real argument names as keys.
  4. responses: Complete OpenAPI responses schema.

  It is critical that you follow the parameter schema generation rules exactly as specified.`;

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
