import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const docsAgent = new AiRouter();

const docsSchema = z.object({
  // Input comes from the context.
});

docsAgent
  .actAsTool('/docs', {
    description: 'Generates documentation based on a summary or topic from the context.',
    inputSchema: docsSchema as any,
  })
  .agent('/docs', async ({ state, response }: any) => {
    const taskContext = state;
    // This agent can build on the work of the previous one.
    const topic = taskContext.summary || taskContext.initialPrompt;

    if (!topic) {
      response.write({ type: 'text', text: 'Error: No topic for documentation found in the context.' });
      return;
    }

    const { text: documentation } = await generateText({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `Please generate technical documentation based on the following: ${topic}`,
    });

    // Write the result back to the shared context and the response.
    taskContext.documentation = documentation;
    response.write({ type: 'text', text: documentation });
  }); 