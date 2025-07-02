# AiRouter: An Agentic Application Framework

`AiRouter` is a lightweight, powerful framework for building complex, multi-agent applications in TypeScript. Inspired by web frameworks like Express or Fastify, it provides a robust routing system for creating, composing, and calling AI agents and tools in a structured and predictable way.

Stop thinking in single-shot API calls and start building hierarchies of agents that can call each other, use tools, and stream responses back to the user from any point in the chain.

## Quick Start: Your First Agent

See how easy it is to get started. In just a few lines of code, you can create a router, define an agent, and handle a request.

```typescript
import { AiRouter } from './router';

// 1. Create a new agent router
const app = new AiRouter();

// 2. Define an agent that streams a response
app.agent('/hello', async (ctx) => {
  ctx.response.write({ type: 'text', text: 'Hello, ' });
  await new Promise((resolve) => setTimeout(resolve, 500));
  ctx.response.write({ type: 'text', text: 'world!' });
});

// 3. Handle an incoming request and get a standard Response object
const request = new Request('http://localhost/hello');
const response = app.handle(new URL(request.url).pathname, { request });

// You can now return this response from your API endpoint.
```

---

## Core Concepts

- **`AiRouter`**: The main class, which acts as a router. You create an instance of this to register all your agents, tools, and middleware.
- **Agents**: The primary actors in the system. An agent is a function that receives a `context` (`ctx`) object and can perform actions, such as streaming text, calling other agents, using tools, or modifying state.
- **Tools**: Schema-defined functions that an agent can call. Tools are typically used for deterministic operations or for interacting with external APIs. They receive the `context` and a parsed, schema-validated input object.
- **The Context (`ctx`)**: A per-request object that is passed to every handler. It contains everything needed for an agent to do its work:
  - `ctx.response`: The stream writer to send data back to the end-user.
  - `ctx.next`: An object with methods for internal dispatching (`callAgent`, `callTool`, etc.).
  - `ctx.state`: A mutable object that lives for the duration of a single request, allowing agents and middleware to share data.
  - `ctx.logger`: A structured logger that automatically includes a unique `requestId` and the current agent `path` for easy debugging.
  - `ctx.request`: The initial request object.
- **Hierarchical Routing**: Just like in web frameworks, you can mount entire `AiRouter` instances on a path, allowing you to build modular and reusable collections of agents.

---

## Installation

```bash
# This package is internal to the project for now.
# To use it, import it directly from your local path.
import { AiRouter } from "../packages/ai-utils/src/router";
```

---

## Step-by-Step Documentation

### 1. Initialization

Create a new `AiRouter` router. You can create as many as you need to organize your application.

```typescript
const app = new AiRouter();
```

### 2. Defining an Agent

Use the `.agent()` method to define a handler for a specific path. The handler is an async function that receives the `ctx` object.

```typescript
app.agent('/simple', async (ctx) => {
  ctx.response.write({ type: 'text', text: 'This is a simple agent.' });
});
```

### 3. Defining a Tool

Use the `.tool()` method to define a tool. You must provide a Zod schema for the input `parameters`, which will be automatically validated. The handler receives the `ctx` and the parsed parameters.

```typescript
import { z } from 'zod';

app.tool(
  '/getWeather',
  {
    description: 'Gets the weather for a given location.',
    schema: z.object({
      city: z.string().describe('The city to get the weather for.'),
    }),
  },
  async (ctx, { city }) => {
    // In a real app, you'd call a weather API here.
    const weather = `The weather in ${city} is 72°F and sunny.`;
    ctx.logger.log('Weather tool executed successfully.');
    return { weather };
  }
);
```

### 4. Mounting Routers with `.use()`

Organize your code by creating separate routers and mounting them on a main router using `.use()`. This prefixes all routes in the mounted router.

```typescript
const adminRouter = new AiRouter();
adminRouter.agent("/dashboard", async (ctx) => { ... });

const mainApp = new AiRouter();
// All routes from adminRouter will now be prefixed with '/admin'
// e.g., the above agent is now available at '/admin/dashboard'
mainApp.use("/admin", adminRouter);
```

You can also use `.use()` to register middleware, which is useful for authentication, logging, or modifying the state before an agent runs.

```typescript
app.use('*', async (ctx, next) => {
  ctx.state.user = await getUserFromDb(ctx.request);
  ctx.logger.log('User authenticated.');
  await next(); // Don't forget to call next() to continue!
});
```

---

## Advanced Usage

### Internal Calling & Error Handling

Agents can call other agents and tools using `ctx.next`. This is the key to building complex, chained behaviors. These calls are resilient; they return a result object (`{ ok, data }` or `{ ok, error }`) instead of throwing, allowing the calling agent to handle failures gracefully.

```typescript
app.agent('/weather-reporter', async (ctx) => {
  ctx.response.write({ type: 'text', text: 'Checking the weather...' });

  const result = await ctx.next.callTool('/getWeather', {
    city: 'San Francisco',
  });

  if (result.ok) {
    ctx.response.write({
      type: 'text',
      text: `\nReport: ${result.data.weather}`,
    });
  } else {
    ctx.logger.error('Failed to get weather:', result.error);
    ctx.response.write({
      type: 'text',
      text: `\nSorry, I couldn't get the weather.`,
    });
  }
});
```

### Agent as a Tool

For an LLM to call one of your agents, it must be presented as a `Tool`. `AiRouter` makes this easy with a two-step pattern:

**Step 1: Define the Tool Schema with `.actAsTool()`**
When creating an agent, specify how it should look to an LLM.

```typescript
import { z } from 'zod';
const casualRouter = new AiRouter();

casualRouter
  .actAsTool('/casual', {
    description: 'A friendly, casual greeting.',
    inputSchema: z.object({ name: z.string() }),
  })
  .agent('/casual', async ({ response, request }) => {
    // The 'params' come from the LLM tool call
    const name = (request.params as any)?.toolInfo?.params?.name || 'there';
    response.write({ type: 'text', text: `Yo, what's up ${name}! 👋` });
  });
```

**Step 2: Provide the Tool to the LLM with `next.agentAsTool()`**
Inside another agent, use this method to create the final Vercel AI SDK `Tool` object.

```typescript
import { streamText } from 'ai';

greetingRouter.agent('/decide', async ({ response, next }) => {
  const { textStream } = await streamText({
    model: openai('gpt-4-turbo'),
    prompt: 'Should I greet Chairman Meow casually?',
    tools: {
      // The framework handles connecting this to the agent's implementation
      casualChat: next.agentAsTool('/greeting/casual'),
    },
  });

  for await (const textPart of textStream) {
    response.write({ type: 'text', text: textPart });
  }
});
```

### Dynamic Tool Attachment with `next.attachTool()`

Similarly, you can provide any registered `.tool()` handler to an LLM using `next.attachTool()`.

```typescript
const { textStream } = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: '...',
  tools: {
    getWeather: next.attachTool('/getWeather'),
  },
});
```

### Logging and Debugging

The built-in logger (`ctx.logger`) is your best friend for debugging. It automatically tags every log message with a unique `requestId` and the `path` of the currently executing handler. This makes it easy to trace the flow of a request, even through multiple internal calls.

```
[aK4xLp8VnI2C] [/decide] -> Running middleware
[aK4xLp8VnI2C] [/decide] User authenticated.
[aK4xLp8VnI2C] [/decide] -> Executing agent handler
[aK4xLp8VnI2C] [/greeting/casual] -> Executing agent handler
[aK4xLp8VnI2C] [/greeting/casual] <- Finished agent
[aK4xLp8VnI2C] [/decide] <- Finished agent
```
