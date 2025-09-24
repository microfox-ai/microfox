# @microfox/ai-router

A powerful, composable router framework for building structured, multi-agent AI applications. Heavily inspired by the simplicity and power of [Express.js](https://expressjs.com/) & Agent as Tool approach of Google's Agent Development kit [Adk](https://google.github.io/adk-docs/), `ai-router` brings a familiar middleware-style architecture to the world of AI assistants. It provides a robust foundation for orchestrating complex AI workflows with multiple agents, tools, and dynamic routing, all while integrating seamlessly with the [Vercel AI SDK](https://ai-sdk.dev/docs/introduction).

## Why `@microfox/ai-router`?

Modern AI applications, especially those using helpers like the Vercel AI SDK's `useChat`, typically connect the frontend to a single backend API endpoint. This creates a significant challenge: how do you manage a complex, multi-agent system through that single route?

Cramming an entire agentic orchestration logic—with multiple specialized agents, tools, and state management—into a single function is complex, hard to maintain, and quickly becomes unmanageable.

`ai-router` solves this with the **Principle of Singularity**. It allows you to build a sophisticated web of agents, middleware, and tools, each with its own path, and then serve the entire system through a single handler. The routing is handled internally, using path-like parameters sent in the request body, which simplifies both frontend and backend architecture. Your frontend communicates with one endpoint, while your backend remains modular, organized, and scalable.

## Core Principles

The design of `ai-router` is guided by a set of core principles tailored for building advanced, multi-agent systems.

### 1. Hierarchical Routing & Depth Control

Much like Express, `ai-router` allows you to define routes for different agents and tools. This enables **agent-to-agent communication**, where one agent can call another as part of its workflow.

Routes can be dynamic, using path parameters (`/users/:id`) to create flexible and reusable agents that behave differently based on the input.

To prevent uncontrolled recursion or infinite loops in these complex interactions, the router implements **Call Depth Protection**, allowing you to configure a maximum call depth.

```typescript
// An orchestrator agent calls a worker with a dynamic parameter
router.agent('/orchestrator', async (ctx) => {
  const result = await ctx.next.callAgent('/worker/process-data');
  ctx.response.write({ type: 'text', text: `Worker says: ${result.data}` });
});

// The worker agent uses the dynamic parameter from its path
router.agent('/worker/:task', async (ctx) => {
  const { task } = ctx.request.params;
  return `Completed task: ${task}`;
});
```

### 2. Powerful Middleware

Middleware functions are at the heart of `ai-router`'s flexibility. These are functions that run before your agent handlers, giving you powerful hooks to modify the context or perform cross-cutting operations. This is incredibly useful for:

- **Authentication & Authorization**: Checking permissions before an agent can run.
- **Dynamic Context Injection**: Fetching data from a database, like a user's chat history, and injecting it into the agent's context.
- **Dynamic Tool Creation**: Attaching specific tools to an agent based on the user's session or permissions.
- **Logging & Analytics**: Tracing requests as they move through the agentic system.

```typescript
// Middleware to fetch a user's chat history from a database
const historyMiddleware = async (ctx, next) => {
  const sessionId = ctx.request.headers['x-session-id'];
  const history = await db.getHistory(sessionId);

  // Prepend the history to the current request's messages
  ctx.request.messages = [...history, ...ctx.request.messages];
  await next();
};

// Apply this middleware to all agent routes
router.use('*', historyMiddleware);
```

### 3. Advanced State Management

In a multi-agent system, you often need to pass information between agents. Passing this data through LLM tool parameters is inefficient and costly, as it consumes valuable tokens.

`ai-router` includes a `state` object in its context, similar to the `context` in Express.js. This allows you to pass data between agents and middleware on the backend without ever exposing it to the LLM. It's the perfect solution for token optimization and efficient inter-agent communication.

```typescript
// Agent 1 fetches data and stores it in the shared state object
router.agent('/step1', async (ctx) => {
  const sensitiveData = await db.getUserData(ctx.request.userId);
  ctx.state.userData = sensitiveData; // Not sent to the LLM

  // Call the next agent in the workflow
  await ctx.next.callAgent('/step2');
});

// Agent 2 can now access this data directly from the state
router.agent('/step2', async (ctx) => {
  const userData = ctx.state.userData;
  return `Processing data for user: ${userData.name}`;
});
```

### 4. Resumability & Human-in-the-Loop

In many agentic workflows, a process may need to pause and wait for human approval before proceeding (Human-in-the-Loop). This often happens deep within a chain of agent-to-agent calls.

Resuming such a workflow at the exact point it was paused is a complex task. `ai-router` is designed to simplify this by maintaining the execution context, making it possible to resume a deeply nested operation with the correct state and context.

```typescript
// 1. A middleware that resumes to a certain point if there is a resumable path.
// When the user confirms an action, the frontend sends a new request including the `resumePath`.
// This middleware intercepts that path and resumes the operation, bypassing the normal execution flow.
router.use('/', async (ctx, next) => {
  if (ctx.request.resumePath) {
    // If there's a resume path, call the agent and stop further execution in this chain.
    return ctx.next.callAgent(ctx.request.resumePath);
  }
  // Otherwise, continue to the next handler in the chain.
  await next();
});

// 2. An agent determines it needs human approval for a transaction
router.agent('/financial-transaction', async (ctx) => {
  const { amount, recipient } = ctx.request.params;

  // Signal to the UI that confirmation is needed by sending a tool-call
  ctx.response.write({
    type: 'tool-call',
    toolName: 'confirmTransaction',
    toolCallId: generateId(),
    args: { amount, recipient, resumePath: '/financial-transaction' },
  });
});
```

### 5. Composable & Reusable Agents

An agent should be a reusable component. With `ai-router`, any agent can be exposed and attached as a tool to another agent. For example, you can create a highly specialized `/web-research` agent once and then provide it as a tool to any other agent that needs to perform research, promoting code reuse and modularity.

```typescript
import { z } from 'zod';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai'; // or your preferred provider

// 1. Define a reusable "research" agent and expose it as a tool
router
  .actAsTool('/research', {
    description: 'Performs web research on a specific topic.',
    inputSchema: z.object({ query: z.string() }),
  })
  .agent('/research', async (ctx) => {
    const summary = await researchService.search(ctx.request.params.query);
    return summary;
  });

// 2. Use that agent as a tool within another agent
router.agent('/blog-writer', async (ctx) => {
  const { topic } = ctx.request.params;
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: `Write a blog post about ${topic}.`,
    tools: {
      // Attach the existing agent as a tool for the LLM to use
      researcher: ctx.next.agentAsTool('/research'),
    },
  });
  ctx.response.write({ type: 'text', text });
});
```

## Features

- **🔄 Middleware Architecture**: Express-style middleware for cross-cutting concerns.
- **🤖 Multi-Agent Support**: Compose multiple agents with hierarchical routing.
- **🛠️ Tool Integration**: Seamless integration with AI tools and function calling.
- **📊 Dynamic Path Parameters**: Support for dynamic routing with parameter extraction.
- **🔗 Agent-to-Agent Communication**: Agents can call other agents as tools.
- **📝 Structured Logging**: Built-in logging with request tracing.
- **🛡️ Type Safety**: Full TypeScript support with comprehensive type definitions.
- **⚡ Streaming Support**: Native support for streaming responses.
- **🔄 State Management**: Shared backend state across agents and middleware for token optimization.
- **🛡️ Call Depth Protection**: Prevents infinite loops with configurable depth limits.

## Installation

```bash
npm install @microfox/ai-router
```

## Quick Start

```typescript
import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { z } from 'zod';

// Create a router
const router = new AiRouter<any, any, any, any>();

// Define a simple agent
const greetingSchema = z.object({
  name: z.string().describe('The name to greet'),
});

router
  .actAsTool('/', {
    description: 'A friendly greeting agent',
    inputSchema: greetingSchema,
  })
  .agent('/', async (ctx) => {
    const { name } = ctx.request.params;

    ctx.response.write({
      type: 'text',
      text: `Hello, ${name}! How can I help you today?`,
    });
  });

// Handle requests in a Next.js API route
export async function POST(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  // Determine the path from the URL slug
  const path = `/${(params.slug || []).join('/')}`;

  const body = await request.json();
  const { messages, ...restOfBody } = body;

  // Let the AiRouter handle the request and generate a response
  const response = router.handle(path, {
    request: {
      ...restOfBody,
      messages: messages || [],
    },
  });

  // Return the response generated by the agent
  return response;
}
```

## Core Concepts

### Router

The `AiRouter` is the main class that orchestrates your AI application. It manages the routing stack, handles requests, and provides the execution context.

```typescript
const router = new AiRouter<Metadata, Parts, Tools, State>();
```

### How Parameters are Handled

Understanding how data flows into your agents is key. `ai-router` provides two main ways to pass parameters:

1.  **Initial Request**: When you first call `router.handle(path, context)`, any properties in the request body (besides `messages`) are treated as potential parameters. If an agent on the matched path is exposed as a tool (using `.actAsTool()`) with an `inputSchema`, the router will validate the request body against that schema and make the parsed parameters available in `ctx.request.params`.

2.  **Agent-to-Agent Calls**: When one agent calls another using `ctx.next.callAgent(path, params)`, the `params` object is passed directly to the next agent and becomes available in its context at `ctx.request.params`.

This mechanism allows for type-safe and validated data transfer throughout your entire agentic system.

### Agents

Agents are the primary handlers in your application. They receive a context object and can interact with the user through the response stream.

```typescript
router.agent('/path', async (ctx) => {
  // Handle the request
  ctx.response.write({ type: 'text', text: 'Hello from agent!' });
});
```

### Tools

Tools are functions that can be called by agents or other tools. They support both static and factory-based definitions.

```typescript
// Static tool
router.tool(
  '/calculator',
  {
    schema: z.object({
      a: z.number(),
      b: z.number(),
      operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
    }),
    description: 'Performs basic arithmetic operations',
  },
  async (ctx, params) => {
    const { a, b, operation } = params;
    let result;

    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        result = a / b;
        break;
    }

    return result;
  }
);

// Factory-based tool
router.tool('/dynamic-tool', (ctx) => {
  return {
    description: 'A dynamic tool',
    inputSchema: z.object({ message: z.string() }),
    execute: async (params) => {
      return `Processed: ${params.message}`;
    },
  };
});
```

### Middleware

Middleware functions run before agents and can modify the context or perform cross-cutting operations.

```typescript
const loggingMiddleware = async (ctx, next) => {
  console.log(`Processing request at: ${ctx.executionContext.currentPath}`);
  await next();
  console.log(`Request completed`);
};

router.use('*', loggingMiddleware);
```

## Advanced Usage

### Agent-to-Agent Communication

Agents can call other agents using the `next` object:

```typescript
router.agent('/orchestrator', async (ctx) => {
  // Call another agent
  const result = await ctx.next.callAgent('/worker', { task: 'process-data' });

  if (result.ok) {
    ctx.response.write({ type: 'text', text: `Result: ${result.data}` });
  }
});

router.agent('/worker', async (ctx) => {
  const { task } = ctx.request.params;
  return `Processed: ${task}`;
});
```

#### Calling Parent/Sibling Agents from Sub-Agents

When working with nested routers (sub-agents), you might need to call an agent outside of the current router's scope (e.g., a sibling or parent agent). To do this, you can use an absolute path starting with `@/`. This tells the router to resolve the path from the root of the entire application, rather than relative to the current agent's path.

```typescript
// In a sub-agent mounted at /code-generator/validator
router.agent('/', async (ctx) => {
  // ... some logic
  // Call the receptionist agent, which is mounted at the root level
  await ctx.next.callAgent('@/receptionist', { task: 'new task' });
});
```

### Using Agents as Tools

Agents can be exposed as tools for LLM function calling:

```typescript
// Define the code generator agent as a tool at /code-generator
router.actAsTool('/code-generator', {
  description: 'Generates code based on requirements',
  inputSchema: z.object({
    requirements: z.string().describe('Code requirements'),
  }),
});

// The actual agent implementation when the registeres tool is called.
router.agent('/code-generator', async (ctx) => {
  const { requirements } = ctx.request.params;

  // Generate code using an LLM
  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: `Generate code for: ${requirements}`,
    tools: {
      // Expose other agents as tools
      analyzer: ctx.next.agentAsTool('/code-analyzer'),
      validator: ctx.next.agentAsTool('/code-validator'),
    },
  });

  ctx.response.write({ type: 'text', text });
});
```

### Dynamic Path Parameters

Support for dynamic routing with parameter extraction:

```typescript
router.agent('/users/:userId/profile', async (ctx) => {
  const { userId } = ctx.request.params;
  ctx.response.write({
    type: 'text',
    text: `Loading profile for user: ${userId}`,
  });
});

router.tool(
  '/posts/:postId/comments/:commentId',
  {
    schema: z.object({
      action: z.enum(['read', 'update', 'delete']),
    }),
    description: 'Manage post comments',
  },
  async (ctx, params) => {
    const { postId, commentId } = ctx.request.params;
    const { action } = params;

    return `Performing ${action} on comment ${commentId} of post ${postId}`;
  }
);
```

### State Management

Share state across agents and middleware:

```typescript
interface AppState {
  userSession: string;
  requestCount: number;
}

const router = new AiRouter<any, any, any, AppState>();

const sessionMiddleware = async (ctx, next) => {
  // Initialize state
  if (!ctx.state.userSession) {
    ctx.state.userSession = generateId();
    ctx.state.requestCount = 0;
  }

  ctx.state.requestCount++;
  await next();
};

router.agent('/dashboard', async (ctx) => {
  ctx.response.write({
    type: 'text',
    text: `Session: ${ctx.state.userSession}, Requests: ${ctx.state.requestCount}`,
  });
});
```

### Error Handling

The router provides structured error handling:

```typescript
router.agent('/protected', async (ctx) => {
  try {
    // Your agent logic
    const result = await riskyOperation();
    ctx.response.write({ type: 'text', text: result });
  } catch (error) {
    ctx.logger.error('Agent error:', error);
    ctx.response.write({
      type: 'text',
      text: 'An error occurred while processing your request.',
    });
  }
});
```

### Structuring Complex Applications

When building large-scale, multi-agent systems, a well-organized file structure is crucial for maintainability and scalability. We recommend a modular approach, separating your AI logic from your Next.js route handlers.

Here's a recommended project structure:

```
src/
├── ai/
│   ├── agents/
│   │   ├── code-generator/
│   │   │   ├── sub-agents/
│   │   │   │   └── code-validator/
│   │   │   │       ├── tools/
│   │   │   │       │   └── validation.tool.ts
│   │   │   │       ├── handler.ts
│   │   │   │       └── index.ts
│   │   │   ├── middleware/
│   │   │   │   └── input-validation.middleware.ts
│   │   │   ├── tools/
│   │   │   │   └── filesystem.tool.ts
│   │   │   ├── handler.ts
│   │   │   └── index.ts
│   │   └── receptionist/
│   │       ├── handler.ts
│   │       └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── logging.middleware.ts
│   ├── tools/
│   │   └── web-search.tool.ts
│   └── router.ts
└── app/
    └── api/
        └── v1/
            └── [[...slug]]/
                └── route.ts
```

#### 1. The Main Router (`src/ai/router.ts`)

This file is the entry point for your AI system. It creates the main `AiRouter`, applies global middleware and tools, and mounts all the top-level agents.

```typescript
// src/ai/router.ts
import { AiRouter } from '@microfox/ai-router';
import { loggingMiddleware } from './middleware/logging.middleware';
import { webSearchTool } from './tools/web-search.tool';
import { receptionistAgent } from './agents/receptionist';
import { codeGeneratorAgent } from './agents/code-generator';

const appRouter = new AiRouter();

// Apply global middleware
appRouter.use('*', loggingMiddleware);

// Register global tools
appRouter.tool('/search', webSearchTool);

// Mount top-level agents
appRouter.use('/receptionist', receptionistAgent);
appRouter.use('/code', codeGeneratorAgent);

export default appRouter;
```

#### 2. Agents (`src/ai/agents/`)

Each agent is a self-contained module with its own router, handlers, tools, and even sub-agents.

**Example: A top-level agent (`src/ai/agents/code-generator/index.ts`)**

This file defines the agent's router, registers its specific tools and middleware, and sets up its main handler. It can also mount sub-agents.

```typescript
// src/ai/agents/code-generator/index.ts
import { AiRouter } from '@microfox/ai-router';
import { codeGeneratorHandler } from './handler';
import { fileSystemTool } from './tools/filesystem.tool';
import { codeValidatorAgent } from './sub-agents/code-validator';
import { inputValidationMiddleware } from './middleware/input-validation.middleware';
import { z } from 'zod';

export const codeGeneratorAgent = new AiRouter();

// Agent-specific middleware
codeGeneratorAgent.use('*', inputValidationMiddleware);

// Agent-specific tools
codeGeneratorAgent.tool('/fs', fileSystemTool);

// Agent's main handler
codeGeneratorAgent
  .actAsTool('/', {
    description: 'Generates code based on requirements',
    inputSchema: z.object({
      requirements: z.string().describe('The user requirements for the code'),
    }),
  })
  .agent('/', codeGeneratorHandler);

// Mount sub-agents
codeGeneratorAgent.use('/validator', codeValidatorAgent);
```

**Example: A sub-agent (`src/ai/agents/code-generator/sub-agents/code-validator/index.ts`)**

Sub-agents follow the same pattern, allowing you to create a hierarchy of specialized agents.

```typescript
// src/ai/agents/code-generator/sub-agents/code-validator/index.ts
import { AiRouter } from '@microfox/ai-router';
import { validationTool } from './tools/validation.tool';
import { codeValidatorHandler } from './handler';

export const codeValidatorAgent = new AiRouter();

codeValidatorAgent.tool('/validate', validationTool);
codeValidatorAgent.agent('/', codeValidatorHandler);
```

#### 3. Next.js Route Handler (`src/app/api/v1/[[...slug]]/route.ts`)

Your Next.js API route becomes extremely simple. It just imports the main router and uses it to handle requests. This keeps your API layer thin and decoupled from the AI logic.

```typescript
// src/app/api/v1/[[...slug]]/route.ts
import appRouter from '@/ai/router';

export async function POST(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const path = `/${(params.slug || []).join('/')}`;
  const body = await request.json();
  const { messages, ...restOfBody } = body;

  const response = appRouter.handle(path, {
    request: {
      ...restOfBody,
      messages: messages || [],
    },
  });

  return response;
}
```

By following this structure, you can build complex, maintainable, and scalable multi-agent systems with `@microfox/ai-router`.

## API Reference

### AiRouter

#### Constructor

```typescript
new AiRouter<Metadata, Parts, Tools, State>(options?)
```

**Options:**

- `maxCallDepth`: Maximum agent-to-agent call depth (default: 10)
- `logger`: Custom logger implementation

#### Methods

##### `agent(path, ...handlers)`

Register agent handlers for a path.

##### `tool(path, options, handler)` or `tool(path, factory)`

Register a tool handler.

##### `use(path, middleware)`

Register middleware for a path.

##### `actAsTool(path, definition)`

Pre-define an agent as a tool for LLM function calling.

##### `handle(path, context)`

Process a request and return a streaming response.

### Context Object

The context object passed to agents and middleware contains:

```typescript
interface AiContext<Metadata, Parts, Tools, State> {
  request: {
    messages: UIMessage<Metadata, Parts, Tools>[]; // UIMessage is a type from the Vercel AI SDK
    params?: Record<string, any>;
    path?: string;
    [key: string]: any;
  };
  state: State;
  executionContext: {
    currentPath?: string;
    callDepth?: number;
    handlerPathStack?: string[];
  };
  requestId: string;
  logger: AiLogger;
  response: AiStreamWriter<Metadata, Parts, Tools>;
  next: NextHandler<Metadata, Parts, Tools, State>;
}
```

### Next Handler

The `next` object provides methods for agent-to-agent communication:

```typescript
interface NextHandler<Metadata, Parts, Tools, State> {
  callAgent(path: string, params?: Record<string, any>): Promise<Result>;
  callTool(path: string, params: any): Promise<Result>;
  attachTool(path: string): Tool<any, any>; // Use to expose a standard .tool() to an LLM.
  agentAsTool(path: string, definition?: Tool<any, any>): Tool<any, any>; // Use to expose another .agent() as a tool to an LLM.
}
```

## Error Types

The router provides several error types for different scenarios:

- `AgentNotFoundError`: No agent found for the requested path
- `ToolNotFoundError`: No tool found for the requested path
- `ToolValidationError`: Tool parameter validation failed
- `MaxCallDepthExceededError`: Agent call depth limit exceeded
- `AgentDefinitionMissingError`: Agent used as tool without definition

## Examples

### Multi-Agent Workflow

```typescript
import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { z } from 'zod';

const workflow = new AiRouter();

// Receptionist agent that routes to specialized agents
workflow
  .actAsTool('/', {
    description: 'Routes requests to appropriate specialized agents',
    inputSchema: z.object({ task: z.string() }),
  })
  .agent('/', async (ctx) => {
    const { task } = ctx.request.params;

    ctx.response.write({ type: 'text', text: 'Analyzing your request...\n' });

    const { toolCalls } = await generateText({
      model: openai('gpt-4'),
      prompt: `Route this task to the appropriate agent: ${task}`,
      tools: {
        codeGenerator: ctx.next.agentAsTool('/code'),
        dataAnalyzer: ctx.next.agentAsTool('/analyze'),
        documentWriter: ctx.next.agentAsTool('/write'),
      },
    });

    ctx.response.write({ type: 'text', text: 'Task routed successfully!' });
  });

// Specialized agents
workflow.agent('/code', codeAgent);
workflow.agent('/analyze', analyzeAgent);
workflow.agent('/write', writeAgent);
```

### RESTful API with AI

```typescript
import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const api = new AiRouter();

// Middleware for authentication
api.use('*', async (ctx, next) => {
  const token = ctx.request.headers?.authorization;
  if (!token) {
    throw new Error('Unauthorized');
  }
  await next();
});

// A specific tool for searching users, which is better for the LLM to use
api.tool(
  '/search/users',
  {
    schema: z.object({
      query: z.string().describe('The search query for users'),
    }),
    description: 'Searches for users based on a query.',
  },
  async (ctx, params) => {
    // In a real app, you would have database logic here
    // return await db.searchUsers(params.query);
    return { users: [{ id: '123', name: 'John Doe' }] };
  }
);

// AI-powered search
api.agent('/search', async (ctx) => {
  const { query } = ctx.request.params;

  const { text } = await generateText({
    model: openai('gpt-4'),
    prompt: `Fulfill this search request: ${query}`,
    tools: {
      userSearch: ctx.next.attachTool('/search/users'),
    },
  });

  ctx.response.write({ type: 'text', text });
});
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.

## License

This project is licensed under the MIT License.
