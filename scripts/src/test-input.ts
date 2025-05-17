import { TaskHandler } from './ai/inputHandler';

const handler = new TaskHandler();
const testInput = {
  prompt: "Create a simple React button component",
  context: {
    files: ['./src/components/Button.tsx'],
    workspace: process.cwd(),
    language: 'typescript'
  },
  mode: 'generate' as const
};

// Test input handling
handler.processInput(testInput)
  .then(result => console.log('Input Processing Result:', result))
  .catch(error => console.error('Input Processing Error:', error));