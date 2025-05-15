// src/agent/prompt-handler.ts

import { Client, GenerateContentConfig, Tool, ToolCodeExecution } from '@google/genai';

interface TaskAnalysis {
  type: 'code_generation' | 'code_modification' | 'code_review' | 'other';
  language?: string;
  requirements: string[];
  constraints?: string[];
  context?: string;
  complexity: 'low' | 'medium' | 'high';
}

interface PromptConfig {
  maxTokens?: number;
  temperature?: number;
  thinkingBudget?: number;
}

export class PromptHandler {
  private client: Client;
  private defaultConfig: PromptConfig = {
    maxTokens: 2048,
    temperature: 0.7,
    thinkingBudget: 1024,
  };

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * Analyzes the user prompt to extract structured information about the task
   */
  async analyzePrompt(prompt: string, config?: PromptConfig): Promise<TaskAnalysis> {
    const mergedConfig = { ...this.defaultConfig, ...config };

    // Create a structured prompt for the model to analyze the task
    const analysisPrompt = this.createAnalysisPrompt(prompt);

    try {
      const response = await this.client.models.generate_content({
        model: 'gemini-2.0-flash',
        contents: analysisPrompt,
        config: new GenerateContentConfig({
          thinking_config: {
            thinking_budget: mergedConfig.thinkingBudget,
          },
          tools: [new Tool({ code_execution: new ToolCodeExecution() })],
        }),
      });

      // Parse the model's response into a structured TaskAnalysis
      return this.parseAnalysisResponse(response.text);
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      throw new Error('Failed to analyze prompt');
    }
  }

  /**
   * Creates a structured prompt for task analysis
   */
  private createAnalysisPrompt(userPrompt: string): string {
    return `
Analyze the following coding task and provide a structured analysis in JSON format.
Include the following information:
- Task type (code_generation, code_modification, code_review, or other)
- Programming language (if specified or can be inferred)
- List of specific requirements
- Any constraints or limitations
- Context information
- Estimated complexity (low, medium, high)

User Task: ${userPrompt}

Respond only with a valid JSON object containing the analysis.
`;
  }

  /**
   * Parses the model's response into a structured TaskAnalysis object
   */
  private parseAnalysisResponse(response: string): TaskAnalysis {
    try {
      // Extract JSON from the response (it might be wrapped in markdown or other text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const analysis = JSON.parse(jsonMatch[0]);

      // Validate and transform the response into TaskAnalysis format
      return this.validateAndTransformAnalysis(analysis);
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      throw new Error('Failed to parse analysis response');
    }
  }

  /**
   * Validates and transforms the parsed JSON into a proper TaskAnalysis object
   */
  private validateAndTransformAnalysis(analysis: any): TaskAnalysis {
    // Ensure required fields are present
    if (!analysis.type || !analysis.requirements) {
      throw new Error('Invalid analysis format: missing required fields');
    }

    // Validate task type
    const validTypes = ['code_generation', 'code_modification', 'code_review', 'other'];
    if (!validTypes.includes(analysis.type)) {
      analysis.type = 'other';
    }

    // Ensure requirements is an array
    if (!Array.isArray(analysis.requirements)) {
      analysis.requirements = [analysis.requirements];
    }

    // Validate complexity
    const validComplexity = ['low', 'medium', 'high'];
    if (!validComplexity.includes(analysis.complexity)) {
      analysis.complexity = 'medium';
    }

    return {
      type: analysis.type,
      language: analysis.language || undefined,
      requirements: analysis.requirements,
      constraints: analysis.constraints || [],
      context: analysis.context || undefined,
      complexity: analysis.complexity,
    };
  }

  /**
   * Enhances the original prompt with additional context and requirements
   */
  async enhancePrompt(analysis: TaskAnalysis): Promise<string> {
    const enhancementPrompt = `
Based on the following task analysis, generate an enhanced prompt that includes:
- Clear specification of the programming language and version
- Detailed requirements breakdown
- Any necessary context or background information
- Specific constraints or limitations
- Expected output format or behavior

Analysis:
${JSON.stringify(analysis, null, 2)}

Generate a comprehensive prompt that will lead to high-quality code generation.
`;

    try {
      const response = await this.client.models.generate_content({
        model: 'gemini-2.0-flash',
        contents: enhancementPrompt,
        config: new GenerateContentConfig({
          thinking_config: {
            thinking_budget: this.defaultConfig.thinkingBudget,
          },
        }),
      });

      return response.text;
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      throw new Error('Failed to enhance prompt');
    }
  }

  /**
   * Extracts code examples or relevant snippets from the prompt if present
   */
  extractCodeExamples(prompt: string): string[] {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = prompt.match(codeBlockRegex) || [];
    
    return matches.map(block => {
      // Remove the markdown code block syntax
      return block.replace(/```[\s\S]?\n?/, '').replace(/```$/, '').trim();
    });
  }

  /**
   * Determines if the prompt requires external API or library usage
   */
  async detectExternalDependencies(prompt: string): Promise<string[]> {
    const dependencyPrompt = `
Analyze the following task and list any external APIs, libraries, or frameworks that might be needed:

${prompt}

Respond with a JSON array of dependency names only.
`;

    try {
      const response = await this.client.models.generate_content({
        model: 'gemini-2.0-flash',
        contents: dependencyPrompt,
      });

      const dependencies = JSON.parse(response.text);
      return Array.isArray(dependencies) ? dependencies : [];
    } catch (error) {
      console.error('Error detecting dependencies:', error);
      return [];
    }
  }
}

// Example usage:
/*
async function example() {
  const client = new Client({ apiKey: process.env.GOOGLE_API_KEY });
  const promptHandler = new PromptHandler(client);

  const userPrompt = "Create a function that sorts an array of objects by multiple keys, with support for ascending and descending order";
  
  // Analyze the prompt
  const analysis = await promptHandler.analyzePrompt(userPrompt);
  console.log('Task Analysis:', analysis);

  // Enhance the prompt with more context and requirements
  const enhancedPrompt = await promptHandler.enhancePrompt(analysis);
  console.log('Enhanced Prompt:', enhancedPrompt);

  // Detect any required dependencies
  const dependencies = await promptHandler.detectExternalDependencies(userPrompt);
  console.log('Required Dependencies:', dependencies);
}
*/