import {
  generateText,
  streamText,
  CoreMessage,
  ToolSet,
  ToolCallPart,
  UIMessage,
  convertToModelMessages,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import 'dotenv/config';

import { createOpenApiToolset, OpenApiToolset } from './client/Toolset';

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
  const client = await createOpenApiToolset({
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
      return { shouldPause: false, args: undefined }; // Don't pause other tools
    },
  });

  const toolResult = await client.tools();
  const tools = toolResult.tools;

  // --- generateText Example ---
  console.log('\n--- Running generateText Example ---');
  await generateTextExample(client, tools);

  // --- streamText Example ---
  console.log('\n\n--- Running streamText Example ---');
  await streamTextExample(client, tools);
}

async function generateTextExample(client: OpenApiToolset, tools: ToolSet) {
  let messages: UIMessage[] = [
    {
      id: '1',
      role: 'user',
      parts: [
        {
          type: 'text',
          text: 'Please delete the pet with ID 10. It was a test entry.',
        },
      ],
    },
  ];

  console.log(`User: ${(messages[0].parts[0] as any).text}`);

  const rawResult = await generateText({
    model: openai('gpt-4-turbo'),
    messages: convertToModelMessages(messages),
    tools,
    stopWhen: client.createHitlStopStep(), // (s) => { return client.createHitlStopStep()(s)}
  });

  const finalResult = client.generate(rawResult);

  const humanInterventionCall = finalResult.toolCalls.find(tc =>
    client.isHumanLoop(tc),
  );

  if (humanInterventionCall) {
    const uiData = client.ui(humanInterventionCall);
    console.log(
      `[UI PROMPT] > Component: ${uiData.ui.component}, Title: "${uiData.ui.props.title}"`,
    );
    console.log('[SIMULATION] User clicks "Approve"');

    const parsedMessages = await client.parse(messages);

    const finalResponse = await generateText({
      model: openai('gpt-4-turbo'),
      messages: convertToModelMessages(parsedMessages),
      tools,
    });

    console.log(`\nAssistant: ${finalResponse.text}`);
  } else {
    // If no intervention was needed, the conversation is complete.
    console.log(`\nAssistant: ${finalResult.text}`);
  }
}

async function streamTextExample(client: OpenApiToolset, tools: ToolSet) {
  let messages: CoreMessage[] = [
    { role: 'user', content: 'I need to remove the pet with id 12.' },
  ];
  console.log(`User: ${messages[0].content}`);

  let result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    tools,
    stopWhen: client.createHitlStopStep(),
  });

  const stream = client.stream(result.fullStream as any);

  let assistantMessage: UIMessage = {
    id: '1',
    role: 'assistant',
    parts: [],
  };
  let humanInterventionCall: ToolCallPart | undefined;

  process.stdout.write('\nAssistant: ');
  for await (const part of stream) {
    if (part.type === 'text-delta') {
      process.stdout.write(part.textDelta);
      assistantMessage.parts.push({
        type: 'text',
        text: part.textDelta,
      });
    } else if (part.type === 'tool-call') {
      assistantMessage.parts.push(part);
      if (client.isHumanLoop(part)) {
        humanInterventionCall = part;
        const uiData = client.ui(part);
        console.log(
          `\n[UI PROMPT] > Component: ${uiData.ui.component}, Title: "${uiData.ui.props.title}"`,
        );
      }
    }
  }

  if (humanInterventionCall) {
    console.log('[SIMULATION] User clicks "Approve"');

    const parsedMessages = await client.parse([assistantMessage]);

    result = await streamText({
      model: openai('gpt-4-turbo'),
      messages: convertToModelMessages(parsedMessages),
      tools,
    });

    process.stdout.write('\nAssistant: ');
    for await (const part of result.fullStream as any) {
      if (part.type === 'text') {
        process.stdout.write(part.text);
      }
    }
  }

  console.log();
}

main().catch(console.error);
