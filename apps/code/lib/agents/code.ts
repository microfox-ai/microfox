import { AiRouter } from '@microfox/ai-router';
import { generateCodeV2 } from '@microfox/ai-code';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import * as path from 'path';

export const codeAgent = new AiRouter();

const codeSchema = z.object({
  prompt: z.string().describe('The detailed prompt or description for the code to be generated.'),
});

codeAgent
  .actAsTool('/', {
    description: 'Generates code from a prompt or description.',
    inputSchema: codeSchema as any,
  })
  .agent('/', async (ctx) => {
    const prompt = ctx.request.params?.prompt as string

    if (!prompt) {
      const errorMsg = 'Error: No prompt for code generation provided.';
      ctx.response.write({ type: 'text', text: errorMsg });
      return;
    }

    try {
      let isFirstChunk = true;
      await generateCodeV2({
        model: anthropic('claude-4-opus-20250514'),
        submodel: google('gemini-2.5-pro-preview-06-05'),
        systemPrompt: 'You are an expert programmer. Generate the code for the file as requested.',
        userPrompt: prompt,
        dir: process.cwd(),
        verbose: true,
        onChunkSubmit: async ({ chunk, filePlan }) => {
          if (isFirstChunk) {
            const fullFileName = `${filePlan.fileName}.${filePlan.fileExtension}`;
            const finalPath = path.join(filePlan.path, fullFileName);
            ctx.response.write({
              type: 'data-metadata',
              data: {
                filePath: finalPath,
                fileName: fullFileName,
              },
            });
            isFirstChunk = false;
          }
          ctx.response.write({ type: 'text', text: chunk });
        },
        onFileSubmit: async (filePath: string, code: string) => {
          ctx.response.write({ type: 'text', text: '\n[GENERATION COMPLETE]' });
          console.log(`File generation complete for ${filePath}. Total length: ${code.length}`);
        },
      });
    } catch (error: any) {
      const errorMessage = `Error generating code: ${error.message}`;
      ctx.response.write({ type: 'text', text: errorMessage });
    }
  }); 