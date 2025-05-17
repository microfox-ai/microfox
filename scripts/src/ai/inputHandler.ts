import { z } from 'zod';

export const TaskInputSchema = z.object({
  prompt: z.string(),
  context: z.object({
    files: z.array(z.string()),
    workspace: z.string(),
    language: z.string().optional()
  }),
  mode: z.enum(['generate', 'modify', 'improve'])
});

export type TaskInput = z.infer<typeof TaskInputSchema>;

export class TaskHandler {
  async processInput(input: TaskInput) {
    try {
      // Validate input
      const validatedInput = TaskInputSchema.parse(input);
      
      // Process context
      const context = {
        ...validatedInput.context,
        timestamp: new Date().toISOString(),
        mode: validatedInput.mode
      };

      return {
        prompt: validatedInput.prompt,
        context,
        isValid: true
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      throw new Error('Invalid input: An unknown error occurred');
    }
  }
}