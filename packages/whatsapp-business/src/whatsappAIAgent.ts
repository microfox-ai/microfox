import { z } from 'zod';
import { createAIFunction } from '@microfox/core';
import { WhatsAppBusinessSDK } from './whatsappBusinessSdk';
import { Message } from './types';
import { CodeGenerator } from './codeGenerator';

// Schema for task input
const TaskSchema = z.object({
  task: z.string().describe('The task or prompt to process'),
  context: z.optional(z.string()).describe('Additional context for the task'),
});

// Schema for code generation
const CodeGenerationSchema = z.object({
  task: z.string().describe('The coding task to generate'),
  language: z.string().describe('Programming language to use'),
  requirements: z.array(z.string()).describe('Requirements for the code'),
});

// Schema for self-improvement
const ImprovementSchema = z.object({
  capability: z.string().describe('The capability to improve'),
  currentImplementation: z.string().describe('Current implementation details'),
  desiredImprovement: z.string().describe('Desired improvement description'),
});

export class WhatsAppAIAgent {
  private sdk: WhatsAppBusinessSDK;
  private codeGenerator: CodeGenerator;
  private improvementFunction: any;

  constructor(sdk: WhatsAppBusinessSDK) {
    this.sdk = sdk;
    this.codeGenerator = new CodeGenerator();
    this.initializeAIFunctions();
  }

  private initializeAIFunctions() {
    // Function for self-improvement
    this.improvementFunction = createAIFunction(
      {
        name: 'improveCapability',
        description: 'Improve agent capabilities',
        inputSchema: ImprovementSchema,
      },
      async (params: z.infer<typeof ImprovementSchema>) => {
        // Implementation will be added
        return { success: true, improvements: [] };
      }
    );
  }

  async processMessage(message: { from: string; text?: { body: string } }) {
    try {
      // Parse the task from the message
      const taskInput = await this.parseTaskInput(message);
      
      // Process the task
      const response = await this.handleTask(taskInput);
      
      // Send response back via WhatsApp
      await this.sdk.sendTextMessage(message.from, response);
    } catch (error) {
      console.error('Error processing message:', error);
      await this.sdk.sendTextMessage(
        message.from,
        'Sorry, I encountered an error processing your request.'
      );
    }
  }

  private async parseTaskInput(message: { text?: { body: string } }) {
    // Use AI to parse the task from the message
    const taskInput = await TaskSchema.parseAsync({
      task: message.text?.body || '',
      context: undefined
    });
    return taskInput;
  }

  private async handleTask(taskInput: z.infer<typeof TaskSchema>) {
    // Determine if the task requires code generation
    if (this.requiresCodeGeneration(taskInput.task)) {
      const requirements = this.extractRequirements(taskInput.task);
      const { result } = await this.codeGenerator.generateAndSaveCode({
        task: taskInput.task,
        language: 'typescript', // Default to TypeScript
        requirements,
        filename: this.generateFilename(taskInput.task)
      });
      return this.formatCodeResponse(result);
    }

    // Handle other types of tasks
    return this.handleGeneralTask(taskInput);
  }

  private requiresCodeGeneration(task: string): boolean {
    // Simple heuristic to determine if code generation is needed
    const codeKeywords = ['code', 'program', 'function', 'class', 'implement', 'create'];
    return codeKeywords.some(keyword => task.toLowerCase().includes(keyword));
  }

  private extractRequirements(task: string): string[] {
    // Extract requirements from the task description
    // This is a simple implementation that can be improved
    return task.split(',').map(req => req.trim());
  }

  private generateFilename(task: string): string {
    // Generate a filename based on the task
    const sanitizedTask = task
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 30);
    return `${sanitizedTask}.ts`;
  }

  private formatCodeResponse(result: any): string {
    return `Here's the generated code:\n\n${result.code}\n\n${result.explanation}`;
  }

  private async handleGeneralTask(taskInput: z.infer<typeof TaskSchema>): Promise<string> {
    // Handle general tasks that don't require code generation
    return `I've processed your task: ${taskInput.task}`;
  }

  async improveCapability(capability: string, currentImplementation: string, desiredImprovement: string) {
    const result = await this.improvementFunction({
      capability,
      currentImplementation,
      desiredImprovement
    });
    return result;
  }
} 