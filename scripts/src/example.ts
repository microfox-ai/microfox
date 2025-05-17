import { CodingAgent } from './ai/codingAgent';

const agent = new CodingAgent({
  models: {
    primary: 'gemini-pro',
    fallback: 'gpt-4'
  },
  capabilities: ['typescript', 'javascript', 'python'],
  selfImprovement: true
});

// Test case 1: Generate new component
agent.process({
  prompt: "Create a simple React button component",
  context: {
    files: ['./src/components/Button.tsx'],
    workspace: process.cwd(),
    language: 'typescript'
  },
  mode: 'generate'
}).then(result => {
  console.log('Generation Result:', result);
}).catch(error => {
  console.error('Generation Error:', error);
});

// Test case 2: Modify existing code
agent.process({
  prompt: "Add hover effects to the button",
  context: {
    files: ['./src/components/Button.tsx'],
    workspace: process.cwd(),
    language: 'typescript'
  },
  mode: 'modify'
}).then(result => {
  console.log('Modification Result:', result);
}).catch(error => {
  console.error('Modification Error:', error);
});

// Test case 3: Test self-improvement
agent.process({
  prompt: "Optimize the component for accessibility",
  context: {
    files: ['./src/components/Button.tsx'],
    workspace: process.cwd(),
    language: 'typescript'
  },
  mode: 'improve'
}).then(result => {
  console.log('Improvement Result:', result);
}).catch(error => {
  console.error('Improvement Error:', error);
});

// Generate new code
export {};

agent.process({
  prompt: "Create a React component for user authentication",
  context: {
    files: ['./src/components/'],
    workspace: process.cwd(),
    language: 'typescript'
  },
  mode: 'generate'
});

// Improve existing code
agent.process({
  prompt: "Optimize the authentication component for performance",
  context: {
    files: ['./src/components/Auth.tsx'],
    workspace: process.cwd(),
    language: 'typescript'  // Add the language property instead of mode
  },
  mode: 'improve'  // mode should be at the top level, not in context
});