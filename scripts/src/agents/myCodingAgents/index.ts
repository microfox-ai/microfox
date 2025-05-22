import { generateText, LanguageModelV1 } from 'ai';
import path from 'path';
import fs from 'fs';
import { models } from '../../ai/models'; // Microfox's configured AI models
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Configuration interface for CodingAgent
 */
interface AgentConfig {
  /** Maximum number of self-improvement attempts */
  maxAttempts?: number;
  /** AI model to use for generation */
  model?: LanguageModelV1;
  /** Execution timeout in milliseconds */
  timeoutMs?: number;
  /** Output directory for generated files */
  outputDir?: string;
  /** Whether to use worker spawn for safer execution */
  useWorkerThreads?: boolean;
}

/**
 * AI-powered coding agent that generates and iteratively improves TypeScript code
 * 
 * @remarks
 * This agent follows a generate-execute-improve loop until either:
 * - The code executes successfully, or
 * - Maximum improvement attempts are reached
 * 
 * @example
 * ```typescript
 * const agent = new CodingAgent();
 * const filePath = await agent.generate("Create a function that adds two numbers");
 * ```
 */
class CodingAgent {
  private config: Required<AgentConfig>;
  private readonly DEFAULT_OUTPUT_DIR = path.join(__dirname, './agent_output');
  private readonly DEFAULT_MAX_ATTEMPTS = 3;
  private readonly DEFAULT_TIMEOUT_MS = 10000;

  /**
   * Creates a new CodingAgent instance
   * @param config - Configuration options
   */
  constructor(config: AgentConfig = {}) {
    this.config = {
      maxAttempts: config.maxAttempts ?? this.DEFAULT_MAX_ATTEMPTS,
      model: config.model ?? models.googleGeminiFlash,
      timeoutMs: config.timeoutMs ?? this.DEFAULT_TIMEOUT_MS,
      outputDir: config.outputDir ?? this.DEFAULT_OUTPUT_DIR,
      useWorkerThreads: config.useWorkerThreads ?? true,
    };
  }

  /**
   * Generates TypeScript code from natural language prompt
   * @param prompt - Natural language description of desired code
   * @returns Path to generated TypeScript file
   * @throws Error if generation fails after maximum attempts
   */
  async generate(prompt: string): Promise<string> {
    if (!prompt?.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    // Create unique output file path with timestamp
    const timestamp = Date.now();
    const filePath = path.join(this.config.outputDir, `agent_generated-${timestamp}.ts`);

    // Generate initial code using LLM
    const code = await this.generateCode(prompt);

    // Ensure output directory exists
    fs.mkdirSync(this.config.outputDir, { recursive: true });

    // Save generated code to file
    fs.writeFileSync(filePath, code);

    // Execute and iteratively improve
    await this.executeAndImprove(filePath, prompt);

    return filePath;
  }

  /**
   * Uses AI model to transform prompt into code
   * @param prompt - Natural language prompt
   * @returns Generated TypeScript code
   * @private
   */
  private async generateCode(prompt: string): Promise<string> {
    const { text } = await generateText({
      model: this.config.model,
      system: "Generate ONLY executable TypeScript code with no explanations",
      prompt,
    });

    return this.cleanCode(text);
  }

  /**
   * Attempts execution and improves code on failure
   * @param filePath - Path to the generated code file
   * @param originalPrompt - Original user prompt
   * @private
   */
  private async executeAndImprove(filePath: string, originalPrompt: string) {
    let attempts = 0;
    let lastError: Error = new Error('Unknown error');

    while (attempts < this.config.maxAttempts) {
      try {
        const result = await this.executeCode(filePath);
        console.log('Execution successful:', result);
        return;
      } catch (error: any) {
        lastError = error;
        console.log(`Attempt ${attempts + 1}/${this.config.maxAttempts}: Improving code...`);

        const currentCode = fs.readFileSync(filePath, 'utf-8');
        const improvedCode = await this.improveCode(
          currentCode,
          error.message,
          originalPrompt
        );

        fs.writeFileSync(filePath, improvedCode);
        attempts++;
      }
    }

    throw new Error(`Failed after ${attempts} attempts: ${lastError.message}`);
  }

  /**
   * Executes generated code either directly or via a spawned worker process
   * @param filePath - Path to the code file
   * @returns Execution result
   * @private
   */
  private async executeCode(filePath: string): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    if (!filePath.endsWith('.ts')) {
      throw new Error('Only .ts files can be executed');
    }

    if (this.config.useWorkerThreads) {
      return this.executeWithWorker(filePath);
    }
    return this.executeDirectly(filePath);
  }

