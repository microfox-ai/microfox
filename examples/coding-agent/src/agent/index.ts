// src/agent/index.ts

import { Client } from '@google/genai';
import { PromptHandler } from './prompt-handler';
import { CodeGenerator } from './code-generator';
import { CodeExecutor } from '../../utils/code-executor';
import { TaskAnalysis } from '../../types';

interface AgentConfig {
  apiKey: string;
  maxRetries?: number;
  defaultLanguage?: string;
  styleGuide?: string;
  generateTests?: boolean;
  includeDocs?: boolean;
}

interface AgentResult {
  code: string;
  documentation?: string;
  tests?: string;
  executionResult?: {
    success: boolean;
    output: string;
    error?: string;
    executionTime?: number;
  };
  dependencies: {
    name: string;
    version: string;
  }[];
  analysis: TaskAnalysis;
}

export class CodingAgent {
  private client: Client;
  private promptHandler: PromptHandler;
  private codeGenerator: CodeGenerator;
  private codeExecutor: CodeExecutor;
  private config: Required<AgentConfig>;

  constructor(config: AgentConfig) {
    this.config = {
      maxRetries: 3,
      defaultLanguage: 'typescript',
      styleGuide: 'Standard',
      generateTests: true,
      includeDocs: true,
      ...config,
    };

    this.client = new Client({ apiKey: this.config.apiKey });
    this.promptHandler = new PromptHandler(this.client);
    this.codeGenerator = new CodeGenerator(this.client);
    this.codeExecutor = new CodeExecutor();
  }

  /**
   * Main method to process a coding task
   */
  async processTask(prompt: string): Promise<AgentResult> {
    try {
      // Step 1: Analyze the prompt
      console.log('📝 Analyzing prompt...');
      const analysis = await this.promptHandler.analyzePrompt(prompt);
      
      // Step 2: Enhance the prompt with more context
      console.log('🔍 Enhancing prompt...');
      const enhancedPrompt = await this.promptHandler.enhancePrompt(analysis);

      // Step 3: Generate code
      console.log('💻 Generating code...');
      const generatedResult = await this.codeGenerator.generateCode(
        analysis,
        enhancedPrompt,
        {
          generateTests: this.config.generateTests,
          includeDocs: this.config.includeDocs,
          styleGuide: this.config.styleGuide,
        }
      );

      // Step 4: Validate code
      console.log('✅ Validating code...');
      const validation = await this.codeGenerator.validateCode(generatedResult.code);
      if (!validation.isValid) {
        console.warn('⚠️ Code validation issues:', validation.issues);
        console.info('💡 Suggestions:', validation.suggestions);
      }

      // Step 5: Execute code if it's safe
      console.log('🚀 Executing code...');
      const isSafe = await this.codeExecutor.validateCodeSafety(generatedResult.code);
      let executionResult;

      if (isSafe) {
        executionResult = await this.codeExecutor.execute(
          generatedResult.code,
          {
            language: analysis.language || this.config.defaultLanguage,
            dependencies: generatedResult.dependencies,
          }
        );
      } else {
        console.warn('⚠️ Code contains potentially unsafe operations. Skipping execution.');
      }

      // Step 6: Run tests if available
      if (generatedResult.tests && this.config.generateTests) {
        console.log('🧪 Running tests...');
        await this.codeExecutor.runTests(
          generatedResult.code,
          generatedResult.tests,
          {
            language: analysis.language || this.config.defaultLanguage,
            dependencies: generatedResult.dependencies,
          }
        );
      }

      return {
        code: generatedResult.code,
        documentation: generatedResult.documentation,
        tests: generatedResult.tests,
        executionResult,
        dependencies: generatedResult.dependencies,
        analysis,
      };
    } catch (error) {
      console.error('❌ Error processing task:', error);
      throw new Error(`Failed to process task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Method to improve agent's capabilities based on feedback
   */
  async improveCapabilities(feedback: string): Promise<void> {
    const improvementPrompt = `
Based on the following feedback, suggest improvements to the code generation process:

${feedback}

Provide specific recommendations for:
1. Prompt handling
2. Code generation
3. Testing strategies
4. Documentation quality
5. Error handling
`;

    try {
      const response = await this.client.models.generate_content({
        model: 'gemini-2.0-flash',
        contents: improvementPrompt,
      });

      // Store improvements for future use
      await this.storeImprovements(response.text);
    } catch (error) {
      console.error('Error improving capabilities:', error);
    }
  }

  /**
   * Store improvements for future use
   */
  private async storeImprovements(improvements: string): Promise<void> {
    // This is a placeholder for storing improvements
    // In a real implementation, you might want to:
    // 1. Store in a database
    // 2. Update model fine-tuning
    // 3. Adjust generation parameters
    console.log('Stored improvements for future use:', improvements);
  }

  /**
   * Method to extend agent's capabilities
   */
  async extendCapabilities(newCapability: string): Promise<void> {
    const extensionPrompt = `
Analyze and implement the following new capability:

${newCapability}

Provide:
1. Implementation strategy
2. Required changes
3. Potential impacts
4. Testing approach
`;

    try {
      const response = await this.client.models.generate_content({
        model: 'gemini-2.0-flash',
        contents: extensionPrompt,
      });

      // Implement the new capability
      await this.implementNewCapability(response.text);
    } catch (error) {
      console.error('Error extending capabilities:', error);
    }
  }

  /**
   * Implement new capability
   */
  private async implementNewCapability(implementation: string): Promise<void> {
    // This is a placeholder for implementing new capabilities
    // In a real implementation, you might want to:
    // 1. Update the agent's configuration
    // 2. Add new methods or features
    // 3. Extend existing functionality
    console.log('New capability implementation:', implementation);
  }
}

// Example usage:
/*
async function main() {
  // Initialize the coding agent
  const agent = new CodingAgent({
    apiKey: process.env.GOOGLE_API_KEY!,
    generateTests: true,
    includeDocs: true,
  });

  try {
    // Process a coding task
    const result = await agent.processTask(
      "Create a TypeScript function that implements a debounce utility with proper typing"
    );

    // Display results
    console.log('Generated Code:', result.code);
    console.log('Documentation:', result.documentation);
    console.log('Tests:', result.tests);
    console.log('Execution Result:', result.executionResult);
    console.log('Dependencies:', result.dependencies);

    // Provide feedback for improvement
    await agent.improveCapabilities(
      "The generated code could use better error handling and more comprehensive tests"
    );

    // Extend agent's capabilities
    await agent.extendCapabilities(
      "Add support for generating React components with proper TypeScript types"
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main();
*/