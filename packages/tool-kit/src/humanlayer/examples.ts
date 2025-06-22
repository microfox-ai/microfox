// You can save this as apps/web/utils/services/ToolHumanLayer.examples.ts

import { z } from 'zod';
import { Message, ToolSet } from 'ai';
import { DataStreamWriter } from 'ai';
import { processToolCalls, APPROVAL } from './process_layer';

// --- Common Setup for Both Examples ---

// 1. A sample toolset.
// Note that `getWeather` does not have an `execute` function, so it requires human confirmation.
const sampleTools: ToolSet = {
  getWeather: {
    description: 'Get the weather for a location',
    parameters: z.object({ location: z.string() }),
  },
};

// 2. Execution functions for tools that require confirmation.
const executeFunctions = {
  getWeather: async (args: { location: string }) => {
    console.log(
      `Executing tool 'getWeather' with args: ${JSON.stringify(args)}`,
    );
    return `The weather in ${args.location} is sunny.`;
  },
};

// 3. Sample messages from the client.
// The last message contains the tool invocation with the user's approval.
const sampleMessages: Message[] = [
  { id: 'msg-1', role: 'user', content: 'What is the weather in London?' },
  {
    id: 'msg-2',
    role: 'assistant',
    content: '',
    parts: [
      {
        type: 'tool-invocation',
        toolInvocation: {
          toolCallId: 'tool-call-123',
          toolName: 'getWeather',
          args: { location: 'London' },
          state: 'result', // This state indicates the frontend is providing the result of the human confirmation step.
          result: APPROVAL.YES, // User confirmed the execution.
        },
      },
    ],
  },
];

// --- Example 1: With a Data Stream ---

async function exampleWithDataStream() {
  console.log('--- Running Example with Data Stream ---');

  // Mock DataStreamWriter to simulate a streaming environment.
  const mockDataStream = {
    write: (chunk: string) => {
      console.log('STREAM_CHUNK:', chunk);
    },
    close: () => {
      console.log('STREAM_CLOSED');
    },
  } as unknown as DataStreamWriter;

  const processedMessages = await processToolCalls(
    {
      dataStream: mockDataStream,
      messages: sampleMessages,
      tools: sampleTools,
    },
    executeFunctions,
  );

  console.log(
    'Final processed messages:',
    JSON.stringify(processedMessages, null, 2),
  );
  // In a real scenario, you would likely continue the AI conversation by passing
  // these `processedMessages` to the next `streamText` or `generateText` call.
}

// --- Example 2: Without a Data Stream (for a standard HTTP endpoint) ---

async function exampleWithoutDataStream() {
  console.log('\n--- Running Example without Data Stream ---');

  // Here we call the function without the `dataStream` parameter.
  const processedMessages = await processToolCalls(
    {
      messages: sampleMessages,
      tools: sampleTools,
    },
    executeFunctions,
  );

  console.log(
    'Final processed messages:',
    JSON.stringify(processedMessages, null, 2),
  );

  // In a real HTTP endpoint, you would return this as a JSON response.
  /*
  return new Response(JSON.stringify({ messages: processedMessages }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  */
}

// --- Run Examples ---
async function run() {
  await exampleWithDataStream();
  await exampleWithoutDataStream();
}

run();
