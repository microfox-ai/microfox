// src/utils/code-executor.ts

import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsage?: number;
}

interface ExecutionOptions {
  timeout?: number;
  memory?: number; // Memory limit in MB
  language?: string;
  dependencies?: { name: string; version: string }[];
  testMode?: boolean;
}

export class CodeExecutor {
  private readonly tempDir: string;
  private readonly supportedLanguages = new Set([
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'go',
  ]);

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'coding-agent');
    this.initializeTempDirectory();
  }

  /**
   * Initialize temporary directory for code execution
   */
  private async initializeTempDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
      throw new Error('Failed to initialize execution environment');
    }
  }

  /**
   * Execute the generated code
   */
  async execute(
    code: string,
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const {
      timeout = 30000, // 30 seconds default timeout
      memory = 512, // 512MB default memory limit
      language = 'javascript',
      dependencies = [],
      testMode = false,
    } = options;

    if (!this.supportedLanguages.has(language.toLowerCase())) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const executionId = uuidv4();
    const workDir = path.join(this.tempDir, executionId);

    try {
      // Create isolated execution directory
      await fs.mkdir(workDir, { recursive: true });

      // Set up execution environment
      await this.setupExecutionEnvironment(workDir, language, dependencies);

      // Write code to file
      const codeFile = await this.writeCodeToFile(workDir, code, language);

      // Execute the code
      const result = await this.runCode(codeFile, {
        workDir,
        timeout,
        memory,
        language,
        testMode,
      });

      return result;
    } catch (error) {
      console.error('Execution error:', error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    } finally {
      // Cleanup
      await this.cleanup(workDir);
    }
  }

  /**
   * Set up the execution environment with necessary dependencies
   */
  private async setupExecutionEnvironment(
    workDir: string,
    language: string,
    dependencies: { name: string; version: string }[]
  ): Promise<void> {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        await this.setupNodeEnvironment(workDir, dependencies);
        break;
      case 'python':
        await this.setupPythonEnvironment(workDir, dependencies);
        break;
      // Add setup for other languages as needed
    }
  }

  /**
   * Set up Node.js environment
   */
  private async setupNodeEnvironment(
    workDir: string,
    dependencies: { name: string; version: string }[]
  ): Promise<void> {
    const packageJson = {
      name: 'code-execution',
      version: '1.0.0',
      dependencies: dependencies.reduce(
        (acc, dep) => ({ ...acc, [dep.name]: dep.version }),
        {}
      ),
    };

    await fs.writeFile(
      path.join(workDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Install dependencies
    if (dependencies.length > 0) {
      await this.runCommand('npm install', workDir);
    }
  }

  /**
   * Set up Python environment
   */
  private async setupPythonEnvironment(
    workDir: string,
    dependencies: { name: string; version: string }[]
  ): Promise<void> {
    if (dependencies.length > 0) {
      const requirementsTxt = dependencies
        .map(dep => `${dep.name}==${dep.version}`)
        .join('\n');
      
      await fs.writeFile(
        path.join(workDir, 'requirements.txt'),
        requirementsTxt
      );

      await this.runCommand('pip install -r requirements.txt', workDir);
    }
  }

  /**
   * Write code to a file
   */
  private async writeCodeToFile(
    workDir: string,
    code: string,
    language: string
  ): Promise<string> {
    const extension = this.getFileExtension(language);
    const filename = `main${extension}`;
    const filepath = path.join(workDir, filename);

    await fs.writeFile(filepath, code);
    return filepath;
  }

  /**
   * Get file extension for language
   */
  private getFileExtension(language: string): string {
    const extensions: { [key: string]: string } = {
      javascript: '.js',
      typescript: '.ts',
      python: '.py',
      java: '.java',
      cpp: '.cpp',
      go: '.go',
    };

    return extensions[language.toLowerCase()] || '.txt';
  }

  /**
   * Run the code file
   */
  private async runCode(
    filepath: string,
    options: {
      workDir: string;
      timeout: number;
      memory: number;
      language: string;
      testMode: boolean;
    }
  ): Promise<ExecutionResult> {
    const startTime = process.hrtime();
    const command = this.getExecutionCommand(filepath, options.language, options.testMode);

    try {
      const result = await this.runCommand(command, options.workDir, options.timeout);
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const executionTime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

      return {
        success: true,
        output: result,
        executionTime,
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024, // Convert to MB
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Execution failed',
      };
    }
  }

  /**
   * Get the command to execute code based on language
   */
  private getExecutionCommand(
    filepath: string,
    language: string,
    testMode: boolean
  ): string {
    const filename = path.basename(filepath);
    
    const commands: { [key: string]: string } = {
      javascript: testMode ? `jest ${filename}` : `node ${filename}`,
      typescript: testMode ? `jest ${filename}` : `ts-node ${filename}`,
      python: testMode ? `pytest ${filename}` : `python ${filename}`,
      java: `java ${filename}`,
      cpp: `g++ ${filename} -o program && ./program`,
      go: `go run ${filename}`,
    };

    return commands[language.toLowerCase()] || '';
  }

  /**
   * Run a shell command
   */
  private runCommand(
    command: string,
    cwd: string,
    timeout?: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, [], {
        cwd,
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let output = '';
      let error = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      const timer = timeout
        ? setTimeout(() => {
            process.kill();
            reject(new Error('Execution timeout'));
          }, timeout)
        : null;

      process.on('close', (code) => {
        if (timer) clearTimeout(timer);
        
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(error || `Process exited with code ${code}`));
        }
      });

      process.on('error', (err) => {
        if (timer) clearTimeout(timer);
        reject(err);
      });
    });
  }

  /**
   * Clean up temporary files
   */
  private async cleanup(workDir: string): Promise<void> {
    try {
      await fs.rm(workDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  /**
   * Run tests for the generated code
   */
  async runTests(
    code: string,
    tests: string,
    options: ExecutionOptions = {}
  ): Promise<ExecutionResult> {
    const workDir = path.join(this.tempDir, uuidv4());

    try {
      await fs.mkdir(workDir, { recursive: true });

      // Write main code and test code
      const language = options.language || 'javascript';
      const mainFile = await this.writeCodeToFile(workDir, code, language);
      const testFile = await this.writeCodeToFile(
        workDir,
        tests,
        language
      );

      // Run tests
      return await this.execute(tests, {
        ...options,
        testMode: true,
      });
    } finally {
      await this.cleanup(workDir);
    }
  }

  /**
   * Validate code safety
   */
  async validateCodeSafety(code: string): Promise<boolean> {
    // List of potentially dangerous patterns
    const dangerousPatterns = [
      /eval\s*\(/,
      /exec\s*\(/,
      /child_process/,
      /require\s*\(\s*['"]child_process['"]\s*\)/,
      /process\.env/,
      /fs\./,
      /File/,
      /require\s*\(\s*['"]fs['"]\s*\)/,
      /http\.createServer/,
      /net\./,
      /crypto\./,
    ];

    // Check for dangerous patterns
    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return false;
      }
    }

    return true;
  }
}

// Example usage:
/*
async function example() {
  const executor = new CodeExecutor();

  const code = `
    function add(a, b) {
      return a + b;
    }
    console.log(add(2, 3));
  `;

  try {
    // Validate code safety
    const isSafe = await executor.validateCodeSafety(code);
    if (!isSafe) {
      throw new Error('Code contains potentially unsafe operations');
    }

    // Execute code
    const result = await executor.execute(code, {
      language: 'javascript',
      timeout: 5000,
      memory: 256,
    });

    console.log('Execution result:', result);

    // Run tests if available
    const tests = `
      test('add function works correctly', () => {
        expect(add(2, 3)).toBe(5);
      });
    `;

    const testResult = await executor.runTests(code, tests, {
      language: 'javascript',
    });

    console.log('Test result:', testResult);
  } catch (error) {
    console.error('Error:', error);
  }
}
*/