# @microfox/tool-kit

This package provides a way to create a tool set from an OpenAPI schema that can be used with AI models.

## Installation

```bash
npm install @microfox/tool-kit
```

## Usage

First, you need to import `createOpenAPIToolsClient` from the package and a streaming text utility from your preferred AI library. This example uses a generic `streamText` function.

```javascript
import { createOpenAPIToolsClient } from '@microfox/tool-kit';
import { streamText } from 'ai'; // or 'google-generative-ai', etc.
import { models } from 'some-ai-library'; // Placeholder for actual library
```

You'll need an OpenAPI schema object and the base URL for your API.

```javascript
const docData = {
  // Your OpenAPI schema here
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
  },
  paths: {
    '/users/{userId}': {
      get: {
        summary: 'Get a user by ID',
        operationId: 'getUserById',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'A user object',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const baseUrl = 'https://api.example.com';
```

Now, create the client and the tool set. The `disableAllExecutions: true` option configures the tools to require user approval before execution.

```javascript
const thisClient = await createOpenAPIToolsClient({
  schema: docData,
  baseUrl: baseUrl,
});

const toolSet = await thisClient.tools({ disableAllExecutions: true });
```

The `toolSet.tools` object can then be passed to your AI model.

Here's a full example of how to use it with `streamText`:

```javascript
import { createOpenAPIToolsClient } from '@microfox/tool-kit';
import { streamText } from 'ai'; // or your preferred library
import { models } from 'some-ai-library'; // Placeholder

async function main() {
  const docData = {
    // A sample OpenAPI schema
    openapi: '3.0.0',
    info: {
      title: 'Sample API',
      version: '1.0.0',
    },
    paths: {
      '/example': {
        get: {
          summary: 'An example endpoint',
          operationId: 'getExample',
          responses: {
            200: {
              description: 'Successful response',
            },
          },
        },
      },
    },
  };

  const baseUrl = 'https://api.example.com';

  const thisClient = await createOpenAPIToolsClient({
    schema: docData,
    baseUrl: baseUrl,
  });

  const toolSet = await thisClient.tools({ disableAllExecutions: true });

  const taskInstanceMeta = { id: 'task-123', name: 'Example Task' };
  const processedMessages = [
    { role: 'user', content: 'Can you call the example endpoint?' },
  ];

  const msg = streamText({
    model: models.googleGeminiPro, // or your preferred model
    system: `
      You are a helpful assistant that can answer questions in regards to the current task.

      The entire task Information is here : ${JSON.stringify(taskInstanceMeta)}

      Call the tools as needed in order to answer the users query or perform user requested actions.
      Available tools: ${Object.keys(toolSet.tools).join(', ')}

      Before calling the above tools, make sure you give some contextual text info to the user, on why you need to use this tool, as all the above tools require user permissions. after outputting the hint message, you can directly execute the tool you need to call.

      If the tool has a lot of information, output into a neat markdown format.
    `,
    messages: processedMessages,
    tools: toolSet.tools,
    toolChoice: 'auto',
    maxSteps: 10,
    onError: error => {
      console.error(error);
    },
  });

  // Stream the response to the console
  for await (const chunk of msg.textStream) {
    process.stdout.write(chunk);
  }
}

main().catch(console.error);
```
