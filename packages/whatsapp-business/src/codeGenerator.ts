import { z } from 'zod';
import { createAIFunction } from '@microfox/core';
import * as fs from 'fs';
import * as path from 'path';

// Schema for code generation result
const CodeGenerationResultSchema = z.object({
  code: z.string().describe('The generated code'),
  explanation: z.string().describe('Explanation of the generated code'),
  tests: z.optional(z.array(z.string())).describe('Test cases for the generated code'),
  dependencies: z.optional(z.array(z.string())).describe('Required dependencies'),
});

export class CodeGenerator {
  private generateCodeFunction: any;

  constructor() {
    this.initializeCodeGeneration();
  }

  private initializeCodeGeneration() {
    this.generateCodeFunction = createAIFunction(
      {
        name: 'generateCode',
        description: 'Generate code based on requirements',
        inputSchema: z.object({
          task: z.string().describe('The coding task to generate'),
          language: z.string().describe('Programming language to use'),
          requirements: z.array(z.string()).describe('Requirements for the code'),
        }),
      },
      async (params) => {
        // Generate code using AI
        const result = await this.generateCodeWithAI(params);
        
        // Validate the result
        return CodeGenerationResultSchema.parse(result);
      }
    );
  }

  private async generateCodeWithAI(params: {
    task: string;
    language: string;
    requirements: string[];
  }): Promise<z.infer<typeof CodeGenerationResultSchema>> {
    // This is where you would integrate with an AI model
    // For now, we'll return a placeholder implementation
    return {
      code: `// Generated code for: ${params.task}\n// Language: ${params.language}\n// Requirements: ${params.requirements.join(', ')}`,
      explanation: 'This is a placeholder implementation. Replace with actual AI-generated code.',
      tests: ['// Add test cases here'],
      dependencies: ['// Add dependencies here']
    };
  }

  async generateCode(params: {
    task: string;
    language: string;
    requirements: string[];
  }): Promise<z.infer<typeof CodeGenerationResultSchema>> {
    return this.generateCodeFunction(params);
  }

  async saveCodeToFile(
    code: string,
    filename: string,
    directory: string = process.cwd()
  ): Promise<string> {
    const filePath = path.join(directory, filename);
    await fs.promises.writeFile(filePath, code, 'utf8');
    return filePath;
  }

  async generateAndSaveCode(params: {
    task: string;
    language: string;
    requirements: string[];
    filename: string;
    directory?: string;
  }): Promise<{
    filePath: string;
    result: z.infer<typeof CodeGenerationResultSchema>;
  }> {
    const result = await this.generateCode(params);
    const filePath = await this.saveCodeToFile(
      result.code,
      params.filename,
      params.directory
    );
    return { filePath, result };
  }
} 