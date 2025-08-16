import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { codeAgent } from '@/lib/agents/code';
import { docsAgent } from '@/lib/agents/docs';
import { summarizeAgent } from '@/lib/agents/summarize';
import { slsfoxAgent } from '@/lib/agents/slsFox';

export const receptionistAgent = new AiRouter<any, any, any>();

const receptionistInput = z.object({
  prompt: z.string().describe('The user a high-level goal to accomplish.'),
});

receptionistAgent
  .actAsTool('/', {
    description: 'Analyzes a user prompt and calls the appropriate agent.',
    inputSchema: receptionistInput as any,
  })
  .agent('/', async ctx => {
    const { prompt } = ctx.request;

    ctx.response.write({
      type: 'text',
      text: 'Finding the right agent for the job...\n',
    });

    const { toolCalls } = await generateText({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `You are a highly intelligent routing system. Your purpose is to deeply analyze a user's request to understand its fundamental intent. From this analysis, you will determine the single most appropriate specialized function to execute.

Analyze the following user prompt:
---
${prompt}
---

Now, determine the core task the user wants to accomplish and invoke the corresponding function.`,
      tools: {
        slsfox: ctx.next.agentAsTool('/slsfox'),
        summarize: ctx.next.agentAsTool('/summarize'),
        docs: ctx.next.agentAsTool('/docs'),
        code: ctx.next.agentAsTool('/code'),
      },
    });

    ctx.response.write({
      type: 'text',
      text: `\nExecution complete. Tool Calls:\n${toolCalls}`,
    });
  });

receptionistAgent.agent('/slsfox', slsfoxAgent);
receptionistAgent.agent('/code', codeAgent);
receptionistAgent.agent('/docs', docsAgent);
receptionistAgent.agent('/summarize', summarizeAgent);
