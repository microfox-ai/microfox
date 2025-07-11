import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const summarizeAgent = new AiRouter();

const summarizeSchema = z.object({
  textToSummarize: z.string().describe('The text that needs to be summarized.'),
});

summarizeAgent
  .actAsTool('/', {
    description: 'Summarizes a piece of text.',
    inputSchema: summarizeSchema as any,
  })
  .agent('/', async (ctx) => {
    const textToSummarize = ctx.request.params?.textToSummarize as string

    if (!textToSummarize) {
      ctx.response.write({ type: 'text', text: 'Error: No text to summarize provided.' });
      return;
    }

    const { text: summary } = await generateText({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `Please provide a concise summary of the following text: ${textToSummarize}`,
    });

    ctx.response.write({ type: 'text', text: summary });
  }); 
  