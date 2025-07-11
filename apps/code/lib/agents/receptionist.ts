import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { codeAgent } from '@/lib/agents/code';
import { docsAgent } from '@/lib/agents/docs';
import { summarizeAgent } from '@/lib/agents/summarize';
import { slsfoxAgent } from '@/lib/agents/slsFox';

export const receptionistAgent = new AiRouter();

const receptionistSchema = z.object({
    prompt: z.string().describe('The user a high-level goal to accomplish.'),
});

receptionistAgent
    .actAsTool('/', {
        description: 'Analyzes a user prompt and calls the appropriate agent.',
        inputSchema: receptionistSchema as any,
    })
    .agent('/', async (ctx) => {
        const { prompt } = ctx.request

        ctx.response.write({ type: 'text', text: 'Finding the right agent for the job...\n' });

        const { toolCalls } = await generateText({
            model: google('gemini-2.5-pro-preview-06-05'),
            prompt: `Based on the following user prompt, decide which agent to call.
        
User Prompt: ${prompt}`,
            tools: {
                slsfox: ctx.next.agentAsTool("/slsfox"),
                summarize: ctx.next.agentAsTool("/summarize"),
                docs: ctx.next.agentAsTool("/docs"),
                code: ctx.next.agentAsTool("/code"),
            }
        });

        ctx.response.write({ type: 'text', text: `\nExecution complete. Tool Calls:\n${toolCalls}` });
    });

receptionistAgent.agent('/slsfox', slsfoxAgent);
receptionistAgent.agent('/code', codeAgent);
receptionistAgent.agent('/docs', docsAgent);
receptionistAgent.agent('/summarize', summarizeAgent);
