import { AiRouter } from '@microfox/ai-router';
import { generateCodeV2 } from '@microfox/ai-code';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export const codeAgent = new AiRouter();

const codeSchema = z.object({
  // Input comes from the context.
});

codeAgent
  .actAsTool('/code', {
    description: 'Generates code based on documentation from the context.',
    inputSchema: codeSchema as any,
  })
  .agent('/code', async ({ state, response }: any) => {
    const taskContext = state;
    const prompt = taskContext.documentation || taskContext.initialPrompt;

    if (!prompt) {
      const errorMsg = 'Error: No prompt for code generation found in the context.';
      response.write({ type: 'text', text: errorMsg });
      taskContext.finalOutput = errorMsg;
      return;
    }

    try {
      await generateCodeV2({
        model: google('gemini-2.5-pro-preview-06-05'),
        systemPrompt: 'You are an expert programmer. Generate the code for the file as requested.',
        userPrompt: prompt,
        onFileSubmit: async (filePath: string, code: string) => {
          taskContext.code = code;
          taskContext.finalOutput = code;
          response.write({ type: 'text', text: code });
        },
      });
    } catch (error: any) {
      const errorMessage = `Error generating code: ${error.message}`;
      taskContext.finalOutput = errorMessage;
      response.write({ type: 'text', text: errorMessage });
    }
  }); 