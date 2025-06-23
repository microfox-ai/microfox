import {
  generateText,
  streamText,
  CoreMessage,
  ToolSet,
  generateObject,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import 'dotenv/config';

import { createToolkit } from './client/Toolkit';
import { Toolkit } from './client/Toolkit';

// A minimal OpenAPI spec for the example
const petstoreSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Simple Petstore API',
    version: '1.0.0',
  },
  paths: {
    '/pets/{petId}': {
      delete: {
        operationId: 'deletePet',
        summary: 'Deletes a pet by ID',
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
              format: 'int64',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Pet deleted successfully',
          },
        },
      },
    },
  },
};

async function main() {
  console.log('Initializing client...');

  // 1. Create the client with a `getHumanIntervention` callback.
  // This callback decides if a tool call should be paused based on its name and args.
  const client = await createToolkit({
    schema: petstoreSpec as any,
    getHumanIntervention: async ({ toolName, args, toolCallId }) => {
      // For this example, pause any 'delete' operation.
      if (toolName.toLowerCase().includes('deletepet')) {
        console.log(
          `\n[HITL Check] Pausing tool call '${toolName}' with args: ${JSON.stringify(
            args,
          )}`,
        );
        return {
          shouldPause: true,
          args: {
            originalToolCallId: toolCallId,
            originalToolName: toolName,
            ui: {
              component: 'ApproveDeny',
              props: {
                title: `Approval Required: ${toolName}`,
                message: `Are you sure you want to delete pet with ID ${
                  (args as any).petId
                }?`,
              },
            },
          },
        };
      }
      return {
        shouldPause: false,
        args: undefined,
      }; // Don't pause other tools
    },
  });

  const tools = await client.tools();

  // --- generateText Example ---
  console.log('\n--- Running generateText Example ---');
  await generateTextExample(client, tools.tools);

  // --- streamText Example ---
  console.log('\n\n--- Running streamText Example ---');
  // await streamTextExample(client, tools.tools);
}

async function generateTextExample(client: Toolkit, tools: ToolSet) {
  const messages: CoreMessage[] = [
    {
      role: 'user',
      content: 'Please delete the pet with ID 10. It was a test entry.',
    },
  ];

  console.log(`User: ${messages[0].content}`);

  // 2. Get the prepareStep function from the client.
  const prepareStep = client.createHitlPrepareStep();

  // 3. Call generateText with the tools and the prepareStep function.
  const rawResult = await generateText({
    model: openai('gpt-4-turbo'),
    messages: messages,
    tools: tools,
    experimental_prepareStep: prepareStep,
  });

  // 4. Process the raw result to transform HITL markers into fake tool calls.
  const finalResult = client.generate(rawResult);

  // 5. Check for a human intervention request in the processed result.
  const humanInterventionCall = finalResult.toolCalls.find(tc =>
    client.isHumanLoop(tc),
  );

  if (humanInterventionCall) {
    const uiData = client.ui(humanInterventionCall);
    console.log(
      `\n[UI PROMPT] > Component: ${uiData.component}, Title: "${uiData.props.title}"`,
    );
  } else {
    // If no intervention was needed, the conversation is complete.
    console.log(`\nAssistant: ${finalResult.text}`);
  }
}

async function streamTextExample(client: Toolkit, tools: ToolSet) {
  let messages: CoreMessage[] = [
    { role: 'user', content: 'I need to remove the pet with id 12.' },
  ];

  console.log(); // Final newline for clean output
}

main().catch(console.error);
