import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, tool } from 'ai';
import { z } from 'zod';
import { AiRouter } from './router.js';

// --- Mock Vercel AI SDK Functions ---
// In a real application, these would be imported from 'ai' and e.g. '@ai-sdk/openai'.
// They are mocked here to make the example self-contained and runnable.
console.log(
  'NOTE: Vercel AI SDK functions are mocked for this example. No real AI calls will be made.'
);

// --- End Mocks ---

// --- 1. Define Sub-Router for Greetings ---
const greetingRouter = new AiRouter();

// Define a new router for casual greetings.
const casualRouter = new AiRouter();
casualRouter
  .actAsTool('/casual', {
    description: 'A friendly, casual greeting.',
    inputSchema: z.object({ name: z.string() }),
  })
  .agent('/casual', async ({ response, request }) => {
    const { toolInfo } = request.params as any;
    const name = toolInfo?.params?.name || 'there';
    response.write({
      type: 'text',
      text: `Yo, what's up ${name}! 👋`,
    });
  });

// Mount the casual router under the '/greeting' path prefix.
greetingRouter.use('/greeting', casualRouter);

// A simple tool that just returns a string, now using the factory pattern.
greetingRouter.tool('/formal', (ctx) =>
  tool<{ name: string }, string>({
    description: 'Use this for a formal, professional greeting.',
    inputSchema: z.object({
      name: z.string().describe('The name of the person to greet.'),
    }),
    execute: async ({ name }) => {
      ctx.logger.log(`Executing formal greeting for: ${name}`);
      return `Greetings, ${name}. It is a pleasure to make your acquaintance.`;
    },
  })
);

// An advanced agent that uses the '/casual' agent as a tool.
greetingRouter.agent('/decide', async ({ response, next, state, request }) => {
  response.write({ type: 'text', text: 'Decider agent is thinking...' });

  const { textStream, toolResults } = streamText({
    model: openai('gpt-4o'),
    prompt:
      "The user wants to be greeted. Based on the vibes, should I be casual or formal? The user's name is 'Chairman Meow'.",
    tools: {
      casualChat: next.agentAsTool('/greeting/casual'),
      // overwrite the tool definition
      formalChat: next.attachTool('/greeting/formal', {
        inputSchema: z.object({
          name: z.string().describe('The name of the person to greet.'),
        }),
        execute: async ({ name }) => {
          return `Greetings, ${name}. It is a pleasure to make your acquaintance.`;
        },
      }),
    },
  });

  // Stream the LLM's textual response back to the user.
  for await (const textPart of textStream) {
    response.write({ type: 'text', text: textPart });
  }

  // You can also access the results of the tool calls.
  const results = await toolResults;
  response.write({
    type: 'text',
    text: `\n[Tool results]: ${JSON.stringify(results)}`,
  });
});

// A simple agent that just streams a text response.
greetingRouter.agent('/hello', async (ctx) => {
  ctx.response.write({ type: 'text', text: 'Hello, world!' });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  ctx.response.write({ type: 'text', text: " I'm a streaming agent." });
});

// A simple agent that calls another agent.
greetingRouter.agent('/call-hello', async (ctx) => {
  ctx.response.write({
    type: 'text',
    text: "I'm about to call the /hello agent...",
  });
  const result = await ctx.next.callAgent('/hello');
  if (result.ok) {
    ctx.response.write({ type: 'text', text: "\n...I'm back!" });
  } else {
    ctx.response.write({
      type: 'text',
      text: `\n...call failed! ${result.error.message}`,
    });
  }
});

// A simple agent that calls a tool.
greetingRouter.agent('/call-formal', async (ctx) => {
  ctx.response.write({
    type: 'text',
    text: "I'm about to call the /formal tool...",
  });
  const result = await ctx.next.callTool('/formal', { name: 'Director' });

  if (result.ok) {
    ctx.response.write({
      type: 'text',
      text: `\n...I'm back! The tool returned: ${result.data}`,
    });
  } else {
    ctx.response.write({
      type: 'text',
      text: `\n...call failed! ${result.error.message}`,
    });
  }
});

// --- 2. Define Main Application Router ---
const mainRouter = new AiRouter();

// Global agent that acts like middleware, logging requests.
mainRouter.agent('/', async (ctx, next) => {
  console.log(`[Global Agent] Request received for path: ${ctx.request.path}`);
  ctx.state.requestStartTime = Date.now();
  await next();
  const duration = Date.now() - (ctx.state.requestStartTime || 0);
  console.log(`[Global Agent] Request finished in ${duration}ms.`);
});

// Mount the greeting router under the /greeting path.
mainRouter.agent('/greeting', greetingRouter);

// --- 3. Handle incoming requests ---
async function handleRequest(
  path: string,
  options: {
    messages?: UIMessage[];
    params?: Record<string, any>;
  } = {}
) {
  console.log(`\n--- Handling request for: ${path} ---`);
  const response = mainRouter.handle(path, {
    request: {
      messages: options.messages ?? [],
      params: options.params,
      path, // a convention to pass path in request
    },
  });

  // In a real server, you would return this response.
  // Here, we'll consume the stream to see the output.
  const reader = response.body?.getReader();
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // value is a Uint8Array, decode it to see the SSE messages
        console.log('STREAM CHUNK:', new TextDecoder().decode(value));
      }
    } finally {
      reader.releaseLock();
    }
  }
  console.log(`--- Finished handling request for: ${path} ---\n`);
}

// --- 4. Run Examples ---
async function runExamples() {
  // To test, you would need OPENAI_API_KEY set in your environment.
  // We will run a simplified flow that can be tested without an API key.

  console.log(
    "NOTE: Running examples. The 'decide' agent requires an OpenAI API key to function."
  );

  // Example 1: Call a schema-defined tool directly.
  // This simulates an internal `callTool` by passing params at the top level.
  await handleRequest('/greeting/formal', { params: { name: 'Dr. Evans' } });

  // Example 2: Call the casual agent directly.
  await handleRequest('/greeting/casual', {
    params: { reason: 'Just saying hi' },
  });

  // Example 3: Call the decider agent.
  // This will fail without an API key but demonstrates the setup.
  // It will try to call the LLM which then calls '/greeting/casual' as a tool.
  try {
    await handleRequest('/greeting/decide');
  } catch (e) {
    console.error(
      'Error calling /greeting/decide. This is expected if you have not set an OPENAI_API_KEY.'
    );
    // console.error(e);
  }
}

runExamples();

// Mock AI SDK functions for the example
const openaiMock = (model: string) => ({
  model,
  generateText: async (prompt: string) => `Mock response for: ${prompt}`,
});

const toolMock = <T extends Record<string, any>, R>(options: {
  description: string;
  inputSchema: z.ZodObject<any>;
  execute: (params: T) => Promise<R>;
}) => options;

// Create a router instance
const router = new AiRouter();

// Example usage
async function testDynamicParameters() {
  console.log('Testing dynamic parameters...');

  // This should match the dynamic pattern and extract parameters
  const result = await router.handle('/users/123/posts/456', {
    request: {
      messages: [],
      params: { action: 'read' },
    },
  });

  console.log('Dynamic parameter test completed');
}

// Run the test
testDynamicParameters().catch(console.error);
