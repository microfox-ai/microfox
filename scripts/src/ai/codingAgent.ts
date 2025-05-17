import { TaskHandler, TaskInput } from './inputHandler';
import { CodeGenerator } from './codeGenerator';
import { SelfImprovementAgent } from './selfImprovement';
import { Deployer } from './deployment';

interface AgentConfig {
  models: {
    primary: string;
    fallback: string;
  };
  capabilities: string[];
  selfImprovement: boolean;
}

export class CodingAgent {
  private taskHandler: TaskHandler;
  private codeGenerator: CodeGenerator;
  private selfImprovement: SelfImprovementAgent;
  private deployer: Deployer;

  constructor(private config: AgentConfig) {
    this.taskHandler = new TaskHandler();
    this.codeGenerator = new CodeGenerator();
    this.selfImprovement = new SelfImprovementAgent();
    this.deployer = new Deployer();
  }

  async process(input: TaskInput) {
    try {
      // Process input
      const processedInput = await this.taskHandler.processInput(input);

      // Generate code
      const generatedCode = await this.codeGenerator.generateCode(
        processedInput.prompt,
        processedInput.context
      );

      // Deploy if needed
      if (input.mode !== 'improve') {
        await this.deployer.deploy(generatedCode.code, {
          path: generatedCode.path,
          dependencies: generatedCode.dependencies
        });
      }

      // Improve capabilities if enabled
      if (this.config.selfImprovement) {
        await this.selfImprovement.updateCapabilities();
      }

      return {
        success: true,
        code: generatedCode,
        deploymentStatus: 'success'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
}