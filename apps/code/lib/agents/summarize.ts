import { AiRouter } from '@microfox/ai-router';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const summarizeAgent = new AiRouter();

const summarizeSchema = z.object({
  // The input for this agent now comes from the context, so the schema is empty.
});

summarizeAgent
  .actAsTool('/summarize', {
    description: 'Summarizes the initial prompt or other content found in the task context.',
    inputSchema: summarizeSchema as any,
  })
  .agent('/summarize', async ({ state, response }: any) => {
    const taskContext = state;
    const textToSummarize = taskContext.initialPrompt;

    if (!textToSummarize) {
      response.write({ type: 'text', text: 'Error: No text to summarize found in the context.' });
      return;
    }

    const { text: summary } = await generateText({
      model: google('gemini-2.5-pro-preview-06-05'),
      prompt: `Please provide a concise summary of the following text: ${textToSummarize}`,
    });

    // Write the final summary back to the shared context and the response.
    taskContext.summary = summary;
    response.write({ type: 'text', text: summary });
  }); 