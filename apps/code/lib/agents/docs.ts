import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const docsAgent = new AiRouter();

const docsSchema = z.object({
  topic: z.string().describe('The topic to generate documentation for.'),
  context: z.any().describe('The context to generate documentation for.').optional()
});

docsAgent
  .actAsTool('/', {
    description: 'Generates documentation for a topic. Provide the topic and the context if available.',
    inputSchema: docsSchema as any,
  })
  .agent('/', async (ctx) => {
    const topic = ctx.request.params?.topic as string
    const context = ctx.request.params?.context as any

    if (!topic) {
      ctx.response.write({ type: 'text', text: 'Error: No topic for documentation provided.' });
      return;
    }

    const { text: documentation } = await generateText({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `Please generate technical documentation based on the following: ${topic}
      
      context: ${JSON.stringify(context)}
      `,
    });

    ctx.response.write({ type: 'text', text: documentation });
  });
