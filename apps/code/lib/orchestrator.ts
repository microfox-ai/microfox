import { AiRouter } from '@microfox/ai-router';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const orchestratorAgent = new AiRouter();

const orchestratorSchema = z.object({
  // The user's high-level goal.
  prompt: z.string().describe('The user a high-level goal to accomplish.'),
});

// This is the schema for the execution plan the orchestrator will generate.
const planSchema = z.object({
  plan: z
    .array(
      z.object({
        agent: z.enum(['summarize', 'docs', 'code']),
        details: z.string().describe('The specific goal for this step.'),
      })
    )
    .describe('The sequence of agents to call to accomplish the user goal.'),
});

orchestratorAgent
  .actAsTool('/', {
    description: 'Analyzes a user prompt and creates a step-by-step plan of agent calls.',
    inputSchema: orchestratorSchema as any,
  })

  .agent('/', async ({ request, response, state, next }: any) => {
    const { prompt } = await request.json();

    // 1. Create the Execution Plan
    response.write({ type: 'text', text: 'Generating execution plan...\n' });
    const { object: planResult } = await generateObject({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `Based on the following user prompt, create a step-by-step execution plan. The available agents are: 'summarize', 'docs', 'code'.

User Prompt: ${prompt}`,
      schema: planSchema,
    });

    response.write({ type: 'text', text: `Plan: ${JSON.stringify(planResult.plan, null, 2)}\n\n` });

    // 2. Execute the Plan
    // Initialize the shared context that will be passed through the chain.
    state.initialPrompt = prompt;
    state.executionTrace = [];

    for (const step of planResult.plan) {
      response.write({ type: 'text', text: `Executing agent: ${step.agent}...\n` });

      const result = await next.callAgent(`/agent/${step.agent}`);

      if (!result.ok) {
        const errorMsg = `Error executing agent ${step.agent}: ${result.error.message}`;
        response.write({ type: 'text', text: errorMsg });
        return; // Stop execution on failure.
      }
    }

    response.write({ type: 'text', text: `\nExecution complete. Final result:\n${state.finalOutput}` });
  }); 