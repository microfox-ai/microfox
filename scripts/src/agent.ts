import { generateText } from 'ai';
import path from 'path';
import fs from 'fs';
import { models } from './ai/models'; // Microfox's configured AI models
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const OUTPUT_DIR = path.join(__dirname, './agent_output'); // Directory to save generated code files
const MAX_SELF_IMPROVE_ATTEMPTS = 3; // Max retries for self-improvement

// Supported languages type
type SupportedLang = 'typescript' | 'python' | 'java';

// Core agent class
class CodingAgent {
  /**
   * Generates code from prompt in the specified language,
   * saves to file, executes and self-improves on failure.
   * @param prompt Natural language instruction for code generation
   * @param language Programming language ('typescript' | 'python' | 'java')
   * @returns Path to generated code file
   */
  async generate(prompt: string, language: SupportedLang = 'typescript'): Promise<string> {
    const ext = this.getFileExtension(language);
    const filePath = path.join(OUTPUT_DIR, `agent_generated-${Date.now()}.${ext}`);

    // Generate initial code using LLM
    const code = await this.generateCode(prompt, language);

    // Ensure output directory exists
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Save generated code to file
    fs.writeFileSync(filePath, code);

    // Try to execute and improve code if needed
    await this.executeAndImprove(filePath, prompt, language);

    return filePath;
  }

  /**
   * Calls LLM to generate code for the given prompt and language
   */
  private async generateCode(prompt: string, language: SupportedLang): Promise<string> {
    const systemMessage = this.getSystemMessage(language);

    const { text } = await generateText({
      model: models.googleGeminiFlash,
      system: systemMessage,
      prompt
    });

    return this.cleanCode(text);
  }

  /**
   * Returns a system message to guide the LLM for code generation
   */
  private getSystemMessage(language: SupportedLang): string {
    switch (language) {
      case 'typescript':
        return "Generate ONLY executable TypeScript code with no explanations";
      case 'python':
        return "Generate ONLY executable Python code with no explanations";
      case 'java':
        return "Generate ONLY executable Java code with no explanations";
      default:
        return "Generate ONLY executable code with no explanations";
    }
  }

  /**
   * Returns appropriate file extension for the language
   */
  private getFileExtension(language: SupportedLang): string {
    switch (language) {
      case 'typescript':
        return 'ts';
      case 'python':
        return 'py';
      case 'java':
        return 'java';
      default:
        return 'txt';
    }
  }

  /**
   * Attempts to execute the code file,
   * and uses feedback to improve code on failure.
   */
  private async executeAndImprove(filePath: string, originalPrompt: string, language: SupportedLang) {
    let attempts = 0;
    let lastError: Error = new Error('Unknown error');

    while (attempts < MAX_SELF_IMPROVE_ATTEMPTS) {
      try {
        // Execute code file
        const result = await this.executeCode(filePath, language);
        console.log('Execution successful:', result);
        return; // success, exit loop
      } catch (error: any) {
        lastError = error;
        console.log(`Attempt ${attempts + 1}: Improving code due to error:`)
        console.log(error.message);

        // Read current code content
        const currentCode = fs.readFileSync(filePath, 'utf-8');

        // Generate improved code based on error and original prompt
        const improvedCode = await this.improveCode(
          currentCode,
          error.message,
          originalPrompt,
          language
        );

        // Save improved code
        fs.writeFileSync(filePath, improvedCode);
        attempts++;
      }
    }

    // All attempts failed, throw last error
    throw new Error(`Failed after ${attempts} attempts: ${lastError.message}`);
  }

  /**
   * Executes the code file depending on the language.
   * - TypeScript: runs with ts-node
   * - Python: runs with python3
   * - Java: compiles and runs with javac/java
   * @returns stdout from execution
   */
  private async executeCode(filePath: string, language: SupportedLang): Promise<string> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`${language} file not found: ${filePath}`);
    }

    let command: string;

    switch (language) {
      case 'typescript':
        if (!filePath.endsWith('.ts'))
          throw new Error('Only .ts files can be executed as TypeScript');
        command = `ts-node ${filePath}`;
        break;

      case 'python':
        if (!filePath.endsWith('.py'))
          throw new Error('Only .py files can be executed as Python');
        command = `python3 ${filePath}`;
        break;

      case 'java':
        if (!filePath.endsWith('.java'))
          throw new Error('Only .java files can be executed as Java');
        // Compile Java source file
        await execAsync(`javac ${filePath}`);
        // Run Java class by name (file name without extension)
        const className = path.basename(filePath, '.java');
        command = `java -cp ${path.dirname(filePath)} ${className}`;
        break;

      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout: 10000, // 10 seconds timeout
        maxBuffer: 1024 * 1024 * 5, // 5MB max buffer
        env: { ...process.env }
      });

      // If stderr contains output, check if it's error or warning
      if (stderr) {
        if (language === 'java' && !stderr.toLowerCase().includes('error')) {
          // Java sometimes outputs warnings to stderr, allow execution
          return stdout;
        }
        throw new Error(`${language} execution error:\n${stderr}`);
      }

      return stdout;
    } catch (error: any) {
      if (error.code === 'ETIMEDOUT') {
        throw new Error(`${language} execution timed out (10s limit)`);
      }
      if (error.signal === 'SIGKILL') {
        throw new Error(`${language} process was terminated (memory limit exceeded)`);
      }
      throw new Error(`${language} execution failed:\n${error.stderr || error.message}`);
    }
  }

  /**
   * Uses the LLM to improve the code given an error message,
   * original prompt, and programming language context.
   */
  private async improveCode(code: string, errorMessage: string, originalPrompt: string, language: SupportedLang): Promise<string> {
    const improvementPrompt = `The following ${language} code failed with error: "${errorMessage}". 
Please provide an improved version that fixes the error. 
Original prompt: "${originalPrompt}".\n\nCode:\n${code}`;

    const systemMessage = `Improve the ${language} code to fix errors without adding extra explanation.`;

    const { text } = await generateText({
      model: models.googleGeminiFlash,
      system: systemMessage,
      prompt: improvementPrompt
    });

    return this.cleanCode(text);
  }

  /**
   * Cleans LLM output by removing markdown code blocks and trimming whitespace.
   */
  private cleanCode(code: string): string {
    return code.replace(/```(typescript|ts|python|java)?/g, '').trim();
  }
}

// CLI Interface when run directly
if (require.main === module) {
  // Create agent instance
  const agent = new CodingAgent();

  // Read CLI arguments
  const prompt = process.argv[2];
  const languageArg = process.argv[3]?.toLowerCase() as SupportedLang | undefined;

  // Default to TypeScript if language not specified or invalid
  const language: SupportedLang = ['typescript', 'python', 'java'].includes(languageArg || '') ? languageArg! : 'typescript';

  if (!prompt) {
    console.log('Usage: npx tsx ./scripts/src/agent.ts "<your prompt here>" [typescript|python|java]');
    process.exit(1);
  }

  // Run agent with prompt and language
  agent.generate(prompt, language)
    .then(filePath => console.log(`Code generated at: ${filePath}`))
    .catch(err => console.error('Agent failed:', err));
}