  /**
   * Executes code in a spawned process (simulating a worker) using tsx for isolation
   * @param filePath - Path to the code file
   * @private
   */
  private async executeWithWorker(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('npx', ['tsx', filePath], {
        shell: true,
        env: {
          ...process.env,
          TS_NODE_TRANSPILE_ONLY: 'true',
        },
      });

      let stdout = '';
      let stderr = '';
      const timeout = setTimeout(() => {
        child.kill();
        reject(new Error(`Execution timed out after ${this.config.timeoutMs}ms`));
      }, this.config.timeoutMs);

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      child.on('exit', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Worker stopped with exit code ${code}\n${stderr}`));
        }
      });
    });
  }

  /**
   * Executes code directly (less secure) using tsx via npx
   * @param filePath - Path to the code file
   * @returns Execution result
   * @private
   */
  private async executeDirectly(filePath: string): Promise<string> {
    const command = `npx tsx ${filePath}`;

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: this.config.timeoutMs,
        maxBuffer: 1024 * 1024 * 5,
        env: {
          ...process.env,
          TS_NODE_TRANSPILE_ONLY: 'true',
        },
      });

      if (stderr && stderr.includes('TypeScript error')) {
        throw new Error(`TypeScript compilation failed:\n${stderr}`);
      }

      return stdout;
    } catch (error: any) {
      if (error.code === 'ETIMEDOUT') {
        throw new Error(`Execution timed out after ${this.config.timeoutMs}ms`);
      }
      if (error.signal === 'SIGKILL') {
        throw new Error('Process was terminated (memory limit exceeded)');
      }
      throw new Error(`Execution failed:\n${error.stderr || error.message}`);
    }
  }

  /**
   * Improves code based on execution error
   * @param code - Current code version
   * @param errorMessage - Error from execution
   * @param originalPrompt - Original user prompt
   * @returns Improved code version
   * @private
   */
  private async improveCode(code: string, errorMessage: string, originalPrompt: string): Promise<string> {
    const improvementPrompt = `The following TypeScript code failed with error: "${errorMessage}".
Please provide an improved version that fixes the error.
Original prompt: "${originalPrompt}".
    
Code:
${code}`;

    const { text } = await generateText({
      model: this.config.model,
      system: "Improve the TypeScript code to fix errors without adding extra explanation.",
      prompt: improvementPrompt,
    });

    return this.cleanCode(text);
  }

  /**
   * Cleans generated code by removing markdown blocks
   * @param code - Raw generated code
   * @returns Cleaned code
   * @private
   */
  private cleanCode(code: string): string {
    return code.replace(/```(typescript|ts)?/g, '').trim();
  }
}

// CLI Interface
if (require.main === module) {
  const agent = new CodingAgent();
  const prompt = process.argv[2];

  if (!prompt) {
    console.log('Usage: npx tsx ./scripts/src/agents/myCodingAgents/index.ts "<your prompt here>"');
    process.exit(1);
  }

  agent.generate(prompt)
    .then((filePath) => console.log(`Code generated at: ${filePath}`))
    .catch((err) => console.error('Agent failed:', err));
}

export { CodingAgent, AgentConfig };