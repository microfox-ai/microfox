// src/agent/code-generator.ts

import { Client, GenerateContentConfig, Tool, ToolCodeExecution } from '@google/genai';
import { TaskAnalysis } from '../../types';

// Define strict interfaces for better type safety
interface CodeGenerationResult {
  code: string;
  documentation: string;
  tests?: string;
  dependencies: Dependency[];
}

interface Dependency {
  name: string;
  version: string;
}

interface GenerationOptions {
  generateTests?: boolean;
  includeDocs?: boolean;
  styleGuide?: string;
  framework?: string;
}

interface ValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
}

interface CodeResponse {
  code: string;
  dependencies: Dependency[];
}

export class CodeGenerator {
  private readonly client: Client;
  private readonly defaultOptions: GenerationOptions = {
    generateTests: true,
    includeDocs: true,
    styleGuide: 'Standard',
  };

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Main method to generate code based on task analysis
   */
  public async generateCode(
    taskAnalysis: TaskAnalysis,
    enhancedPrompt: string,
    options: GenerationOptions = {}
  ): Promise<CodeGenerationResult> {
    try {
      const mergedOptions = { ...this.defaultOptions, ...options };

      // Step 1: Generate main code implementation
      const mainImplementation = await this.generateMainImplementation(
        taskAnalysis,
        enhancedPrompt,
        mergedOptions
      );

      // Step 2: Generate documentation if requested
      const documentation = mergedOptions.includeDocs
        ? await this.generateDocumentation(mainImplementation.code, taskAnalysis)
        : '';

      // Step 3: Generate tests if requested
      const tests = mergedOptions.generateTests
        ? await this.generateTests(mainImplementation.code, taskAnalysis)
        : undefined;

      // Step 4: Validate and optimize the code
      const optimizedCode = await this.optimizeCode(mainImplementation.code, taskAnalysis);

      return {
        code: optimizedCode,
        documentation,
        tests,
        dependencies: mainImplementation.dependencies,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Code generation failed: ${errorMessage}`);
    }
  }

  /**
   * Generates the main code implementation
   */
  private async generateMainImplementation(
    taskAnalysis: TaskAnalysis,
    enhancedPrompt: string,
    options: GenerationOptions
  ): Promise<CodeResponse> {
    const prompt = this.createImplementationPrompt(taskAnalysis, enhancedPrompt, options);

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      });

      if (!response.response?.text) {
        throw new Error('No response received from the model');
      }

      return this.parseCodeResponse(response.response.text);
    } catch (error) {
      throw new Error(`Implementation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates the prompt for code implementation
   */
  private createImplementationPrompt(
    taskAnalysis: TaskAnalysis,
    enhancedPrompt: string,
    options: GenerationOptions
  ): string {
    return `
You are an expert ${taskAnalysis.language || ''} developer. Generate production-ready code for the following task:

${enhancedPrompt}

Requirements:
${taskAnalysis.requirements.map(req => `- ${req}`).join('\n')}

${taskAnalysis.constraints ? `Constraints:\n${taskAnalysis.constraints.join('\n')}` : ''}

Technical Specifications:
- Language: ${taskAnalysis.language || 'JavaScript'}
${options.framework ? `- Framework: ${options.framework}` : ''}
- Style Guide: ${options.styleGuide || 'Standard style guide'}
- Include comprehensive error handling
- Use modern best practices
- Optimize for performance and maintainability

Provide your response in the following JSON format:
{
  "code": "// Your implementation here",
  "dependencies": [
    { "name": "package-name", "version": "version-number" }
  ]
}
`;
  }

  /**
   * Generates documentation for the code
   */
  private async generateDocumentation(
    code: string,
    taskAnalysis: TaskAnalysis
  ): Promise<string> {
    const prompt = `
Generate comprehensive documentation for the following ${taskAnalysis.language} code:

${code}

Include:
1. Overview and purpose
2. Detailed API documentation
3. Parameters and return values
4. Usage examples
5. Edge cases and limitations
6. Performance considerations

Use markdown format.
`;

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      if (!response.response?.text) {
        throw new Error('No documentation generated');
      }

      return response.response.text;
    } catch (error) {
      throw new Error(`Documentation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generates test cases for the code
   */
  private async generateTests(
    code: string,
    taskAnalysis: TaskAnalysis
  ): Promise<string> {
    const prompt = `
Generate comprehensive test cases for the following ${taskAnalysis.language} code:

${code}

Create tests that cover:
1. Basic functionality
2. Edge cases
3. Error scenarios
4. Performance benchmarks (if applicable)

Use appropriate testing framework for ${taskAnalysis.language}.
Include setup and teardown if needed.
Ensure tests are maintainable and well-documented.
`;

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      if (!response.response?.text) {
        throw new Error('No tests generated');
      }

      return response.response.text;
    } catch (error) {
      throw new Error(`Test generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Optimizes the generated code
   */
  private async optimizeCode(
    code: string,
    taskAnalysis: TaskAnalysis
  ): Promise<string> {
    const prompt = `
Optimize the following ${taskAnalysis.language} code for:
1. Performance
2. Memory efficiency
3. Code readability
4. Maintainability

Original code:
${code}

Provide the optimized code with comments explaining the improvements.
Ensure all functionality remains intact.
`;

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      if (!response.response?.text) {
        throw new Error('No optimized code generated');
      }

      return response.response.text;
    } catch (error) {
      throw new Error(`Code optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parses the code generation response
   */
  private parseCodeResponse(response: string): CodeResponse {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      
      if (!result.code) {
        throw new Error('No code found in response');
      }

      return {
        code: result.code,
        dependencies: Array.isArray(result.dependencies) ? result.dependencies : [],
      };
    } catch (error) {
      throw new Error(`Failed to parse code response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates the generated code quality
   */
  public async validateCode(code: string): Promise<ValidationResult> {
    const prompt = `
Analyze the following code for quality and potential issues:

${code}

Check for:
1. Syntax errors
2. Logic errors
3. Security vulnerabilities
4. Performance issues
5. Code style violations
6. Best practice violations

Provide response in JSON format:
{
  "isValid": boolean,
  "issues": string[],
  "suggestions": string[]
}
`;

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      if (!response.response?.text) {
        throw new Error('No validation response received');
      }

      const validation = JSON.parse(response.response.text);
      
      return {
        isValid: Boolean(validation.isValid),
        issues: Array.isArray(validation.issues) ? validation.issues : [],
        suggestions: Array.isArray(validation.suggestions) ? validation.suggestions : [],
      };
    } catch (error) {
      return {
        isValid: false,
        issues: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        suggestions: [],
      };
    }
  }
}