import { CodeGenerator } from './ai/codeGenerator';

const generator = new CodeGenerator();
const testPrompt = "Create a simple React button component";
const testContext = {
  language: 'typescript',
  files: ['./src/components/Button.tsx'],
  workspace: process.cwd()
};

// Test code generation
generator.generateCode(testPrompt, testContext)
  .then(result => console.log('Code Generation Result:', result))
  .catch(error => console.error('Code Generation Error:', error));