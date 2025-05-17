// Import required modules and libraries
import { generateText } from 'ai';
import path from 'path';
import fs from 'fs';
import { models } from './ai/models'; // Microfox's configured AI models
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const OUTPUT_DIR = path.join(__dirname, './agent_output'); // Where generated code files will be saved
const MAX_SELF_IMPROVE_ATTEMPTS = 3; // Maximum retries for self-improvement

// Core agent logic
class CodingAgent {
  // Accepts a natural language prompt
  // Returns path to generated file
  async generate(prompt: string): Promise<string> {
    // Create unique output file path with timestamp
    const filePath = path.join(OUTPUT_DIR, `agent_generated-${Date.now()}.ts`);
    
    // Generate initial code using LLM
    const code = await this.generateCode(prompt);
    
    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    
    // Save generated code to file
    fs.writeFileSync(filePath, code);

    // Execute and iteratively improve
    await this.executeAndImprove(filePath, prompt);
    
    return filePath;
  }

  // Uses AI model to transform prompt into code
  private async generateCode(prompt: string): Promise<string> {
    const { text } = await generateText({
      model: models.googleGeminiFlash,
      system: "Generate ONLY executable TypeScript code with no explanations",
      prompt
    });
  
    return this.cleanCode(text);
  }

  // Attempts execution and improves code on failure
  private async executeAndImprove(filePath: string, originalPrompt: string) {
    let attempts = 0;
    let lastError: Error = new Error('Unknown error');

    // Retry loop (max attempts defined in config)
    while (attempts < MAX_SELF_IMPROVE_ATTEMPTS) {
      try {
        // Try executing the current code
        const result = await this.executeCode(filePath);
        console.log('Execution successful:', result);
        return;
      } catch (error: any) {
        // On failure:
        lastError = error;
        console.log(`Attempt ${attempts + 1}: Improving code...`);
        
        // Get current code content
        const currentCode = fs.readFileSync(filePath, 'utf-8');
        
        // Generate improved version
        const improvedCode = await this.improveCode(
          currentCode,
          error.message,
          originalPrompt
        );
        
        // Save improved code
        fs.writeFileSync(filePath, improvedCode);
        attempts++;
      }
    }

    // If all attempts fail
    throw new Error(`Failed after ${attempts} attempts: ${lastError.message}`);
  }

  // Uses top-level imports for execution (exec and promisify)
  private async executeCode(filePath: string): Promise<string> {
    // Validate the file exists and is TypeScript
    if (!fs.existsSync(filePath)) {
      throw new Error(`TypeScript file not found: ${filePath}`);
    }
    if (!filePath.endsWith('.ts')) {
      throw new Error('Only .ts files can be executed');
    }

    // Prepare TypeScript execution command using ts-node from the root node_modules
    const command = `ts-node ${filePath}`;
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 10000, // 10 second maximum
        maxBuffer: 1024 * 1024 * 5, // 5MB output limit
        env: {
          ...process.env,
          TS_NODE_TRANSPILE_ONLY: 'true' // Faster execution
        }
      });

      // Handle compiler errors
      if (stderr && stderr.includes('TypeScript error')) {
        throw new Error(`TypeScript compilation failed:\n${stderr}`);
      }

      return stdout;
    } catch (error: any) {
      // Enhanced error handling
      if (error.code === 'ETIMEDOUT') {
        throw new Error('TypeScript execution timed out (10s limit)');
      }
      if (error.signal === 'SIGKILL') {
        throw new Error('Process was terminated (memory limit exceeded)');
      }
      throw new Error(`TypeScript execution failed:\n${error.stderr || error.message}`);
    }
  }

  // Uses error feedback to generate better code
  private async improveCode(code: string, errorMessage: string, originalPrompt: string): Promise<string> {
    // Construct improvement prompt with context
    const improvementPrompt = `The following TypeScript code failed with error: "${errorMessage}". 
Please provide an improved version that fixes the error. 
Original prompt: "${originalPrompt}".\n\nCode:\n${code}`;
    
    // Get improved code from LLM
    const { text } = await generateText({
      model: models.googleGeminiFlash,
      system: "Improve the TypeScript code to fix errors without adding extra explanation.",
      prompt: improvementPrompt
    });
    
    return this.cleanCode(text);
  }

  // Removes markdown code blocks and trims whitespace
  private cleanCode(code: string): string {
    return code.replace(/```(typescript|ts)?/g, '').trim();
  }
}

// CLI Interface
if (require.main === module) {
  // Create agent instance
  const agent = new CodingAgent();
  
  // Get prompt from CLI arguments
  const prompt = process.argv[2];
  
  // Validate input
  if (!prompt) {
    console.log('Usage: npx tsx ./scripts/src/myAgent.ts "<your prompt here>"');
    process.exit(1);
  }

  // Run generation and handle results
  agent.generate(prompt)
    .then(filePath => console.log(`Code generated at: ${filePath}`))
    .catch(err => console.error('Agent failed:', err));
}